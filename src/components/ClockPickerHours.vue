<template>
  <div class="clock-picker__hours">
    <div class="pm">
      <div class="pm__item"
          v-for="item in pm"
          :key="item"
          :class="['pm__item--' + itemClass(item), item === value ? 'pm__item--selected' : '']">
        <button type="button" class="clock-picker__button"
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
  },

  data() {
    return {
    };
  },



  computed: {
    pm() {
      return ['13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '00'];
    },

    am() {
      return ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    },
  },



  methods: {
    itemClass(str) {
      const no = Number(str);

      if (no === 12) {
        return 0;
      } else if (no > 12) {
        return no - 12;
      }
      return no;
    },

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

