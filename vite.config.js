import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/GameQrodeFach/',
  build: {
    outDir: 'dist',
  },
  server: {
    host: true,
    port: 3000,
  }
})
