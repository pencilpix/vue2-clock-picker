<template>
  <div class="clock-picker">
    <div
        :class="{
          [inputContainerClass]: true,
          [inputValueClass]: hasValue,
          [inputErrorClass]: hasError && isTouched,
          [inputFocusClass]: isFocused,
        }">
      <label :for="id" v-if="label">{{ label }}</label>
      <input
          type="text"
          :id="id"
          :name="name"
          :placeholder="placeholder"
          :class="inputClass"
          v-model="inputValue"
          readonly
          ref="input"
          @click="open">
      <slot name="error">{{hasError && isTouched ? 'Error' : ''}}</slot>
    </div>

    <clock-picker-dialog ref="dialog"
          :initial-value="inputValue || '--:--'"
          :disabled-from="disabledFrom"
          :disabled-to="disabledTo"
          :done-text="doneText"
          :cancel-text="cancelText"
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
    id: { type: String, default: 'clock_picker_input'},
    required: { type: Boolean, default: false },
    value: { type: String, default: '' },
    disabledFrom: { type: String, default: null },
    disabledTo: { type: String, default: null },
    doneText: { type: String, default: 'done' },
    cancelText: { type: String, default: 'cancel' },
  },



  components: {
    ClockPickerDialog,
  },



  data() {
    return {
      isFocused: false,
      dialogOpen: false,
      inputValue: this.value,
      showError: (this.inputValue && !this.isValid()) || (this.required && !this.inputValue),
      isTouched: false,
    };
  },



  watch: {
    value() {
      this.setValue(this.value);
    },
  },



  computed: {
    /**
     * check if has error
     */
    hasError() {
      this.showError = (this.inputValue && !this.isValid()) || (this.required && !this.inputValue);
      return this.showError;
    },

    hasValue() {
      return !!this.inputValue;
    },
  },



  methods: {
    /**
     * open the dialog of clockpicker
     */
    open() {
      this.emitEvent('beforeOpen');
      this.$refs.dialog.open();
      this.$nextTick(() => {
        this.emitEvent('open');
      });
    },


    /**
     * close the dialog of clockpicker
     */
    close() {
      this.emitEvent('beforeClose');
      this.$refs.dialog.close();
      this.$nextTick(() => {
        this.emitEvent('close');
        this.isTouched = true;
      });
    },


    /**
     * emit cancel and close.
     * @param {String} time value at the cancel time.
     */
    cancel(time) {
      this.emitEvent('cancel', time);
      this.close();
    },


    /**
     * handle set time and check validation
     * @param {String} time in format HH:MM
     */
    handleDone(time) {
      this.inputValue = time;
      this.validate();
      this.$emit('timeset', time);
      this.close();
    },


    /**
     * @param {String} name event.
     * @param {any} value data to be recieved by listener
     */
    emitEvent(name, value) {
      this.$emit(name, value);
    },


    /**
     * get current value
     * @return {String} current input value in format `HH:MM`.
     */
    getValue() {
      return this.inputValue;
    },


    /**
     * set value to dedicated time
     * @param {String} time matches `HH:MM`.
     */
    setValue(time) {
      this.handleDone(time);
    },


    /**
     * check the current input value
     * is match pattern `HH:MM` or not
     * @return {Boolean}
     */
    isValid() {
      const pattern = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
      return pattern.test(this.inputValue);
    },


    /**
     * validate the current value of input
     */
    validate() {
      this.showError = (this.inputValue && !this.isValid()) || (this.required && !this.inputValue);
      this.isTouched = true;
    },
  },

  mounted() {
    if (this.value) {
      this.validate();
    }
  },
};
</script>

<style lang="sass">
@import '~theme/theme'

.clock-picker
  &__input
    border: 1px solid darken($gray-light, 10%)

  &__input--error
    &,
    &.clock-picker__input--has-value
      color: #F44336

      .clock-picker__input
        border-color: #F44336

  &__input--has-value
    .clock-picker__input
      border-color: #00E676

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
    font-weight: 500
    font-size: 13px

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

    &[disabled]
      opacity: .4 !important
      cursor: default
      &,
      &:active,
      &:hover,
      &:focus
        background-color: $gray-light
        color: $gray



</style>

