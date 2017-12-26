
let robot = require('robotjs');

const LOG = true;

module.exports.setMouseDelay = delay => robot.setMouseDelay(delay);
module.exports.setKeyboardDelay = delay => robot.setKeyboardDelay(delay);
module.exports.getScreenSize = robot.getScreenSize;
module.exports.getMousePos = robot.getMousePos;

module.exports.keyToggle = (key, down, modifier="") => {
  if (LOG) {
    console.log('robot.keyToggle(' + key + ', ' + down + ', ' + modifier + ')');
  }
  robot.keyToggle(key, down);
}

module.exports.moveMouse = (x, y) => {
  if (LOG) {
    console.log('robot.moveMouse(' + x + ', ' + y + ')');
  }

  robot.moveMouse(x, y);
}

module.exports.mouseToggle = (down, button="left") => {
  if (LOG) {
    console.log('robot.mouseToggle(' + down + ', ' + button + ')');
  }

  robot.mouseToggle(down, button);
}
