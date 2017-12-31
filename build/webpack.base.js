const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const utils = require('./utils');


const resolve = dir => path.resolve(__dirname, dir);

module.exports = {
  output: {
    path: resolve('../dist/'),
  },

  resolve: {
    extensions: ['.js', '.vue', '.json', '.css', '.sass'],
    alias: {
      '@': resolve('../src/components'),
      'theme': resolve('../src/styles/'),
    },
  },

  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('../src/')],
        options: {
          formatter: require('eslint-friendly-formatter'),
        },
      },

      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: utils.cssLoaders({
            sourceMap: false,
            extract: true,
          }),
          transformToRequire: {
            video: 'src',
            source: 'src',
            img: 'src',
            image: 'xlink:href',
          },
        },
      },

      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('../src/')],
      },

      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'img/[name].[hash:7].[ext]',
        },
      },

      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name].[hash:7].[ext]',
        },
      },

      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]',
        },
      },

      ...utils.styleLoaders({ sourceMap: false, extract: true }),
    ],
  },

  plugins:  [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      sourceMap: false,
    }),

    new webpack.optimize.ModuleConcatenationPlugin(),

    new ExtractTextPlugin({
      filename: 'vue2-clock-picker.min.css',
    }),
  ],
};
