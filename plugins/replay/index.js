var fs = require('fs');
var df = require('dateformat');
var util = require('util');
var path = require('path');
var timers = require('timers');
var lineReader = require('line-reader');
var reader = require ("buffered-reader");
var config, client,video, navReader, vidReader, rawVideo;

var BinaryReader = reader.BinaryReader;

var NAV_INTERVAL = 1000/15; // Navdata sent 15/s in demo mode
var VIDEO_INTERVAL = 1000/30; // 30 fps

function replay(name, deps) {
    config = deps.config;
    client = deps.client;
    video  = client.getVideoStream();

    // Open the navdata file for line-by-line read
    var self = this;
    var navPath = path.join(config.replay.path, 'navdata.txt');
    lineReader.open(navPath, function(reader) {
      navReader = reader;
    });

    // Open the video headers stream
    var headerPath = path.join(config.replay.path, 'paveHeaders.txt');
    lineReader.open(headerPath, function(reader) {
        vidReader = reader;
    });

    // Open the video raw stream
    var videoPath = path.join(config.replay.path, 'video.h264');
    rawVideo = new BinaryReader(videoPath);

    // Schedule timer to simulate nav data emit
    timers.setInterval(emitNav, NAV_INTERVAL);
    timers.setInterval(emitVideo, VIDEO_INTERVAL);
}

function emitNav() {
    if (navReader && navReader.hasNextLine()) {
        navReader.nextLine(function(data) {
            client.emit('navdata', JSON.parse(data));
        });
    }
}

function emitVideo() {
    if (vidReader && vidReader.hasNextLine()) {
        vidReader.nextLine(function(data) {
            var frame = JSON.parse(data);
            if (rawVideo !== null) {
                rawVideo.read(frame.payload_size, function (error, bytes, bytesRead) {
                    if (error) throw error;
                    video.emit('data', bytes);
                });
            }
        });
    }
}

module.exports = replay;
