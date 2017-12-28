let assert = require('assert');

let robot = require('./robot');
let Controller = require('./controller');
let Vec2 = require('./vec2');

const LSTICK_THRESHOLD = .25;
const RSTICK_THRESHOLD = .16;
const TRIGGER_THRESHOLD = .10;
const MIDDLE_OFFSET = 0.44;
const MOVE_RADIUS_FRACTION  = .15;
const MOUSE_MOVE_INTERVAL_MS = 10;

class Input {
  constructor() {
    robot.setMouseDelay(0);
    robot.setKeyboardDelay(0);

    this.moving = false;
    this.reached_move_target = false;
    this.move_override_count = 0;
    this.screen_width = robot.getScreenSize().width;
    this.screen_height = robot.getScreenSize().height;
    this.middle = new Vec2(this.screen_width / 2, this.screen_height * MIDDLE_OFFSET);
    this.move_radius = this.screen_height * MOVE_RADIUS_FRACTION;
    this.move_radius_override = null;
    this.max_mouse_speed_slow = this.screen_height / 200;
    this.max_mouse_speed_fast = this.screen_height / 50;
    this.direction = new Vec2(1, 0);
    this.mouse_target = null;
    this.mouse_velocity = new Vec2();
    this.mouse_pressed = false;
    this.lstick_mouse_speed = this.screen_height / 25;
    this.keys = 0;
    this.key_to_action = {};

    setInterval(() => this.onMouseMoveTimer(), MOUSE_MOVE_INTERVAL_MS);
  }

  registerAction(key, action) {
    if (key in this.key_to_action) {
      throw 'Key already has registered action';
    }

    this.key_to_action[key] = action;
  }

  moveMouse(x, y) {
    let pos = robot.getMousePos();
    if (x == pos.x && y == pos.y) {
      return;
    }

    robot.moveMouse(x, y);
  }

  onMouseMoveTimer() {
    let pos = robot.getMousePos();
    if (this.mouse_target != null) {
      let dist = Vec2.sub(this.mouse_target, new Vec2(pos.x, pos.y));
      let magnitude = dist.magnitude();
      if (magnitude < 3.0) {
        if (this.moving && !this.reached_move_target) {
          this.reached_move_target = true;
          if (this.move_override_count == 0) {
            robot.mouseToggle("up");
            robot.mouseToggle("down");
          }
        }
        this.mouse_target = null;
        return;
      }

      if (magnitude > this.move_radius) {
        this.moveMouse(this.mouse_target.x, this.mouse_target.y);
        this.mouse_target = 0;
        return;
      }

      let speed = magnitude < this.lstick_mouse_speed ? magnitude : this.lstick_mouse_speed;

      let delta = dist.normal().multiply(speed);
      this.moveMouse(pos.x + delta.x, pos.y + delta.y);
      return;
    }
    if (this.mouse_velocity.magnitude() == 0) {
      return;
    }
    this.moveMouse(pos.x + this.mouse_velocity.x, pos.y + this.mouse_velocity.y);
  }

  onControllerState(state) {
    this.controller_state = state;
    this.processLStick(state.lstick);

    if (!this.moving && this.move_override_count == 0) {
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

    for (let key = 0; key < Controller.Key.MAX_VALUE; ++key) {
      // No registered action.
      if (!(key in this.key_to_action)) {
        continue;
      }

      let pressed = (state.keys & (1 << key)) ? true : false;
      this.key_to_action[key].do(pressed);
    }
  }

  updatePlayerMousePos(immediate) {
    let radius = this.move_radius_override != null ? this.move_radius_override : this.move_radius;

    // Account for perspective
    let copy = this.direction.copy();
    if (copy.y < 0) {
      copy.y *= .8;
    } else {
      copy.y *= 1.1;
    }
    this.mouse_target = Vec2.add(this.middle, copy.multiply(radius));
    if (immediate) {
      this.moveMouse(this.mouse_target.x, this.mouse_target.y);
    }
  }

  processLStick(lstick) {
    if (lstick.magnitude() < LSTICK_THRESHOLD) {
      if (this.moving) {
        if (this.move_override_count == 0) {
          robot.mouseToggle("up");
        }
        this.moving = false;
        this.mouse_target = null;
      }
      return;
    }

    this.mouse_velocity = new Vec2;

    this.direction = lstick.normal();
    this.updatePlayerMousePos(false);

    if (!this.moving) {
      this.moving = true;
      this.reached_move_target = false;
    }
  }

  processRStick(rstick) {
    let magnitude = rstick.magnitude();
    if (magnitude < RSTICK_THRESHOLD) {
      this.mouse_velocity = new Vec2;
    } else {
      magnitude = (Math.pow(16, magnitude) - 1) / 16;

      // Left trigger.
      if (this.controller_state.trigger > TRIGGER_THRESHOLD) {
        magnitude *= this.max_mouse_speed_fast;
      } else {
        magnitude *= this.max_mouse_speed_slow;
      }
      this.mouse_velocity = rstick.multiply(magnitude);
    }
  }

  overrideRadius(radius) {
    this.move_radius_override = radius;
    this.updatePlayerMousePos(true);
  }

  overrideMove(can_move) {
    if (can_move) {
      assert(this.move_override_count > 0);
      this.move_override_count -= 1;
    } else {
      this.move_override_count += 1;
    }
    if (this.moving) {
      if (this.move_override_count > 0) {
        robot.mouseToggle("up");
      } else {
        robot.mouseToggle("down");
      }
    }
  }
}

module.exports = Input;
