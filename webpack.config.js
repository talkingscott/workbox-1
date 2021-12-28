const HtmlWebpackPlugin = require('html-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');

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
  ],
};
