import { defineConfig } from 'vitest/config'
// import { resolve } from 'node:path'

export default defineConfig({
  // root: resolve(__dirname, 'test'),
  optimizeDeps: {
    disabled: true
  },
  test: {
    testTimeout: 30000
  }
})
