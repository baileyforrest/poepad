let robot = require('../robot');

let Action = require('../action');

function isMouseKey(key) {
  return key == 'left' || key == 'right' || key == 'middle';
}

class KeyPress extends Action {
  constructor(input, key) {
    super(input);
    this.key = key;
    this.is_mouse_key = isMouseKey(key);
  }

  toggle(pressed) {
    if (this.is_mouse_key) {
      robot.mouseToggle(pressed ? 'down' : 'up', this.key);
    } else {
      robot.keyToggle(this.key, pressed ? 'down' : 'up');
    }
  }

  onPressChanged(pressed) {
    this.toggle(pressed);
  }
}

module.exports = KeyPress;
