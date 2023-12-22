import { defineConfig } from 'vitest/config'
// import { resolve } from 'node:path'

export default defineConfig({
  // root: resolve(__dirname, 'test'),
  optimizeDeps: {
    disabled: true
  },
  test: {
    onConsoleLog(log: string, type: 'stdout' | 'stderr'): any | void {
      return true
    },
    testTimeout: 30000
  }
})
