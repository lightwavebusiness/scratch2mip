(function(ext) {
    var ws;
    var when_near = false;
    var when_far = false;
    var when_clear = false;
    var radar = '';

    ext._shutdown = function() {};

    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.connect = function() {
      ws = new WebSocket('ws://localhost:8080');
      ws.onmessage = function(evt) {
        data = JSON.parse(evt.data);
        if (data.command == 'radar') {
          if (data.status == 'clear') {
            when_clear = true;
            radar = 'clear';
          } else if (data.status == 'far') {
            when_far = true;
            radar = 'far';
          } else if (data.status == 'near') {
            when_near = true;
            radar = 'near';
          }
        }
      }
    }

    ext.forward = function(steps) {
      if (ws) {
        ws.send(JSON.stringify({command: 'forward', steps: steps}));
      }
    };

    ext.backward = function(steps) {
      if (ws) {
        ws.send(JSON.stringify({command: 'backward', steps: steps}));
      }
    }

    ext.right = function(degrees) {
      if (ws) {
        ws.send(JSON.stringify({command: 'right', degrees: degrees}));
      }
    };

    ext.left = function(degrees) {
      if (ws) {
        ws.send(JSON.stringify({command: 'left', degrees: degrees}));
      }
    }
    
    ext.punchLeft = function() {
      if (ws) {
        ws.send(JSON.stringify({command: 'left', degrees: 120}));
        ws.send(JSON.stringify({command: 'right', degrees: 120}));  
      }
    }

    ext.set_radar_on = function() {
      if (ws) {
        ws.send(JSON.stringify({command: 'set_radar_on'}));
      }
    }

    ext.when_clear = function() {
      if (when_clear) {
        when_clear = false;
        return true;
      }
      return false;
    }

    ext.when_far = function() {
      if (when_far) {
        when_far = false;
        return true;
      }
      return false;
    }

    ext.when_near = function() {
      if (when_near) {
        when_near = false;
        return true;
      }
      return false;
    }

    ext.get_radar = function() {
      return radar;
    }

    var lang = 'en';
    var locale = {
        en: {
            connect: 'connect',
            turn_right: 'turn right %n degrees',
            turn_left: 'turn left %n degrees',
            move_forward: 'move forward %n steps',
            move_backward: 'move backward %n steps',
            set_radar_on: 'set radar on',
            when_clear: 'when clear',
            when_far: 'when far',
            when_near: 'when near',
            get_radar: 'get radar(1:clear 2:far 3:near)',
            punch: 'punch',
        },
    }

    var descriptor = {
        blocks: [
            [' ', 'MiP: ' + locale[lang].connect, 'connect'],
            [' ', 'MiP: ' + locale[lang].turn_right, 'right', 90],
            [' ', 'MiP: ' + locale[lang].turn_left, 'left', 90],
            [' ', 'MiP: ' + locale[lang].move_forward, 'forward'],
            [' ', 'MiP: ' + locale[lang].move_backward, 'backward'],
            [' ', 'MiP: ' + locale[lang].set_radar_on, 'set_radar_on'],
            ['h', 'MiP: ' + locale[lang].when_clear, 'when_clear'],
            ['h', 'MiP: ' + locale[lang].when_far, 'when_far'],
            ['h', 'MiP: ' + locale[lang].when_near, 'when_near'],
            ['r', 'MiP: ' + locale[lang].get_radar, 'get_radar'],
            [' ', 'MiP: ' + locale[lang].punch, 'punchLeft']
        ],
        menus: {
            // radar_mode: ['radar', 'gesture']
            radar_mode: ['radar']
        }
    };

    ScratchExtensions.register('Scratch2MiP-Leon', descriptor, ext);
})({});
