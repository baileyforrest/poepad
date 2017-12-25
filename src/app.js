let Controller = require('./controller');
let Input = require('./input');

let input = new Input();
let controller = Controller.create(state => {
  input.onControllerState(state);
});

if (!controller) {
  console.log('Could not find controller');
  process.exit(1);
}
