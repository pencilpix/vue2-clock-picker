const VueClockPicker = require('./components/ClockPicker.vue').default;

let GlobalVue = null;
const Plugin = {
  install(Vue) {
    Vue.component('VueClockPicker', VueClockPicker);
  },
};


if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}

if (GlobalVue) {
  GlobalVue.use(Plugin);
}

module.exports = Plugin;

