
let KeyPress = require('./key_press');
const DELAY = 10;

class DistanceKeyPress extends KeyPress {
  constructor(input, key, distance) {
    super(input, key, distance);
    this.distance = distance;
  }

  onPressChanged(pressed) {
    if (pressed) {
      this.input.overrideRadius(this.distance);
      setTimeout(() => {
        this.toggle(true)
        if (!this.pressed) {
          this.toggle(false)
        }
      }, DELAY);
    } else {
      this.toggle(false);
      this.input.overrideRadius(null);
    }
  }
}

module.exports = DistanceKeyPress;
