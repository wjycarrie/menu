import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

// TEST
// https://vitejs.dev/config/
export default defineConfig({
  base: '/menu/',
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia'],
          'ui': ['vant', 'v-calendar'],
        }
      }
    }
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: true,
    cors: true
  }
})
