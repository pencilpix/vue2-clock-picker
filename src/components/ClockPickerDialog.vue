<template>
  <div class="clock-picker__dialog" :class="{ 'clock-picker__dialog--active': opened }">
    <transition name="fade" mode="out-in">
      <div class="clock-picker__dialog-drop" v-if="opened" @click="onOverlayClick()"></div>
    </transition>

    <transition name="scale" mode="out-in">
      <div class="clock-picker__dialog-body" v-if="opened">
        <div class="clock-picker__dialog-header" :style="{
          backgroundColor: activeColor,
          color: activeTextColor,
          fontFamily: font,
        }">
          <span @click="isHoursSet = false">{{ tempHours || hours }}</span>
          <b>:</b>
          <span>{{ tempMins || minutes }}</span>
        </div>
        <div class="clock-picker__dialog-content">
          <transition name="scale" mode="out-in">
            <clock-picker-hours
                v-if="!isHoursSet"
                :disabled-from="disabledHoursFrom"
                :disabled-to="disabledHoursTo"
                :disabled-mins-from="disabledMinutesFrom"
                :disabled-mins-to="disabledMinutesTo"
                :value="hours"
                :color="color"
                :disabled-color="disabledColor"
                :active-color="activeColor"
                :active-text-color="activeTextColor"
                :font="font"
                @set-temp-hours="onSetTempHours($event)"
                @set="setHours($event)">
            </clock-picker-hours>
          </transition>
          <transition name="scale" mode="out-in">
            <clock-picker-minutes
                v-if="isHoursSet"
                :should-disable-all="shouldDisableAllMinutes"
                :should-disable-from="shouldDisableFrom"
                :disabled-from="disabledMinutesFrom"
                :disabled-to="disabledMinutesTo"
                :disabled-hr-from="disabledHoursFrom"
                :disabled-hr-to="disabledHoursTo"
                :value="minutes"
                :color="color"
                :disabled-color="disabledColor"
                :active-color="activeColor"
                :active-text-color="activeTextColor"
                :font="font"
                @set-temp-mins="onSetTempMins($event)"
                @set="setMinutes($event)">
            </clock-picker-minutes>
          </transition>
        </div>
        <div class="clock-picker__dialog-actions">
          <button type="button" class="clock-picker__dialog-action"
              :style="{ color: activeColor }"
              @click="cancel">{{ cancelText }}</button>

          <button type="button" class="clock-picker__dialog-action"
              :disabled="isDoneDisabled"
              :style="{ color: isDoneDisabled ? disabledColor : activeColor }"
              @click="done">{{ doneText }}</button>
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

  props: {
    disabledFrom: { type: String, default: null },
    disabledTo: { type: String, default: null },
    initialValue: { type: String, default: '00:00' },
    cancelText: { type: String, default: null },
    doneText: { type: String, default: null },
    activeColor: { type: String, default: 'black' },
    activeTextColor: { type: String, default: 'white' },
    color: { type: String, default: '#757575' },
    disabledColor: { type: String, default: '#ddd' },
    closeOnOverlay: { type: Boolean, default: false },
    font: { type: String, default: '' },
  },



  components: {
    ClockPickerHours,
    ClockPickerMinutes,
  },


  watch: {
    initialValue() {
      this.updateTime();
    },
  },



  data() {
    return {
      opened: false,
      hours: this.initialValue.slice(0, 2),
      minutes: this.initialValue.slice(3, 5),
      isHoursSet: false,
      isMinutesSet: false,
      tempHours: '',
      tempMins: '',
    };
  },



  computed: {
    /**
     * get the hour should start disable from
     * @return {String} in format HH
     */
    disabledHoursFrom() {
      const { disabledFrom } = this;
      if (disabledFrom) {
        return disabledFrom.slice(0, 2);
      }
      return null;
    },


    /**
     * get the minutes should start disable from
     * @return {String} in format MM
     */
    disabledMinutesFrom() {
      const { disabledFrom } = this;
      if (disabledFrom) {
        return disabledFrom.slice(3, 5);
      }

      return null;
    },


    /**
     * get the hours should start disable to
     * @return {String} in format HH
     */
    disabledHoursTo() {
      const { disabledTo } = this;
      if (disabledTo) {
        return disabledTo.slice(0, 2);
      }
      return null;
    },


    /**
     * get the minutes should start disable to
     * @return {String} in format MM
     */
    disabledMinutesTo() {
      const { disabledTo, isHoursSet, disabledHoursTo, hours } = this;

      if (disabledTo && !(isHoursSet && hours !== disabledHoursTo)) {
        return disabledTo.slice(3);
      }

      return null;
    },


    /**
     * check if should disable all minutes for selected hour or not
     * @return {Boolean}
     */
    shouldDisableAllMinutes() {
      const { isHoursSet, hours, disabledHoursTo, disabledHoursFrom } = this;
      return isHoursSet && hours < disabledHoursTo && hours > disabledHoursFrom;
    },


    /**
     * check if should start disable from/to
     * @return {Boolean}
     */
    shouldDisableFrom() {
      const { isHoursSet, hours, disabledHoursFrom } = this;
      return isHoursSet && hours === disabledHoursFrom;
    },


    /**
     * check if the done button should be disabled or not
     * @return {Boolean}
     */
    isDoneDisabled() {
      const pattern = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
      const time = `${this.hours}:${this.minutes}`;
      return !pattern.test(time);
    },
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
      this.hours = this.initialValue.slice(0, 2);
      this.minutes = this.initialValue.slice(3);
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

    updateTime() {
      this.hours = this.initialValue.slice(0, 2);
      this.minutes = this.initialValue.slice(3, 5);
    },

    /**
     * set temp values
     * to show numbers changes of hours while dragging
     */
    onSetTempHours(value) {
      this.tempHours = value;
    },

    /**
     * set temp values
     * to show numbers changes of hours while dragging
     */
    onSetTempMins(value) {
      this.tempMins = value;
    },

    onOverlayClick() {
      if (this.closeOnOverlay) {
        this.cancel();
      }
    },
  },



  mounted() {
    this.updateTime();
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
    margin: -235px -160px
    background-color: $white
    z-index: 201
    transform: scale(1)
    border-radius: 5px
    overflow: auto

  &-header
    padding: 1.5rem 1.5rem
    // background-color: #a48bd1
    // color: $white
    font-size: 2rem
    text-align: center
    user-select: none

    span
      &:hover,
      &:focus
        cursor: pointer

  &-content
    position: relative
    width: 100%
    height: 280px
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
    // color: $primary
    flex: 1
    font-size: 16px
    font-weight: 500
    line-height: 32px
    display: inline-block
    cursor: pointer

    &:hover
      background-color: $gray-light

    &:focus
      background-color: darken($gray-light, 3%)

    &:active
      background-color: darken($gray-light, 6%)

    &[disabled]
      background-color: $gray-light
      color: darken($gray-light, 6%)

      &:hover,
      &:focus,
      &:active
        cursor: not-allowed


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

