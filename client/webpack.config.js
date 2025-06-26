import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import Dotenv from 'dotenv-webpack'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default (env, argv) => {
  const isDev = argv.mode === "development";

  return {
    entry: {
      index: './src/index.tsx',
    },
    mode: isDev ? "development" : "production",
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html"
      }),
      new Dotenv({
        path: `./.env.${isDev ? 'development' : 'production'}`
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'public', 
            to: '.',
            globOptions: {
              ignore: ['**/index.html']
            }
          }
        ]
      })
    ],
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"]
        }
      ]
    },
    devServer: {
      static: "./dist",
      hot: true,
      port: 3000,
      open: false
    },
    performance: {
      hints: false
    }
  }
}