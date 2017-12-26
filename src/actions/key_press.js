let robot = require('robotjs');

let Action = require('../action');

class KeyPress extends Action {
  constructor(input, key) {
    super(input);
    this.key = key;
  }

  onPressChanged(pressed) {
    if (pressed) {
      robot.keyToggle(this.key, 'down');
    } else {
      robot.keyToggle(this.key, 'up');
    }
  }
}

module.exports = KeyPress;
