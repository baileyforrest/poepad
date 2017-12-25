let Controller = require('./controller');

let controller = Controller.create(Controller.logState);

if (!controller) {
  console.log('Could not find controller');
  process.exit(1);
}
