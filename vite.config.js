// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5173 // Development port (optional)
  },
  preview: {
    port: 10000 // Render's required production port
  }
})