
let robot = require('robotjs');

let KeyPress = require('./key_press');

class DistanceKeyPress extends KeyPress {
  constructor(input, key, distance) {
    super(input, key, distance);
    this.distance = distance;
  }

  onPressChanged(pressed) {
    if (pressed) {
      this.input.overrideRadius(this.distance);
      robot.keyToggle(this.key, 'down');
    } else {
      robot.keyToggle(this.key, 'up');
      this.input.overrideRadius(null);
    }
  }
}

module.exports = DistanceKeyPress;
