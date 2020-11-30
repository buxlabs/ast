import { terser } from 'rollup-plugin-terser'
import nodePolyfills from 'rollup-plugin-node-polyfills'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default {
  input: 'index.js',
  output: [
    {
      file: 'dist/index.js',
      format: 'umd',
      name: 'AbstractSyntaxTree'
    },
    {
      file: 'dist/index.min.js',
      format: 'umd',
      plugins: [terser()],
      name: 'AbstractSyntaxTree'
    }
  ],
  plugins: [
    nodePolyfills(),
    nodeResolve(),
    commonjs(),
    json()
  ]
}
