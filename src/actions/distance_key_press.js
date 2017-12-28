
let KeyPress = require('./key_press');
const DELAY = 15;

class DistanceKeyPress extends KeyPress {
  constructor(input, key, distance) {
    super(input, key, distance);
    this.distance = distance;
    this.pending = false;
  }

  onPressChanged(pressed) {
    if (this.pending) {
      return;
    }

    let on_unpressed = () => {
      this.toggle(false);
      this.input.overrideRadius(null);
    };

    if (pressed) {
      this.pending = true;
      this.input.overrideRadius(this.distance);
      setTimeout(() => {
        this.toggle(true)
        if (this.pressed) {
          this.pending = false;
        } else {
          setTimeout(() => {
            this.pending = false;
            on_unpressed();
          }, DELAY);
        }
      }, DELAY);
    } else {
      if (!this.pending) {
        on_unpressed();
      }
    }
  }
}

module.exports = DistanceKeyPress;
