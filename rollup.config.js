import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default [
  {
    input: 'src/Futurable.ts',
    output: [
      {
        file: 'dist/index.es.js',
        format: 'es',
        sourcemap: true
      },
      {
        file: 'dist/index.cjs.js',
        format: 'cjs',
        sourcemap: true
      }
    ],
    plugins: [
      nodeResolve(),
      typescript({
        tsconfig: './tsconfig.json'
      })
    ]
  },
  {
    input: 'src/Futurable.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts()]
  }
]
