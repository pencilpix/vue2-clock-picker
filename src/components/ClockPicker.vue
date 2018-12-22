<template>
  <div class="clock-picker">
    <div
        :class="{
          [inputContainerClass]: true,
          [inputValueClass]: hasValue,
          [inputErrorClass]: hasError && isTouched,
          [inputFocusClass]: isFocused,
        }">
      <label :for="uuid" v-if="label" :class="labelClass">{{ label }}</label>
      <input
          type="text"
          :id="uuid"
          :name="name"
          :placeholder="placeholder"
          :class="inputClass"
          :value="value"
          readonly
          ref="input"
          @click="open">
      <slot name="error">{{hasError && isTouched ? 'Error' : ''}}</slot>
    </div>

    <clock-picker-dialog ref="dialog"
          :initial-value="hasError || !value ? '--:--' : value"
          :disabled-from="disabledFrom"
          :disabled-to="disabledTo"
          :done-text="doneText"
          :cancel-text="cancelText"
          :color="color"
          :disabled-color="disabledColor"
          :active-color="activeColor"
          :active-text-color="activeTextColor"
          :close-on-overlay="closeOnOverlay"
          :font="font"
          @cancel="cancel($event)"
          @done="handleDone($event)">
    </clock-picker-dialog>
  </div>
</template>

<script>
import ClockPickerDialog from './ClockPickerDialog.vue';


/**
 * generate randomly unique id
 * via random number and date
 * @return {String} unique id
 */
const ID = () => {
  const random = Math.random().toString(36).substring(2, 9);
  const now = Date.now().toString(36);
  return `clock_picker_input_${now + random}`;
};


const classes = {
  container: 'clock-picker__input-container',
  focus: 'clock-picker__input--focused',
  error: 'clock-picker__input--error',
  value: 'clock-picker__input--has-value',
  input: 'clock-picker__input',
  label: 'clock-picker__label',
};


export default {
  name: 'VueClockPicker',

  props: {
    inputContainerClass: { type: String, default: classes.container },
    inputClass: { type: String, default: classes.input },
    inputFocusClass: { type: String, default: classes.focus },
    inputErrorClass: { type: String, default: classes.error },
    inputValueClass: { type: String, default: classes.value },
    labelClass: { type: String, default: classes.label },
    placeholder: { type: String, default: '' },
    name: { type: String, default: 'time_input' },
    label: { type: String, default: '' },
    id: { type: String, default: null },
    required: { type: Boolean, default: false },
    value: { type: String, default: '' },
    disabledFrom: { type: String, default: '' },
    disabledTo: { type: String, default: '' },
    doneText: { type: String, default: 'done' },
    cancelText: { type: String, default: 'cancel' },
    activeColor: { type: String, default: '#a48bd1' },
    activeTextColor: { type: String, default: 'white' },
    color: { type: String, default: '#757575' },
    disabledColor: { type: String, default: '#ddd' },
    closeOnEsc: { type: Boolean, default: false },
    closeOnOverlay: { type: Boolean, default: false },
    font: { type: String, default: 'Roboto, arial, san-serif' },
  },



  components: {
    ClockPickerDialog,
  },



  data() {
    return {
      isFocused: false,
      dialogOpen: false,
      showError: false,
      isTouched: false,
      uuid: this.id || ID(),
      timeErrors: {},
    };
  },



  computed: {
    /**
     * check if has error
     */
    hasError() {
      return this.checkErrors() && this.isTouched;
    },

    hasValue() {
      return !!this.value;
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
     * bind Escape key to Cancel.
     */
    onKeydown(e) {
      if (e.key === 'Escape') {
        this.cancel();
      }
    },

    /**
     * handle set time and check validation
     * @param {String} time in format HH:MM
     */
    handleDone(time) {
      this.$emit('input', time);
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
      return this.value;
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
      return pattern.test(this.value);
    },


    /**
     * check if a value should be disabled
     * @param {String} value hh:mm
     * @return {Boolean}
     */
    isDisabled(value) {
      const startHr = parseInt(this.disabledFrom.slice(0, 2), 10);
      const endHr = parseInt(this.disabledTo.slice(0, 2), 10);
      const startMin = parseInt(this.disabledFrom.slice(3), 10);
      const endMin = parseInt(this.disabledTo.slice(3), 10);
      const valueHr = parseInt(value.slice(0, 2), 10);
      const valueMin = parseInt(value.slice(3), 10);
      return (startHr === endHr && startHr === valueHr && startMin === 0 && endMin === 59) ||
        (startHr === endHr && startHr === valueHr && valueMin >= startMin && valueMin <= endMin) ||
        (startHr < endHr && valueHr === startHr && startMin <= valueMin) ||
        (startHr < endHr && valueHr === endHr && endMin >= valueMin) ||
        (startHr < endHr && valueHr > startHr && valueHr < endHr) ||
        (startHr > endHr);
    },


    /**
     * check if there is any error
     * @return {Boolean} has error or not
     */
    checkErrors() {
      const required = this.required && !this.value;
      const notValid = this.value && !this.isValid();
      const disabled = this.value && this.isDisabled(this.value);
      this.timeErrors = Object.assign(this.timeErrors, { required, notValid, disabled });
      return required || notValid || disabled;
    },


    /**
     * validate the current value of input
     */
    validate() {
      this.showError = this.checkErrors();
      this.isTouched = true;
    },
  },

  mounted() {
    if (this.value) {
      this.validate();
    }

    if (this.closeOnEsc) {
      document.body.addEventListener('keydown', this.onKeydown);
    }
  },

  destroy() {
    if (this.closeOnEsc) {
      document.body.removeEventListener('keydown', this.onKeydown);
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

