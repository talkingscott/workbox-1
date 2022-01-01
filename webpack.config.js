const HtmlWebpackPlugin = require('html-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",

  output: {
    "clean": true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Workbox with Webpack',
    }),
    new InjectManifest({
      swSrc: './src/service-worker.js',
    }),
    new CopyPlugin({
      patterns: [
        { from: 'src/icon-192.png', to: 'icon-192.png' },
        { from: 'src/icon-512.png', to: 'icon-512.png' },
        { from: 'src/icon-180.png', to: 'icon-180.png' },
        { from: 'src/maskable-icon-192.png', to: 'maskable-icon-192.png' },
        { from: 'src/maskable-icon-512.png', to: 'maskable-icon-512.png' },
        { from: 'src/maskable-icon-180.png', to: 'maskable-icon-180.png' },
        { from: 'src/manifest.webmanifest', to: 'manifest.webmanifest' },
      ],
    }),
  ],
};
