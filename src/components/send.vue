<template>
<div class="wrapper section">
  <div class="field is-horizontal">
    <div class="field-label is-normal">
      <label class="label" for="device-select">Select a device</label>
    </div>
    <div class="field-body">
      <div class="field is-narrow">
        <div class="control">
          <div class="select">
            <select id="device-select" v-model="device">
              <option v-for="(device, $index) in devices" :key="device.identifier" :value="device" :selected="$index === 0">{{device.name}}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
  <button class="button is-link" @click="startStream">Start Streaming</button>
  <h4 class="subtitle is-size-4" v-if="friendlyLocalPeerID">Your ID is {{friendlyLocalPeerID}}</h4>
</div>
</template>

<script>
import { defineComponent } from 'vue'
import chunk from 'lodash/chunk'
import DhwaniLocalBackend from '@/js/dhwani-local-backend'
import { useStore } from '@/stores/send'
import { useStore as useMainStore } from '@/stores/main'

export default defineComponent({
  setup () {
    const store = useStore()
    const mainStore = useMainStore()
    return {
      store,
      mainStore
    }
  },
  data () {
    return {
      started: false,
      devices: [
        {
          name: 'Default',
          id: 'default'
        }
      ],
      device: undefined
    }
  },
  computed: {
    friendlyLocalPeerID () {
      if (!this.store.localPeerID) {
        return undefined
      }
      const chunks = chunk(this.store.localPeerID, 3)
      return chunks.map(x => x.join('')).join(' ')
    }
  },
  methods: {
    async startStream () {
      const promises = [
        this.localBackend.startRTPServer(),
        this.localBackend.startAudioStream(this.device.id)
      ]
      const [result] = await Promise.all(promises)
      this.store.localPeerID = result
    }
  },
  async mounted () {
    this.localBackend = new DhwaniLocalBackend(this.mainStore.ws)
    const devices = await this.localBackend.getDevices()
    const recordableDevices = devices.filter(x => x.canRecord)
    this.devices.push(...recordableDevices)
    this.device = this.devices[0]
  }
})
</script>
