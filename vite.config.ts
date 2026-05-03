import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Porta fixa 5173. `VITE_PORT` permite override quando 5173 não puder
  // ser liberada (ex.: outro processo persistente).
  server: {
    port: Number(process.env.VITE_PORT) || 5173,
    strictPort: true,
  },
})
