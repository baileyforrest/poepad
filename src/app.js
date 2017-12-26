let Controller = require('./controller');
let Input = require('./input');
let KeyPressAction = require('./actions/key_press');
let DistanceKeyPressAction = require('./actions/distance_key_press');

let input = new Input();
input.registerAction(Controller.Key.A, new KeyPressAction(input, 'a'));
input.registerAction(Controller.Key.B, new DistanceKeyPressAction(input, 'b', 200));

let controller = Controller.create(state => {
  input.onControllerState(state);
});

if (!controller) {
  console.log('Could not find controller');
  process.exit(1);
}
