import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Raise chunk warning limit — Bible data files are intentionally large
    chunkSizeWarningLimit: 5000,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'vendor':   ['react', 'react-dom'],
          // Bible data — split so browser can cache independently
          'kjv-ot':   ['./src/data/kjv-ot.js'],
          'kjv-nt':   ['./src/data/kjv-nt.js'],
          'niv-ot':   ['./src/data/niv-ot.js'],
          'niv-nt':   ['./src/data/niv-nt.js'],
        },
      },
    },
  },
})
