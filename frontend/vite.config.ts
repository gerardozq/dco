import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // Let jsdom provide browser storage instead of Node's native storage globals.
    execArgv: ['--no-experimental-webstorage'],
  },
})
