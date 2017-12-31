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
  },

  data() {
    return {};
  },



  computed: {
    minutes() {
      const items = [];
      for (let i = 0; i < 60; i++) { // eslint-disable-line
        const str = `00${i}`;
        items.push(str.slice(str.length - 2));
      }

      return items;
    },
  },



  methods: {
    isSmall(item) {
      return Number(item) % 5 !== 0;
    },

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

