let assert = require('assert');
let robot = require('robotjs');

var HID = require ('node-hid');
const VID = 0x45E; // Microsoft
const PID = [0x28E, 0x28F, 0x2D1]; // Searches for Xbox 360 Controller, Xbox 360 Wifi Controller and Xbox One Controller
 // http://www.linux-usb.org/usb.ids

class Controller {
  static create() {
    robot.setMouseDelay(0);
    robot.setKeyboardDelay(0);

    let hid = null;
    for (let i = 0; i < PID.length; ++i) {
      try {
        hid = new HID.HID(VID, PID[i]);
      } catch (e) {
      }
    }

    if (hid == null) {
      return null;
    }

    return new Controller(hid);
  }

  constructor(hid) {
    this.hid = hid;
    this.hid.addListener('data', (data) => {
      this.onData(data);
    });
  }

  onData(data) {
    assert(data.length >= 11);

    let keys = [];

    let buttons0 = data[10];

    for (let i = 0; i < 8; ++i) {
      if ((buttons0 >> i) & 1) {
        keys.push(BUTTON0_TO_KEY[i]);
      }
    }

    let buttons1 = data[11];
    if (buttons1 & 1) {
      keys.push(Controller.Key.LSTICK);
    }

    if (buttons1 & 0x2) {
      keys.push(Controller.Key.RSTICK);
    }

    let dpad = (buttons1 >> 2) & 0xf;
    let dpad_keys = DPAD_TO_KEYS[dpad];
    for (let i = 0; i < dpad_keys.length; ++i) {
      keys.push(dpad_keys[i]);
    }

    let lstick_x = data[0];
    lstick_x |= data[1] << 8;
    let lstick_y = data[2];
    lstick_y |= data[3] << 8;

    let rstick_x = data[4];
    rstick_x |= data[5] << 8;
    let rstick_y = data[6];
    rstick_y |= data[7] << 8;

    let trigger_val = data[9];

    // TODO: Send to observer
    for (let i = 0; i < keys.length; ++i) {
      console.log(Controller.Key.toString[keys[i]]);
    }

    console.log('lstick_x: ' + lstick_x + ', lstick_y: ' + lstick_y);
    console.log('rstick_x: ' + rstick_x + ', rstick_y: ' + rstick_y);
    console.log('trigger_val: ' + trigger_val);
  }
}

Controller.Key = {
  A:0,
  B:1,
  X:2,
  Y:3,
  LB:4,
  RB:5,
  BACK:6,
  START:7,
  LSTICK:8,
  RSTICK:9,
  DPAD_UP:10,
  DPAD_RIGHT:11,
  DPAD_DOWN:12,
  DPAD_LEFT:13,
};

let KEY_TO_STRING = [
  'A',
  'B',
  'X',
  'Y',
  'LB',
  'RB',
  'BACK',
  'START',
  'LSTICK',
  'RSTICK',
  'DPAD_UP',
  'DPAD_RIGHT',
  'DPAD_DOWN',
  'DPAD_LEFT',
]

Controller.Key.toString = KEY_TO_STRING;

const BUTTON0_TO_KEY = [
  Controller.Key.A,
  Controller.Key.B,
  Controller.Key.X,
  Controller.Key.Y,
  Controller.Key.LB,
  Controller.Key.RB,
  Controller.Key.BACK,
  Controller.Key.START,
];

const DPAD_TO_KEYS = [
  [],
  [Controller.Key.DPAD_UP],
  [Controller.Key.DPAD_UP, Controller.Key.DPAD_RIGHT],
  [Controller.Key.DPAD_RIGHT],
  [Controller.Key.DPAD_RIGHT, Controller.Key.DPAD_DOWN],
  [Controller.Key.DPAD_DOWN],
  [Controller.Key.DPAD_DOWN, Controller.Key.DPAD_LEFT],
  [Controller.Key.DPAD_LEFT],
  [Controller.Key.DPAD_LEFT, Controller.Key.DPAD_UP],
];

module.exports = Controller;
