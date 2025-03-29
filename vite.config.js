// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5173 // Development port (optional)
  },
  preview: {
    host: '0.0.0.0',
    port: 10000  
  }
})