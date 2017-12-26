let Controller = require('./controller');
let Input = require('./input');
let config = require('./config');

let input = new Input();
config.register(input);

let controller = Controller.create(state => {
  input.onControllerState(state);
});

if (!controller) {
  console.log('Could not find controller');
  process.exit(1);
}
