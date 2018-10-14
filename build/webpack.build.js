const path = require('path');
const config = require('./webpack.base');
const merge = require('webpack-merge');

module.exports = [
  merge(config, {
    entry: path.resolve(__dirname, '../src/index.plugin.js'),
    output: {
      filename: 'vue2-clock-picker.plugin.js',
      libraryTarget: 'umd',
      library: 'VueClockPickerPlugin',
    },
  }),

  merge(config, {
    entry: path.resolve(__dirname, '../src/components/ClockPicker.vue'),
    output: {
      filename: 'vue2-clock-picker.es.js',
      libraryTarget: 'umd',
      library: 'VueClockPicker',
      umdNamedDefine: true,
    },
  }),

  merge(config, {
    entry: path.resolve(__dirname, '../src/index.js'),
    output: {
      filename: 'vue2-clock-picker.js',
      libraryTarget: 'umd',
      library: 'VueClockPicker',
      umdNamedDefine: true,
    },
  }),
];



