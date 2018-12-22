<template>
  <div class="clock-picker__canvas">
    <canvas
        ref="canvas"
        :width="width * pxRatio"
        :height="width * pxRatio"
        :style="{ width: width + 'px', height: width + 'px' }"
        @mouseup="onMouseUp($event)"
        @mousedown="onMouseDown($event)"
        @touchstart="onTouchStart($event)"
        @touchend="onTouchEnd($event)"
        @mousemove="onMouseMove($event)"
        @touchmove="onTouchMove($event)">
    </canvas>
  </div>
</template>


<script>
export default {
  name: 'ClockPickerCanvas',



  props: {
    /**
     * detect the size of the circle
     * width X width in px
     * also the size is differ depending on pixel ratio.
     */
    width: { type: Number, default: 300 },
    type: { type: String, default: 'hours' },
    hoursIn: { type: Number, default: 24 },
    gisture: { type: Number, default: 30 },
    disabled: { type: Array, default: () => [] },
    defaultValue: { type: String, default: null },
    activeColor: { type: String, default: '#a48bd1' },
    activeTextColor: { type: String, default: 'white' },
    color: { type: String, default: '#757575' },
    disabledColor: { type: String, default: '#ddd' },
    font: { type: String, default: '' },
  },



  data() {
    return {
      radius: null,
      ctx: null,
      anglesMap: {},
      anglesMapFactor: null,
      $canvas: null,
      value: null,
      lastEvent: { x: null, y: null, angle: null, radius: null, round: null },
      moveStart: false,
      throttleDelay: 100,
      scheduled: false,
      alpha: 0.7,
    };
  },



  computed: {
    /**
     * device pixel ratio
     */
    pxRatio() {
      return typeof window === 'undefined' ? 1 : window.devicePixelRatio;
    },
  },



  methods: {
    /**
     * initialize and prepaire
     * the initial settings of drawing
     */
    init() {
      this.getCanvasElement();
      this.setDimensions();
      this.setAnglesMap();
      this.setTypography();
      this.drawNumbers();
    },

    /**
     * save the canvas from ref to the component
     * context for ease of use
     * and save 2d context also
     */
    getCanvasElement() {
      this.$canvas = this.$refs.canvas;
      this.ctx = this.$canvas.getContext('2d');
    },

    /**
     * set the width and height depending on device
     * pixel ratio
     * __Note__: the canvas is scaled down via :style property.
     */
    setDimensions() {
      const gisture = this.gisture * this.pxRatio;
      const width = this.width * this.pxRatio;
      this.ctx.translate(width / 2, width / 2);
      this.radius = (width / 2) - (gisture / 2);
      return { x: width / 2, y: width / 2 };
    },

    /**
     * set typography settings
     */
    setTypography() {
      const size = this.pxRatio * 14;
      this.ctx.font = `normal normal 500 ${size}px ${this.font}`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
    },

    /**
     * map each no to it's equivlant angle and round.
     * round determine the number of complete cirlce.
     * means angle + (360 * round)
     */
    setAnglesMap() {
      const no = this.type === 'hours' ? 12 : 60;
      this.anglesMapFactor = 360 / no;

      for (let i = 0; i < no; i += 1) {
        const angle = (this.anglesMapFactor * i) - 90;
        this.anglesMap[this.padNo(i)] = {
          angle: this.roundAngle(angle),
          round: Math.floor((angle + 90) / 360),
        };
      }

      if (this.type !== 'hours' || this.hoursIn !== 24) return;

      for (let i = 12; i < 24; i += 1) {
        const angle = (this.anglesMapFactor * i) - 90;
        this.anglesMap[this.padNo(i)] = {
          angle: this.roundAngle(angle),
          round: Math.floor((angle + 90) / 360),
        };
      }
    },

    /**
     * draw the number in the anglesMap
     * depending on its angle and round.
     * also the disabled array control whether this value
     * can be choosen or not
     * so it will draw disabled in different color.
     * @param {Boolean} drawValue detect if draw value or just draw the value
     * cached in lastEvent object.
     */
    drawNumbers(drawValue = true) {
      const w = this.pxRatio * this.width;
      const value = [];
      const disabled = [];
      const regular = [];

      Object.keys(this.anglesMap).forEach((no) => {
        const gisture = this.gisture * this.pxRatio;
        const { angle, round } = this.anglesMap[no];
        const radius = this.radius - (round * gisture);
        const x = radius * Math.cos(angle * (Math.PI / 180));
        const y = radius * Math.sin(angle * (Math.PI / 180));

        if (this.disabled.includes(no)) {
          disabled.push([no, x, y]);
        } else if (drawValue && this.value === no) {
          value.push(no, x, y);
        } else if (!drawValue && this.lastEvent.value === no) {
          value.push(no, x, y);
        } else {
          regular.push([no, x, y]);
        }
      });
      // drawing must be in this order
      // first clearing the canvas
      // draw the center then draw the line from center to active value
      // then draw background of active value
      // then draw rest of values.
      this.ctx.clearRect(-(w / 2), -(w / 2), w, w);
      this.drawCircle(0, 0, 3, this.activeColor);
      this.drawLine(value[1], value[2], this.activeColor);
      this.drawCircle(value[1], value[2], 12, this.activeColor, this.alpha, true);

      disabled.forEach(point => this.drawDisabled(...point));
      regular.forEach(point => this.drawNormalValue(...point));
      this.drawValue(...value);
    },

    /**
     * draw disabled value
     * it can be a number or event a dot
     * depending on if hour it will be no
     * if mins and no = value multiplied by 5 draw no
     * else will draw a dot.
     */
    drawDisabled(no, x, y) {
      const { type } = this;
      const isFive = Number(no) % 5 === 0;

      if (type === 'hours' || isFive) {
        this.ctx.fillStyle = this.disabledColor;
        this.ctx.fillText(no, x, y);
        return;
      }

      this.drawCircle(x, y, 2, this.disabledColor);
    },

    /**
     * draw the active value
     * depending on if hour it will be no
     * if mins and no = value multiplied by 5 draw no
     * else will draw a dot.
     */
    drawValue(no, x, y) {
      const shouldDrawNo = this.shouldDrawNo(no);
      this.ctx.fillStyle = this.activeColor;

      if (shouldDrawNo) {
        this.ctx.fillStyle = this.activeTextColor;
        this.ctx.fillText(no, x, y);
      } else {
        this.drawCircle(x, y, 3, this.activeTextColor);
      }
    },

    /**
     * draw the normal value
     * depending on if hour it will be no
     * if mins and no = value multiplied by 5 draw no
     * else will draw a dot.
     */
    drawNormalValue(no, x, y) {
      if (this.shouldDrawNo(no)) {
        this.ctx.fillStyle = this.color;
        this.ctx.fillText(no, x, y);
        return;
      }

      this.drawCircle(x, y, 2, this.activeColor, 0.3);
    },

    /**
     * check if should draw the number or not
     * @param {String} no
     * @return {Boolean} should draw or not
     */
    shouldDrawNo(no) {
      const isFive = Number(no) % 5 === 0;
      return this.type === 'hours' || isFive;
    },

    /**
     * draw circle at given point
     * @param {Number} x center.x value
     * @param {Number} y center.y value
     * @param {Number} radius half of circle width. it will be multiplied
     * by the pxRatio
     * @param {String} clr color of the fill
     * @param {Number} [alpha] color opacity
     * @param {Boolean} [clear] clear the contour of the circle before fill
     */
    drawCircle(x, y, radius, clr, alpha = 1, clear = false) {
      const r = radius * this.pxRatio;
      const w = this.width * this.pxRatio;
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(x, y, r, 0, Math.PI * 2);
      this.ctx.closePath();

      if (clear) {
        this.ctx.clip();
        this.ctx.clearRect(-(w / 2), -(w / 2), w, w);
      }

      this.ctx.fillStyle = clr;
      this.ctx.globalAlpha = alpha;
      this.ctx.fill();
      this.ctx.restore();
      this.ctx.globalAlpha = 1;
    },

    /**
     * draw line from center to a given point
     * __note__ global alpha will be the same as this.alpha
     * and the thickness of the line will be 1 multiplied by the pxRatio.
     * @param {Number} x point.x
     * @param {Number} y point.y
     */
    drawLine(x, y, clr) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(x, y);
      this.ctx.closePath();
      this.ctx.strokeStyle = clr;
      this.ctx.globalAlpha = this.alpha;
      this.ctx.lineWidth = this.pxRatio;
      this.ctx.stroke();
      this.ctx.restore();
      this.ctx.globalAlpha = 1;
    },

    /**
     * zero pad numbers to be in format '01' or '12' ... etc.
     * @param {Number} no
     * @return {String}
     */
    padNo(no) {
      const str = `00${no}`;
      return str.slice(str.length - 2);
    },

    /**
     * rounds angle to be from 0 to 359
     * @param {Number} angle in degrees
     * @return {Number}
     */
    roundAngle(angle) {
      const angleFinal = angle < 0 ? 360 + angle : angle;
      const factor = Math.floor(angleFinal / 360);
      return angleFinal - (360 * factor);
    },

    /**
     * calculate point to draw and get selected value
     * from event
     * @param {Object} event - {clientX, clientY}
     * @param {Boolean} setValue - should set value or use lastEvent.value.
     */
    onPointChange(event, setValue = false) {
      const w = this.pxRatio * this.width;
      this.ctx.clearRect(-(w / 2), -(w / 2), w, w);
      this.calculateLastEvent(event);
      this.getSelectedNo(setValue);
      this.drawNumbers(setValue);
    },

    /**
     * calculate radius, x, y, angle and round
     * of the last event 'touch' or 'mouse'
     */
    calculateLastEvent({ clientX, clientY }) {
      const gisture = this.gisture * this.pxRatio;
      const bound = this.$canvas.getBoundingClientRect();
      const canvX = bound.x + (this.width / 2);
      const canvY = bound.y + (this.width / 2);
      const x = clientX - canvX;
      const y = clientY - canvY;
      const radians = Math.atan(y / x);
      const radius = Math.abs(x / Math.cos(radians)) * this.pxRatio;
      let round = Math.round((this.radius - radius) / gisture);
      let angle = radians * (180 / Math.PI);

      if (x < 0) angle += 180;
      else if (y < 0) angle += 360;

      if (round < 0) round = 0;
      else if (round > 1) round = 1;

      if (this.type !== 'hours') round = 0;
      if (this.type === 'hours' && this.hoursIn === 12) round = 0;

      this.lastEvent = Object.assign(this.lastEvent, { x, y, angle, radius, round });
      return this.lastEvent;
    },

    /**
     * calculate the value should be selected
     * from the angles map depending on the last event value.
     * @param {Boolean} setValue if should set the value or just use lastEvent.value
     */
    getSelectedNo(setValue = false) {
      const factor = this.anglesMapFactor;
      const rem = this.lastEvent.angle % factor >= factor / 2 ? 1 : 0;
      const no = Math.floor(this.lastEvent.angle / factor);
      const ang = factor * (no + rem);

      const final = Object.keys(this.anglesMap).find((key) => {
        const { angle, round } = this.anglesMap[key];
        const finalAngle = ang >= 360 ? ang - 360 : ang;
        return angle === finalAngle && round === this.lastEvent.round;
      });

      if (setValue) this.$emit('value-change', '');
      if (this.disabled.includes(final)) return;

      if (setValue) {
        this.value = final;
        this.$emit('set', this.value);
        return;
      }

      this.$emit('value-change', final);
      this.lastEvent.value = final;
    },

    /**
     * on event mousedown
     * enable track the movement of mouse
     */
    onMouseDown() {
      this.moveStart = true;
    },

    /**
     * onmouse move calculate and draw lastEvent value
     * @param {MouseEvent} event
     */
    onMouseMove(event) {
      if (!this.moveStart) return;
      if (this.scheduled) return;

      this.scheduled = true;

      setTimeout(() => {
        this.onPointChange(event, false);
        this.scheduled = false;
      }, this.throttleDelay);
    },

    /**
     * on mouseup end of movement tracking
     * and set the last value
     * @param {MouseEvent} event
     */
    onMouseUp(event) {
      this.moveStart = false;
      this.onPointChange(event, true);
    },

    /**
     * on event touchstart
     * enable track the movement of touch
     */
    onTouchStart() {
      this.moveStart = true;
    },

    /**
     * on touchmove calculate and draw lastEvent value
     * @param {TouchEvent} event
     */
    onTouchMove(event) {
      if (!this.moveStart) return;
      if (this.scheduled) return;

      this.scheduled = true;

      setTimeout(() => {
        const { changedTouches } = event;
        this.onPointChange(changedTouches[0], false);
        this.scheduled = false;
      }, this.throttleDelay);
    },

    /**
     * on touchend end of movement tracking
     * and set the last value
     * @param {TouchEvent} event
     */
    onTouchEnd(event) {
      const { changedTouches } = event;
      this.onPointChange(changedTouches[0], true);
      this.moveStart = false;
    },
  },



  mounted() {
    this.$nextTick(() => {
      const isDisabled = this.disabled.includes(this.defaultValue);
      this.value = isDisabled ? '--' : this.defaultValue;
      this.init();
    });
  },
};
</script>


<style lang="sass"></style>

