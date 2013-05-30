PILOT_ACCELERATION = 0.04;

(function(window, document) {
        'use strict';

        // Static keymap used within this module
        var Keymap = {
                        90 : {
                                ev : 'move',
                                action : 'front'
                        },
                        83 : {
                                ev : 'move',
                                action : 'back'
                        },
                        81 : {
                                ev : 'move',
                                action : 'left'
                        },
                        68 : {
                                ev : 'move',
                                action : 'right'
                        },
                        38 : {
                                ev : 'move',
                                action : 'up'
                        },
                        40 : {
                                ev : 'move',
                                action : 'down'
                        },
                        37 : {
                                ev : 'move',
                                action : 'counterClockwise'
                        },
                        39 : {
                                ev : 'move',
                                action : 'clockwise'
                        },
                        32 : {
                                ev : 'drone',
                                action : 'stop'
                        },
                        84 : {
                                ev : 'drone',
                                action : 'takeoff'
                        },
                        76 : {
                                ev : 'drone',
                                action : 'land'
                        },
                        69 : {
                                ev : 'drone',
                                action : 'disableEmergency'
                        }
                };

        /*
         * Constructuor
         */
        var Pilot = function Pilot(cockpit) {
                console.log("Loading Pilot plugin.");
                this.cockpit = cockpit;
                this.speed = 0;
                this.keys = {};

                // Start with magneto calibration disabled.
                $('#calibratemagneto').prop('disabled', true);

                // Register the various event handlers
                this.listen();

                // Setup a timer to send motion command
                var self = this;
                setInterval(function(){self.sendCommands()},100);
        };

        /*
         * Register keyboard event listener
         */
        Pilot.prototype.listen = function listen() {
                var pilot = this;
                $(document).keydown(function(ev) {
                        pilot.keyDown(ev);
                });

                $(document).keyup(function(ev) {
                        pilot.keyUp(ev);
                });

                $('#calibratemagneto').click(function(ev) {
                  ev.preventDefault();
                  pilot.calibrate(0);
                });
                this.cockpit.socket.on('hovering', function() {
                  $('#calibratemagneto').prop('disabled', false);
                });
                this.cockpit.socket.on('landed', function() {
                  $('#calibratemagneto').prop('disabled', true);
                });


        };

        /*
         * Process onkeydown. For motion commands, we just update the
         * speed for the given key and the actual commands will be sent
         * by the sendCommand method, triggered by a timer.
         *
         */
        Pilot.prototype.keyDown = function keyDown(ev) {
                console.log("Keydown: " + ev.keyCode);
                if (Keymap[ev.keyCode] == null) {
                        return;
                }
                ev.preventDefault();
                
                var key = ev.keyCode;
                var cmd = Keymap[key];
                // If a motion command, we just update the speed
                if (cmd.ev == "move") {
                    if (typeof(this.keys[key])=='undefined' || this.keys[key]===null) {
                        this.keys[key] = PILOT_ACCELERATION;
                    }
                } 
                // Else we send the command immediately
                else {
                    this.cockpit.socket.emit("/pilot/" + cmd.ev, {
                        action : cmd.action
                    });
                }
        };

        /*
         * On keyup we delete active keys from the key array
         * and send a stop command for this direction
         */
        Pilot.prototype.keyUp = function keyUp(ev) {
                console.log("Keyup: " + ev.keyCode);
                if (Keymap[ev.keyCode] == null) {
                        return;
                }
                ev.preventDefault();
                
                // Delete the key from the tracking array
                var key = ev.keyCode;
                delete this.keys[key];

                // Send a command to set the motion in this direction to zero
                var cmd = Keymap[key];
                this.cockpit.socket.emit("/pilot/" + cmd.ev, {
                    action : cmd.action,
                    speed : 0
                });
        }
           
        /*
         * Triggered by a timer, check for active keys
         * and send the appropriate motion commands
         */
        Pilot.prototype.sendCommands = function() {
                for (var k in this.keys) {
                    var cmd = Keymap[k];
                    // Send the command
                    this.cockpit.socket.emit("/pilot/" + cmd.ev, {
                        action : cmd.action,
                        speed : this.keys[k]
                    });
                    
                    // Update the speed
                    this.keys[k] = this.keys[k] + PILOT_ACCELERATION / (1 - this.keys[k]);
                    this.keys[k] = Math.min(1, this.keys[k]);
                }
        }

        /*
         * Requets a device callibration. Beware that for some device
         * such as the compass, the drone will perform some motion.
         */
        Pilot.prototype.calibrate = function calibrate(deviceNum) {
                this.cockpit.socket.emit("/pilot/calibrate", {
                        device_num : 0
                });
        };

        window.Cockpit.plugins.push(Pilot);

}(window, document));
