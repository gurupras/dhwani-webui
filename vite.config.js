import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'

import config from 'config'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: config.backend.server.vitePort,
    proxy: {
      '/ws': {
        target: config.backend.server.proxyPath,
        ws: true
      }
    }
  },
  plugins: [
    vue(),
    Components({
      resolvers: IconsResolver()
    }),
    Icons()
  ]
})
