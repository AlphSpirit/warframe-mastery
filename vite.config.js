import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/warframe-mastery/",
  build: {
    polyfillDynamicImport: true
  },
  plugins: [vue()]
})
