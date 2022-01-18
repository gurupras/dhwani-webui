<script setup>
import Code from './components/code.vue'
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
</script>

<template>
<div>
  <div class="container">
    <div class="columns">
      <div class="column is-offset-2-widescreen is-two-thirds-widescreen">
        <div class="section">
          <h5 class="subtitle is-size-5">Enter remote ID</h5>
          <Code :num-digits="9" v-model="remotePeerID" ref="code"/>
          <div class="has-text-right">
            <button class="button" :class="{'is-link': remotePeerID.length === 9}" :disabled="remotePeerID.length !== 9" @click="startConnect">Connect</button>
          </div>
          <audio ref="audio"/>
          <div ref="logs"></div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
/* global BACKEND_WEBSOCKET_URL */
import chunk from 'lodash/chunk'
import { createPeer } from './js/websocket-peer'
import { v4 as uuidv4 } from 'uuid'

export default {
  data () {
    return {
      ws: undefined,
      localBackend: undefined,
      localMode: false,
      remoteMode: false,
      localPeerID: undefined,
      peer: undefined,
      remotePeerID: ''
    }
  },
  computed: {
    friendlyLocalPeerID () {
      if (!this.localPeerID) {
        return undefined
      }
      const chunks = chunk(this.localPeerID, 3)
      return chunks.map(x => x.join('')).join(' ')
    },
    friendlyRemotePeerID () {
      const chunks = chunk(this.remotePeerID, 3)
      return chunks.map(x => x.join('')).join(' ')
    }
  },
  methods: {
    async startConnect () {
      this.$refs.logs.innerHTML = ''

      const id = uuidv4()
      const websocketURL = `${BACKEND_WEBSOCKET_URL}/?id=${id}`
      const peer = this.peer = await createPeer(id, this.remotePeerID, {
        initiator: true,
        config: {
          iceServers: [
            {
              urls: ['stun:stun.l.google.com:19302']
            }
          ]
        },
        offerOptions: {
          offerToReceiveAudio: true
        }
      }, websocketURL)

      const log = (msg, cls) => {
        const div = document.createElement('div')
        if (cls) {
          div.classList.add(cls)
        }
        div.innerHTML = msg
        this.$refs.logs.appendChild(div)
      }

      peer.on('signal', data => {
        log(`Signal us --> ${this.remotePeerID} (type=${data.type})`, 'has-text-link')
      })
      peer.on('remote-signal', data => {
        log(`Signal ${this.remotePeerID} --> us (type=${data.type})`, 'has-text-warning')
      })
      peer.on('error', data => {
        log(`Error: ${data}`, 'has-text-danger')
      })
      peer.on('connect', () => {
        log(`Connected us <--> ${this.remotePeerID}`, 'has-text-success')
      })
      peer.on('close', () => {
        log(`Connection closed us <--> ${this.remotePeerID}`, 'has-text-danger')
      })
      peer.on('track', () => {
        log(`Track ${this.remotePeerID} --> us`, 'has-text-success')
      })
      peer.on('stream', (stream) => {
        log(`Stream ${this.remotePeerID} --> us`, 'has-text-success')
        this.$refs.audio.srcObject = stream
        this.$refs.audio.play()
      })
    }
  },
  beforeMount () {
  },
  mounted () {
    window.addEventListener('keydown', (e) => {
      if (e.target instanceof HTMLInputElement) {
        return
      }
      if (e.ctrlKey || e.altKey || e.key === 'Escape' || e.key === 'Tab' || e.key === 'ContextMenu') {
        return
      }
      // Don't handle ctrl/alt keypresses
      if (e.ctrlKey || e.altKey) {
        return
      }
      this.$refs.code.focus()
    })
  }
}
</script>
<style>
</style>
