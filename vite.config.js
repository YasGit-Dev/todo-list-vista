import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    headers: {
      'Content-Security-Policy': "script-src 'self' 'unsafe-eval';"
    }
  },
   server: {
    host: "0.0.0.0",
    port: 5173,
  }
})