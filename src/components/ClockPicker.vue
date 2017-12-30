<template>
  <div class="clock-picker">
    <div :class="classes.container">
      <label for="clock_picker_input" v-if="label">{{label}}</label>
      <input
          type="text"
          id="clock_picker_input"
          :name="name"
          :placeholder="placeholder"
          :class="classes.input"
          v-model="value"
          readonly
          @click="openDialog">
    </div>
  </div>
</template>

<script>
const classes = {
  container: 'clock-picker__input-container',
  focus: 'clock-picker__input--focused',
  value: 'clock-picker__input--has-value',
  input: 'clock-picker__input',
};

export default {
  name: 'VueClockPicker',

  props: {
    inputContainerClass: { type: String },
    inputClass: { type: String },
    inputFocusClass: { type: String },
    inputValueClass: { type: String },
    placeholder: { type: String },
    name: { type: String },
    label: { type: String },
    value: {
      validator(inputValue) {
        const pattern = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
        return pattern.test(inputValue);
      },
    },
  },

  data() {
    return {
      isFocused: false,
      hasValue: !!this.value,
      dialogOpen: false,
    };
  },

  computed: {
    classes() {
      const { inputContainerClass, inputFocusClass, inputValueClass, inputClass } = this;
      const { container, input, focus, value } = classes;

      return {
        container: {
          [inputContainerClass || container]: true,
          [inputFocusClass || focus]: this.isFocused,
          [inputValueClass || value]: this.hasValue,
        },

        input: {
          [inputClass || input]: true,
        },
      };
    },
  },


  methods: {
    openDialog() {
      console.log('should open dialog');
      this.dialogOpen = true;
    },

    emitEvent(name, value) {
      this.$emit(name, value);
    },
  },
};
</script>

<style lang="sass">
@import '~theme/theme'
</style>

