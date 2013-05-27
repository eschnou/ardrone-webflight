function video(name, deps) {
    require("dronestream").listen(3001, {tcpVideoStream: deps.client.getVideoStream()});
};

module.exports = video;
