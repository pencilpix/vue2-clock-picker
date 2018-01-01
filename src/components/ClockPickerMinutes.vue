<template>
  <div class="clock-picker__minutes">
    <div class="minutes">
      <div class="minutes__item"
          v-for="item in minutes"
          :key="item"
          :class="{
            ['minutes__item--' + Number(item)]: true,
            'minutes__item--small': isSmall(item),
            'minutes__item--selected': item === value,
          }">
        <button type="button" class="clock-picker__button"
            :disabled="isDisabled(item) || shouldDisableAll"
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
  name: 'ClockPickerMinutes',

  props: {
    buttonClass: { type: String },
    value: { type: String },
    shouldDisableAll: { type: Boolean, default: false },
    shouldDisableFrom: { type: Boolean, default: false },
    disabledFrom: { type: String, default: null },
    disabledTo: { type: String, default: null },
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

      if (shouldDisableFrom && disabledFrom) {
        return this.makeArray(disabledFrom, 59);
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
+place-on-circle(minutes, item, 1, 60, 240px, 24px)
.clock-picker
  &__minutes
    position: relative
    width: 100%
    height: 240px

    .minutes
      position: absolute
      top: 50%
      left: 50%
      margin: -120px

      &__item
        z-index: 203
        margin: -10px
        width: 20px
        height: 20px
        line-height: 20px

        .clock-picker__button
          width: 20px
          height: 20px
          line-height: 20px
          position: absolute
          top: 0
          left: 0

      &__item--small
        width: 8px
        margin: -4px
        height: 8px
        z-index: 202
        line-height: 8px

        .clock-picker__button
          background-color: $gray-light !important
          width: 8px
          height: 8px
          line-height: 8px
          text-indent: -9999px
          overflow: hidden

          &--active
            background-color: #a48bd1 !important
</style>

