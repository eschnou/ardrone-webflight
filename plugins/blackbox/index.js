var fs = require('fs');
var path = require('path');
var df = require('dateformat');

var client
  , io
  , config
  , navStream
  , motionStream
  , recording = false
  ;

function blackbox(name, deps) {

    client = deps.client;
    io = deps.io;
    config = deps.config;

    deps.io.sockets.on('connection', function (socket) {
        socket.on('/blackbox/start', function (cmd) {
            _start();
        });
        socket.on('/blackbox/stop', function (cmd) {
            _stop();
        });
    });

    deps.client.on('navdata', function(data) {
        _record(data);
    });

};

function _start() {
   if (recording) return;
   console.log("Start recording navigation data");
   if (config && config.blackbox && config.blackbox.path) {
       var root = config.blackbox.path;
   } else {
       var root = ".";
   }
   var folder = df(new Date(), "yyyy-mm-dd_hh-MM-ss");
   fs.mkdir(path.join(root, folder), function() {
      navStream = fs.createWriteStream(path.join(root, folder, 'navdata.txt'));
      motionStream = fs.createWriteStream(path.join(root, folder, 'motion.txt')); 
      motionStream.write("seq,pitch,roll,yaw,xVelocity,yVelocity,zVelocity,altitude\n", function() {
          recording = true;
          io.sockets.emit('/message', "Blackbox started recording NavData.");
      });
    });
}

function _stop() {
    if (!recording) return;
    console.log("Stopped recording navigation data");
    recording = false;
    navStream.end();
    motionStream.end();
    io.sockets.emit('/message', "Blackbox stopped recording NavData.");
}

function _record(data) {
    if (!recording) return;

    navStream.write(JSON.stringify(data) + "\n");
    
    var seq   = data.sequenceNumber
      , pitch = data.demo.rotation.pitch
      , roll  = data.demo.rotation.roll
      , yaw   = data.demo.rotation.yaw
      , vx    = data.demo.velocity.x
      , vy    = data.demo.velocity.y
      , vz    = data.demo.velocity.z
      , z     = data.demo.altitude
      ;

    motionStream.write(seq + "," + pitch + "," + roll + "," + yaw + "," + vx + "," + vy + "," + vz + "," + z + "\n");
}

function _writeHeader(stream, cb) {
}

module.exports = blackbox;
