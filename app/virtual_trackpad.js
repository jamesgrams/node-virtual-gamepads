// Generated by CoffeeScript 1.10.0

/*
Virtual gamepad class
 */

(function() {
  var config, fs, ioctl, uinput, uinputStructs, virtual_trackpad;

  fs = require('fs');

  ioctl = require('ioctl');

  uinput = require('../lib/uinput');

  uinputStructs = require('../lib/uinput_structs');

  config = require('../config.json');

  virtual_trackpad = (function() {
    function virtual_trackpad() {}

    virtual_trackpad.prototype.connect = function(callback, error, retry) {
      if (retry == null) {
        retry = 0;
      }
      return fs.open('/dev/uinput', 'w+', (function(_this) {
        return function(err, fd) {
          var uidev, uidev_buffer;
          if (err) {
            return error(err);
          } else {
            _this.fd = fd;
            ioctl(_this.fd, uinput.UI_SET_EVBIT, uinput.EV_KEY);
            ioctl(_this.fd, uinput.UI_SET_KEYBIT, uinput.BTN_LEFT);
            ioctl(_this.fd, uinput.UI_SET_KEYBIT, uinput.BTN_RIGHT);
            ioctl(_this.fd, uinput.UI_SET_KEYBIT, uinput.BTN_MIDDLE);
            ioctl(_this.fd, uinput.UI_SET_KEYBIT, uinput.BTN_A);
            ioctl(_this.fd, uinput.UI_SET_KEYBIT, uinput.BTN_B);
            ioctl(_this.fd, uinput.UI_SET_KEYBIT, uinput.BTN_X);
            ioctl(_this.fd, uinput.UI_SET_KEYBIT, uinput.BTN_Y);
            ioctl(_this.fd, uinput.UI_SET_KEYBIT, uinput.BTN_TL);
            ioctl(_this.fd, uinput.UI_SET_KEYBIT, uinput.BTN_TR);
            ioctl(_this.fd, uinput.UI_SET_KEYBIT, uinput.BTN_START);
            ioctl(_this.fd, uinput.UI_SET_KEYBIT, uinput.BTN_SELECT);
            ioctl(_this.fd, uinput.UI_SET_EVBIT, uinput.EV_ABS);
            ioctl(_this.fd, uinput.UI_SET_ABSBIT, uinput.ABS_X);
            ioctl(_this.fd, uinput.UI_SET_ABSBIT, uinput.ABS_Y);
            ioctl(_this.fd, uinput.UI_SET_EVBIT, uinput.EV_REL);
            ioctl(_this.fd, uinput.UI_SET_RELBIT, uinput.REL_X);
            ioctl(_this.fd, uinput.UI_SET_RELBIT, uinput.REL_Y);
            ioctl(_this.fd, uinput.UI_SET_RELBIT, uinput.REL_WHEEL);
            uidev = new uinputStructs.uinput_user_dev;
            uidev.name = Array.from("Virtual trackpad");
            uidev.id.bustype = uinput.BUS_USB;
            uidev.id.vendor = 0x3;
            uidev.id.product = 0x5;
            uidev.id.version = 1;
            uidev_buffer = uidev.ref();
            uidev.absmax[uinput.ABS_X] = 255;
            uidev.absmin[uinput.ABS_X] = 0;
            uidev.absfuzz[uinput.ABS_X] = 0;
            uidev.absflat[uinput.ABS_X] = 15;
            uidev.absmax[uinput.ABS_Y] = 255;
            uidev.absmin[uinput.ABS_Y] = 0;
            uidev.absfuzz[uinput.ABS_Y] = 0;
            uidev.absflat[uinput.ABS_Y] = 15;
            return fs.write(_this.fd, uidev_buffer, 0, uidev_buffer.length, null, function(err) {
              var error1;
              if (err) {
                console.warn("Error on init trackpad write:\n", err);
                return error(err);
              } else {
                try {
                  ioctl(_this.fd, uinput.UI_DEV_CREATE);
                  return callback();
                } catch (error1) {
                  err = error1;
                  console.error("Error on trackpad create dev:\n", err);
                  fs.close(_this.fd);
                  _this.fd = void 0;
                  if (retry < 5) {
                    console.info("Retry to create trackpad");
                    return _this.connect(callback, error, retry + 1);
                  } else {
                    console.error("Gave up on creating device");
                    return error(err);
                  }
                }
              }
            });
          }
        };
      })(this));
    };

    virtual_trackpad.prototype.disconnect = function(callback) {
      if (this.fd) {
        ioctl(this.fd, uinput.UI_DEV_DESTROY);
        fs.close(this.fd);
        this.fd = void 0;
        return callback();
      }
    };

    virtual_trackpad.prototype.sendEvent = function(event) {
      var err, error1, error2, ev, ev_buffer, ev_end, ev_end_buffer;
      if (this.fd) {
        ev = new uinputStructs.input_event;
        ev.type = event.type;
        ev.code = event.code;
        ev.value = event.value;
        ev.time.tv_sec = Math.round(Date.now() / 1000);
        ev.time.tv_usec = Math.round(Date.now() % 1000 * 1000);
        ev_buffer = ev.ref();
        ev_end = new uinputStructs.input_event;
        ev_end.type = 0;
        ev_end.code = 0;
        ev_end.value = 0;
        ev_end.time.tv_sec = Math.round(Date.now() / 1000);
        ev_end.time.tv_usec = Math.round(Date.now() % 1000 * 1000);
        ev_end_buffer = ev_end.ref();
        try {
          fs.writeSync(this.fd, ev_buffer, 0, ev_buffer.length, null);
        } catch (error1) {
          err = error1;
          console.error("Error on writing ev_buffer");
          throw err;
        }
        try {
          return fs.writeSync(this.fd, ev_end_buffer, 0, ev_end_buffer.length, null);
        } catch (error2) {
          err = error2;
          console.error("Error on writing ev_end_buffer");
          throw err;
        }
      }
    };

    return virtual_trackpad;

  })();

  module.exports = virtual_trackpad;

}).call(this);
