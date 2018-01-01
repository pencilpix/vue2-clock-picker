<template>
  <div class="clock-picker__dialog" :class="{ 'clock-picker__dialog--active': opened }">
    <transition name="fade" mode="out-in">
      <div class="clock-picker__dialog-drop" v-if="opened" @click="close"></div>
    </transition>

    <transition name="scale" mode="out-in">
      <div class="clock-picker__dialog-body" v-if="opened">
        <div class="clock-picker__dialog-header">
          <span @click="isHoursSet = false">{{ hours }}</span>:<span>{{ minutes }}</span>
        </div>
        <div class="clock-picker__dialog-content">
          <transition name="scale" mode="out-in">
            <clock-picker-hours :value="hours" @set="setHours($event)" v-if="!isHoursSet"></clock-picker-hours>
          </transition>
          <transition name="scale" mode="out-in">
            <clock-picker-minutes :value="minutes" @set="setMinutes($event)" v-if="isHoursSet"></clock-picker-minutes>
          </transition>
        </div>
        <div class="clock-picker__dialog-actions">
          <button type="button" class="clock-picker__dialog-action" @click="cancel">CANCEL</button>
          <button type="button" class="clock-picker__dialog-action" @click="done">DONE</button>
        </div>
      </div>
    </transition>
  </div>
</template>


<script>
import ClockPickerHours from './ClockPickerHours.vue';
import ClockPickerMinutes from './ClockPickerMinutes.vue';

export default {
  name: 'ClockPickerDialog',

  components: {
    ClockPickerHours,
    ClockPickerMinutes,
  },

  data() {
    return {
      opened: false,
      hours: '00',
      minutes: '00',
      isHoursSet: false,
      isMinutesSet: false,
    };
  },


  methods: {
    /**
     * open the dialog
     */
    open() {
      this.opened = true;
    },

    /**
     * close the dialog
     * and reset indicators.
     */
    close() {
      this.opened = false;
      this.isHoursSet = false;
      this.isMinutesSet = false;
    },

    /**
     * emit cancel to parent component with the current value.
     */
    cancel() {
      this.$emit('cancel', `${this.hours}:${this.minutes}`);
    },

    /**
     * set hours value
     * @param {String} value as HH
     */
    setHours(value) {
      this.hours = value;
      this.isHoursSet = true;
    },

    /**
     * set minutes value
     * @param {String} as MM
     */
    setMinutes(value) {
      this.minutes = value;
      this.isMinutesSet = true;
    },

    /**
     * emit done to the parent
     * with value in format HH:MM
     */
    done() {
      this.$emit('done', `${this.hours}:${this.minutes}`);
    },
  },
};
</script>


<style lang="sass">
@import '~theme/theme'

.clock-picker__dialog
  display: none

  &--active
    display: block

  &-drop
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: rgba(0, 0, 0, .2)
    z-index: 200

  &-body
    position: fixed
    top: 50%
    left: 50%
    max-width: 100%
    max-height: 100%
    overflow: auto
    width: 320px
    margin: -180px -160px
    background-color: $white
    z-index: 201
    transform: scale(1)
    border-radius: 5px
    overflow: auto

  &-header
    padding: 1.5rem 1.5rem
    background-color: #a48bd1
    color: $white
    font-size: 2rem
    text-align: center

    span
      &:hover,
      &:focus
        cursor: pointer

  &-content
    position: relative
    width: 100%
    height: 240px
    margin-top: 24px
    margin-bottom: 24px

    .clock-picker__hours,
    .clock-picker__minutes
      position: absolute

  &-actions
    display: flex
    flex-direction: row
    border-top: 1px solid $gray-light
    padding: .5rem

  &-action
    padding: 0 1rem
    margin: 0
    background: transparent
    border: 0
    color: $primary
    flex: 1
    font-size: 16px
    font-weight: 500
    line-height: 32px
    display: inline-block

  .scale-enter-active,
  .scale-leave-active,
  .fade-enter-active,
  .fade-leave-active
    transition: all .3s ease

  .scale-enter,
  .scale-leave-active
    opacity: 0
    transform: scale(0)

  .fade-enter,
  .fade-leave-active
    opacity: 0
</style>

