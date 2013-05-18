function pilot(iname, app, io, client) {
    io.sockets.on('connection', function (socket) {
        socket.on('/pilot/move', function (cmd) {
            var _name;
            console.log("move", cmd);
            return typeof client[_name = cmd.action] === "function" ? client[_name](cmd.speed) : void 0;
        });
        socket.on('/pilot/drone', function (cmd) {
           var _name;
           console.log("drone", cmd);
           return typeof client[_name = cmd.action] === "function" ? client[_name]() : void 0;
        });
    });
};

module.exports = pilot;
