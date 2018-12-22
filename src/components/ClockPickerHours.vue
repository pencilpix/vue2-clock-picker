<template>
  <div class="clock-picker__hours">
    <clock-picker-canvas
        :width="280"
        :disabled="disabledRange"
        :default-value="value"
        :color="color"
        :disabled-color="disabledColor"
        :active-color="activeColor"
        :active-text-color="activeTextColor"
        :font="font"
        @value-change="$emit('set-temp-hours', $event)"
        @set="setValue($event)">
    </clock-picker-canvas>
  </div>
</template>


<script>
import ClockPickerCanvas from './ClockPickerCanvas.vue';


export default {
  name: 'ClockPickerHours',

  props: {
    value: { type: String, default: '00' },
    disabledFrom: { type: String, default: null },
    disabledTo: { type: String, default: null },
    disabledMinsFrom: { type: String, default: null },
    disabledMinsTo: { type: String, default: null },
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
    return {
    };
  },



  computed: {
    /**
     * return an array of hours should be disabled
     * @return {Array<String>} in format HH or empty [].
     */
    disabledRange() {
      const { disabledFrom, disabledTo } = this;
      const { disabledMinsFrom, disabledMinsTo } = this;
      const fromStart = disabledMinsFrom === '00' ? 0 : 1;
      const tillEnd = disabledMinsTo === '59' ? 0 : 1;

      if (disabledFrom === disabledTo) {
        return [];
      }

      if (disabledFrom && disabledTo) {
        return this.makeArray(Number(disabledFrom) + fromStart, Number(disabledTo) - tillEnd);
      } else if (disabledFrom) {
        return this.makeArray(Number(disabledFrom) + fromStart, 23);
      } else if (disabledTo && disabledTo > 0) {
        return this.makeArray(0, Number(disabledTo) - tillEnd);
      }

      return [];
    },
  },



  methods: {
    /**
     * make an array of strings that represents from start
     * to end number in format HH.
     * @param {Number} from starting number
     * @param {Number} to last number.
     * @return {Array<String>} in format HH
     */
    makeArray(from, to) {
      const items = [];
      for (let i = from; i <= to; i++) { // eslint-disable-line
        const str = `00${(i > 23) ? 0 : i}`;
        items.push(str.slice(str.length - 2));
      }
      return items;
    },


    /**
     * check if item should be disabled or not
     * @param {String} item in format HH
     * @return {Boolean}
     */
    isDisabled(item) {
      return this.disabledRange.includes(item);
    },


    /**
     * get a class number modifier
     * from the hour.
     * @param {String} str hour
     * @return {Number} [0 - 11] to use as modifier for item.
     */
    itemClass(str) {
      const no = Number(str);

      if (no === 12) {
        return 0;
      } else if (no > 12) {
        return no - 12;
      }
      return no;
    },


    /**
     * emit value to the parent component
     * @param {String} value hour as string HH
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
  &__hours
    position: relative
    width: 100%
    height: 280px
</style>

