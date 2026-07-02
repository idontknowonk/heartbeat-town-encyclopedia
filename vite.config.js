import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/heartbeat-town-encyclopedia/',
  server: {
    fs: {
      allow: ['..', 'C:/Users/Admin/.gemini']
    }
  }
})
