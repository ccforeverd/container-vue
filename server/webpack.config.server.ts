
import path from 'path'
import webpack from 'webpack'
import * as pkg from '../package.json'

const getExternals = (names: string[]) => names.reduce((result, item) => {
  result[item] = `require("${item}")`
  return result
}, {})

const config: webpack.Configuration = {
  entry: path.resolve(__dirname, './index.ts'),
  output: {
    path: path.resolve(__dirname, '../.server'),
    filename: 'index.js'
  },
  externals: {
    ...getExternals(Object.keys(pkg.dependencies || [])),
    ...getExternals([
      '@nuxt/core',
      '@nuxt/builder',
      'axios',
      'vm'
    ])
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules|\.d\.ts$/
      },
      {
        test: /\.d\.ts$/,
        loader: 'ignore-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.json', '.tsx', '.ts', '.js', '.d.ts'],
    alias: {
      '@': path.resolve(__dirname, '../'),
      '~': path.resolve(__dirname, '../')
    }
  }
}

export default config
