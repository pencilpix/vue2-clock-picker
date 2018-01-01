<template>
  <div class="clock-picker">
    <div
        :class="{
          [inputContainerClass]: true,
          [inputValueClass]: hasValue,
          [inputErrorClass]: hasError && isTouched,
          [inputFocusClass]: isFocused,
        }">
      <label for="clock_picker_input" v-if="label">{{label}}</label>
      <input
          type="text"
          id="clock_picker_input"
          :name="name"
          :placeholder="placeholder"
          :class="inputClass"
          v-model="inputValue"
          readonly
          ref="input"
          @click="open">
      <slot name="error"></slot>
    </div>

    <clock-picker-dialog ref="dialog"
          @cancel="cancel($event)"
          @done="handleDone($event)">
    </clock-picker-dialog>
  </div>
</template>

<script>
import ClockPickerDialog from './ClockPickerDialog.vue';

const classes = {
  container: 'clock-picker__input-container',
  focus: 'clock-picker__input--focused',
  error: 'clock-picker__input--error',
  value: 'clock-picker__input--has-value',
  input: 'clock-picker__input',
};

export default {
  name: 'VueClockPicker',

  props: {
    inputContainerClass: { type: String, default: classes.container },
    inputClass: { type: String, default: classes.input },
    inputFocusClass: { type: String, default: classes.focus },
    inputErrorClass: { type: String, default: classes.error },
    inputValueClass: { type: String, default: classes.value },
    placeholder: { type: String, default: '' },
    name: { type: String, default: 'time_input' },
    label: { type: String, default: '' },
    required: { type: Boolean, default: false },
    value: { type: String, default: '' },
  },

  components: {
    ClockPickerDialog,
  },

  data() {
    return {
      isFocused: false,
      hasValue: !!this.value,
      dialogOpen: false,
      inputValue: this.value,
      showError: (this.inputValue && !this.isValid()) || (this.required && !this.inputValue),
      isTouched: false,
    };
  },

  computed: {
    hasError() {
      return this.showError;
    },
  },


  methods: {
    open() {
      this.emitEvent('beforeOpen');
      this.$refs.dialog.open();
      this.$nextTick(() => {
        this.emitEvent('open');
      });
    },

    close() {
      this.emitEvent('beforeClose');
      this.$refs.dialog.close();
      this.$nextTick(() => {
        this.emitEvent('close');
        this.isTouched = true;
      });
    },

    cancel(time) {
      this.emitEvent('cancel', time);
      this.close();
    },

    handleDone(time) {
      this.inputValue = time;
      this.hasValue = true;
      this.validate();
      this.$emit('timeset', time);
      this.close();
    },

    emitEvent(name, value) {
      this.$emit(name, value);
    },

    getValue() {
      return this.inputValue;
    },

    setValue(time) {
      this.handleDone(time);
    },


    isValid() {
      const pattern = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
      return pattern.test(this.inputValue);
    },

    validate() {
      this.showError = (this.inputValue && !this.isValid()) || (this.required && !this.inputValue);
      this.isTouched = true;
    },
  },
};
</script>

<style lang="sass">
@import '~theme/theme'

.clock-picker
  &__button
    background: none
    width: 24px
    height: 24px
    display: inline-block
    border: 0
    border-radius: 12px
    line-height: 24px
    padding: 0
    margin: 0
    cursor: pointer
    color: $gray


    &:hover
      background-color: $gray-light

    &:active
      background-color: darken($gray-light, 3%)

    &:focus
      background-color: darken($gray-light, 5%)

    &--active
      &,
      &:active,
      &:hover,
      &:focus
        background-color: $primary
        color: $white
</style>

