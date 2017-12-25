let robot = require('robotjs');

let Controller = require('./controller');
let Vec2 = require('./vec2');

const LSTICK_THRESHOLD = .25;
const RSTICK_THRESHOLD = .16;
const TRIGGER_THRESHOLD = .10;
const MIDDLE_OFFSET = 0.44;
const MOVE_RADIUS_FRACTION  = .105;
const MOUSE_MOVE_INTERVAL_MS = 10;

class Input {
  constructor() {
    this.moving = false;
    this.screen_width = robot.getScreenSize().width;
    this.screen_height = robot.getScreenSize().height;
    this.middle = new Vec2(this.screen_width / 2, this.screen_height * MIDDLE_OFFSET);
    this.move_radius = this.screen_height * MOVE_RADIUS_FRACTION;
    this.max_mouse_speed_slow = this.screen_height / 400;
    this.max_mouse_speed_fast = this.screen_height / 50;
    this.mouse_velocity = new Vec2();
    this.mouse_pressed = false;
    this.keys = 0;

    setInterval(() => this.onMouseMoveTimer(), MOUSE_MOVE_INTERVAL_MS);
  }

  onMouseMoveTimer() {
    let pos = robot.getMousePos();
    robot.moveMouse(pos.x + this.mouse_velocity.x, pos.y + this.mouse_velocity.y);
  }

  onControllerState(state) {
    this.controller_state = state;
    this.processLStick(state.lstick);

    if (!this.moving) {
      this.processRStick(state.rstick);

      // Right trigger is click.
      if (this.controller_state.trigger <= -TRIGGER_THRESHOLD) {
        if (!this.mouse_pressed) {
          robot.mouseToggle("down");
          this.mouse_pressed = true;
        }
      } else {
        if (this.mouse_pressed) {
          robot.mouseToggle("up");
          this.mouse_pressed = false;
        }
      }
    }

  }

  processLStick(lstick) {
    if (lstick.magnitude() < LSTICK_THRESHOLD) {
      if (this.moving) {
        //robot.mouseToggle("up");
        this.moving = false;
      }
      return;
    }

    let normal = lstick.normal();
    let mouse_pos = Vec2.add(this.middle, normal.multiply(this.move_radius));
    robot.moveMouse(mouse_pos.x, mouse_pos.y);

    if (!this.moving) {
      //robot.mouseToggle("down");
    }
  }

  processRStick(rstick) {
    let magnitude = rstick.magnitude();
    if (magnitude < RSTICK_THRESHOLD) {
      this.mouse_velocity = new Vec2;
    } else {
      magnitude = (Math.pow(64, magnitude) - 1) / 64;

      // Left trigger.
      if (this.controller_state.trigger > TRIGGER_THRESHOLD) {
        magnitude *= this.max_mouse_speed_fast;
      } else {
        magnitude *= this.max_mouse_speed_slow;
      }
      this.mouse_velocity = rstick.multiply(magnitude);
    }
  }
}

module.exports = Input;
