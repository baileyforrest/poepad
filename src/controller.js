let assert = require('assert');
let robot = require('robotjs');

var HID = require ('node-hid');
const VID = 0x45E; // Microsoft
const PID = [0x28E, 0x28F, 0x2D1]; // Searches for Xbox 360 Controller, Xbox 360 Wifi Controller and Xbox One Controller
 // http://www.linux-usb.org/usb.ids

class Controller {
  static create(stateChangeCb) {
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

    return new Controller(hid, stateChangeCb);
  }

  static logState(state) {
    for (let i = 0; i < Controller.Key.MAX_VALUE; ++i) {
      if (state.keys & 1 << i) {
        console.log(Controller.Key.toString[i]);
      }
    }

    console.log('lstick_x: ' + state.lstick.x + ', lstick_y: ' + state.lstick.y);
    console.log('rstick_x: ' + state.rstick.x + ', rstick_y: ' + state.rstick.y);
    console.log('trigger: ' + state.trigger);
  }

  constructor(hid, stateChangeCb) {
    this.hid = hid;
    this.stateChangeCb = stateChangeCb;

    this.hid.addListener('data', (data) => {
      this.onData(data);
    });
  }

  onData(data) {
    assert(data.length >= 11);

    let keys = 0;

    let buttons0 = data[10];

    for (let i = 0; i < 8; ++i) {
      if ((buttons0 >> i) & 1) {
        keys |= 1 << BUTTON0_TO_KEY[i];
      }
    }

    let buttons1 = data[11];
    if (buttons1 & 1) {
      keys |= 1 << Controller.Key.LSTICK;
    }

    if (buttons1 & 0x2) {
      keys |= 1 << Controller.Key.RSTICK;
    }

    let dpad = (buttons1 >> 2) & 0xf;
    let dpad_keys = DPAD_TO_KEYS[dpad];
    for (let i = 0; i < dpad_keys.length; ++i) {
      keys |= 1 << dpad_keys[i];
    }

    let lstick_x = data[0];
    lstick_x |= data[1] << 8;
    lstick_x -= 1 << 15;

    let lstick_y = data[2];
    lstick_y |= data[3] << 8;
    lstick_y -= 1 << 15;

    let rstick_x = data[4];
    rstick_x |= data[5] << 8;
    rstick_x -= 1 << 15;

    let rstick_y = data[6];
    rstick_y |= data[7] << 8;
    rstick_y -= 1 << 15;

    let trigger_val = data[9];

    let state = {
      lstick: { x: lstick_x, y: lstick_y },
      rstick: { x: rstick_x, y: rstick_y },
      keys: keys,
      trigger: trigger_val,
    };

    this.stateChangeCb(state);
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

  MAX_VALUE:14,
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
