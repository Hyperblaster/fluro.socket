
//Create Fluro UI With dependencies
angular.module('fluro.socket', []);
angular.module('fluro.socket')
    .service('FluroSocket', function($rootScope) {

        //////////////////////////////////////////////////

        var controller = {}

        //////////////////////////////////////////////////

        var host = window.location.origin;
        var socket;
        var currentAccount = '';
        var currentUser = '';

        /////////////////////////////////////////

        if (io) {
            socket = io(host);

             console.log('listen')

             if($rootScope.user) {
                //By default listen for the accounts
                $rootScope.$watch('user.account._id', function(id) {
                    if (id) {
                        //Subscribe
                        //Store the current room
                        currentAccount = id;
                        controller.join(id);
                    } else {
                        controller.leave(currentAccount);
                    }
                });

                $rootScope.$watch('user._id', function(id) {
                    if (id) {
                        //Subscribe
                        currentUser = id;
                        controller.join(id);
                    } else {
                        controller.leave(currentUser);
                    }
                });
            }
        }

        //////////////////////////////////////////////////

        controller.join = function(roomName) {

            if (socket) {
                 console.log('join channel', roomName)
                //////////////////////////////////////////////////

                //Start listening on connect
                socket.on('connect', function() {

                    console.log('Socket connected to ' + roomName)
                    // socket.on('content', receiveMessage);
                    socket.emit("subscribe", {
                        room: roomName
                    });

                });

                //Start listening on connect
                socket.on('reconnect', function() {

                    console.log('Socket reconnected')
                    // socket.on('content', receiveMessage);
                    socket.emit("subscribe", {
                        room: roomName
                    });

                });

                //Stop listening on disconnect
                socket.on('disconnect', function() {

                    console.log('Socket disconnected')
                    // socket.off('content', receiveMessage);

                });
            } else {
                console.log('No socket connected');
            }
        }

        //////////////////////////////////////////////////

        controller.leave = function(roomName) {

            if (socket) {

                 console.log('leave channel', roomName)

                // socket.off('content', receiveMessage);
                socket.emit("unsubscribe", {
                    room: roomName
                });

                //Start listening on connect
                socket.off('connect')
                socket.off('reconnect')
                socket.off('disconnect');
            }
        }

        //////////////////////////////////////////////////

        controller.on = function(event, callback) {
            if (socket) {
                socket.on(event, callback);
            } else {
                console.log('No socket available')
            }
        }

        //////////////////////////////////////////////////

        controller.off = function(event, callback) {
            if (socket) {
                socket.off(event, callback);
            } else {
                console.log('No socket available')
            }
        }

        //////////////////////////////////////////////////

        return controller;
    });