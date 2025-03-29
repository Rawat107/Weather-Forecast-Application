// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5173 // Development port
  },
  preview: {
    host: '0.0.0.0',
    port: 10000,
    allowedHosts: [
        'weather-forecast-app-bs2a.onrender.com', // Render domain
        'localhost' //local development access
    ]
  }
})