class Action {
  constructor(input) {
    this.input = input;
    this.pressed = false;
  }

  do(pressed) {
    if (pressed) {
      if (!this.pressed) {
        this.pressed = true;
        this.onPressChanged(true);
      }
    } else {
      if (this.pressed) {
        this.pressed = false;
        this.onPressChanged(false);
      }
    }
  }

  onPressChanged(pressed) {}
}

module.exports = Action;
