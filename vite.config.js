import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'

import config from 'config'

// https://vitejs.dev/config/
export default defineConfig({
  server: config.backend.server,
  define: {
    BACKEND_WEBSOCKET_URL: '"wss://dhwani-backend.gurupras.me/ws"'
  },
  plugins: [
    vue(),
    Components({
      resolvers: IconsResolver()
    }),
    Icons()
  ]
})
