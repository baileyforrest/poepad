
let Controller = require('./controller');
let KeyPress = require('./actions/key_press');
let KeyPressHold = require('./actions/key_press_hold');
let DistanceKeyPress = require('./actions/distance_key_press');

const MULTIPLIER_NEAR = 0.1;
const MULTIPLIER_MEDIUM = 0.225;
const MULTIPLIER_FAR = 0.45;

function register(input) {
  input.registerAction(Controller.Key.BACK, new KeyPress(input, 'escape'));
  input.registerAction(Controller.Key.START, new KeyPress(input, '`'));

  input.registerAction(Controller.Key.DPAD_UP, new KeyPress(input, '1'));
  input.registerAction(Controller.Key.DPAD_RIGHT, new KeyPress(input, '2'));
  input.registerAction(Controller.Key.DPAD_DOWN, new KeyPress(input, '3'));
  input.registerAction(Controller.Key.DPAD_LEFT, new KeyPress(input, '4'));
  input.registerAction(Controller.Key.LSTICK, new KeyPress(input, '5'));

  input.registerAction(Controller.Key.A, new KeyPress(input, 'right'));
  input.registerAction(Controller.Key.X, new KeyPressHold(input, 'middle'));

  input.registerAction(Controller.Key.LB, new KeyPress(input, 'q'));
  input.registerAction(Controller.Key.RB, new KeyPress(input, 'w'));
  input.registerAction(Controller.Key.B,
    new DistanceKeyPress(input, 'e', MULTIPLIER_FAR * input.screen_height));

}

module.exports.register = register;
