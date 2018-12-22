<template>
  <div class="clock-picker__minutes">
    <clock-picker-canvas
        :disabled="disabledRange"
        type="mins"
        :width="280"
        :default-value="value"
        :color="color"
        :disabled-color="disabledColor"
        :active-color="activeColor"
        :active-text-color="activeTextColor"
        :font="font"
        @value-change="$emit('set-temp-mins', $event)"
        @set="setValue($event)">
    </clock-picker-canvas>
  </div>
</template>


<script>
import ClockPickerCanvas from './ClockPickerCanvas.vue';

export default {
  name: 'ClockPickerMinutes',

  props: {
    buttonClass: { type: String },
    value: { type: String },
    shouldDisableAll: { type: Boolean, default: false },
    shouldDisableFrom: { type: Boolean, default: false },
    disabledFrom: { type: String, default: null },
    disabledTo: { type: String, default: null },
    disabledHrFrom: { type: String, default: null },
    disabledHrTo: { type: String, default: null },
    activeColor: { type: String, default: 'black' },
    activeTextColor: { type: String, default: 'white' },
    color: { type: String, default: '#757575' },
    disabledColor: { type: String, default: '#ddd' },
    font: { type: String, default: '' },
  },



  components: {
    ClockPickerCanvas,
  },



  data() {
    return {};
  },



  computed: {
    /**
     * get array of minutes.
     * @return {Array} [0 - 59]
     */
    minutes() {
      return this.makeArray(0, 59);
    },


    /**
     * return an array of hours should be disabled
     * @return {Array<String>} in format MM or empty [].
     */
    disabledRange() {
      const { disabledFrom, disabledTo, shouldDisableFrom } = this;
      const { disabledHrFrom, disabledHrTo } = this;
      const isHrsEqual = disabledHrFrom === disabledHrTo;

      if (shouldDisableFrom && disabledFrom) {
        return this.makeArray(disabledFrom, isHrsEqual ? disabledTo : 59);
      } else if (disabledTo) {
        return this.makeArray(0, disabledTo);
      }

      return [];
    },
  },



  methods: {
    /**
     * make an array of strings that represents from start
     * to end number in format MM.
     * @param {Number} from starting number
     * @param {Number} to last number.
     * @return {Array<String>} in format MM
     */
    makeArray(from, to) {
      const items = [];
      for (let i = from; i <= to; i++) { // eslint-disable-line
        const str = `00${i}`;
        items.push(str.slice(str.length - 2));
      }
      return items;
    },


    /**
     * check if item should be disabled or not
     * @param {String} item in format MM
     * @return {Boolean}
     */
    isDisabled(item) {
      return this.disabledRange.includes(item);
    },


    /**
     * check wheither the item be small or not
     * @param {String} item minute as MM
     */
    isSmall(item) {
      return Number(item) % 5 !== 0;
    },


    /**
     * emit the choosen minute
     * to the parent component
     * with event 'set'.
     */
    setValue(value) {
      this.$emit('set', value);
    },
  },
};
</script>


<style lang="sass">
@import '~theme/theme'
.clock-picker
  &__minutes
    position: relative
    width: 100%
    height: 280px
</style>

