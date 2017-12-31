const path = require('path');
const config = require('./webpack.base');
const merge = require('webpack-merge');

module.exports = [
  merge(config, {
    entry: path.resolve(__dirname, '../src/index.js'),
    output: {
      filename: 'vue2-clock-picker.min.js',
      libraryTarget: 'umd',
      library: 'VueClockPicker',
    },
  }),

  merge(config, {
    entry: path.resolve(__dirname, '../src/components/ClockPicker.vue'),
    output: {
      filename: 'vue2-clock-picker.js',
      libraryTarget: 'umd',
      library: 'vue2-clock-picker',
      umdNamedDefine: true,
    },
  }),
];



