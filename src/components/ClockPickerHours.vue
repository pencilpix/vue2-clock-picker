<template>
  <div class="clock-picker__hours">
    <div class="pm">
      <div class="pm__item"
          v-for="item in pm"
          :key="item"
          :class="['pm__item--' + itemClass(item), item === value ? 'pm__item--selected' : '']">
        <button type="button" class="clock-picker__button"
            :disabled="isDisabled(item)"
            :class="{'clock-picker__button--active': item === value}"
            @click="setValue(item)">
          {{ item }}
        </button>
      </div>
    </div>

    <div class="am">
      <div class="am__item"
          v-for="item in am"
          :key="item"
          :class="'am__item--' + itemClass(item)">
        <button type="button" class="clock-picker__button"
            :disabled="isDisabled(item)"
            :class="{'clock-picker__button--active': item === value}"
            @click="setValue(item)">
          {{ item }}
        </button>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'ClockPickerHours',

  props: {
    value: { type: String, default: '00' },
    disabledFrom: { type: String, default: null },
    disabledTo: { type: String, default: null },
  },



  data() {
    return {
    };
  },



  computed: {
    /**
     * pm hours from 13 to 00
     * @return {Array<String>} in format HH
     */
    pm() {
      return this.makeArray(13, 24);
    },


    /**
     * am hours from 00 to 12
     * @return {Array<String>} in format HH
     */
    am() {
      return this.makeArray(1, 12);
    },


    /**
     * return an array of hours should be disabled
     * @return {Array<String>} in format HH or empty [].
     */
    disabledRange() {
      const { disabledFrom, disabledTo } = this;

      if (disabledFrom === disabledTo) {
        return [];
      }

      if (disabledFrom && disabledTo) {
        return this.makeArray(Number(disabledFrom) + 1, Number(disabledTo) - 1);
      } else if (disabledFrom) {
        return this.makeArray(Number(disabledFrom) + 1, 23);
      } else if (disabledTo && disabledTo > 0) {
        return this.makeArray(0, Number(disabledTo) - 1);
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

+place-on-circle(pm, item, 1, 12, 240px, 32px)
+place-on-circle(am, item, 1, 12, 190px, 32px)

.clock-picker
  &__hours
    position: relative
    width: 100%
    height: 240px

    .pm,
    .am
      position: absolute
      top: 50%
      left: 50%
      margin: -95px

    .pm
      margin: -120px

</style>

