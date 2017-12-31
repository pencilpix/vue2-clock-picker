import VueClockPicker from './components/ClockPicker.vue';

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

export default Plugin;
