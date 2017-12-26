
let robot = require('../robot');
let KeyPress = require('./key_press');

class KeyPressHold extends KeyPress {
  constructor(input, key) {
    super(input, key);
  }

  onPressChanged(pressed) {
    if (pressed) {
      this.input.overrideMove(false);
      robot.keyToggle('shift', 'down');
      this.toggle(true);
    } else {
      this.toggle(false);
      robot.keyToggle('shift', 'up');
      this.input.overrideMove(true);
    }
  }
}

module.exports = KeyPressHold;
