
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

        if (typeof io !== 'undefined') {
            socket = io(host);

            //By default listen for the accounts
            $rootScope.$watch('user.account._id', function() {

                var user = $rootScope.user;

                if (user) {

                    if (user.account && user.account._id) {
                        currentAccount = user.account._id;
                        controller.join(currentAccount);
                    } else {
                        controller.leave(currentAccount);
                    }

                    // if (user._id) {
                    //     currentUser = user._id;
                    //     controller.join(currentUser);
                    // } else {
                    //     controller.leave(currentUser);
                    // }
                } else {
                    // if(currentUser) {
                    //     controller.leave(currentUser);
                    // }

                    if(currentAccount) {
                        controller.leave(currentAccount);
                    }
                }
            });

            
            /**
            //By default listen for the accounts
            $rootScope.$watch('user.account._id + user._id', function() {

                var user = $rootScope.user;

                if (user) {

                    if (user.account && user.account._id) {
                        currentAccount = user.account._id;
                        controller.join(currentAccount);
                    } else {
                        controller.leave(currentAccount);
                    }

                    if (user._id) {
                        currentUser = user._id;
                        controller.join(currentUser);
                    } else {
                        controller.leave(currentUser);
                    }
                } else {
                    if(currentUser) {
                        controller.leave(currentUser);
                    }

                    if(currentAccount) {
                        controller.leave(currentAccount);
                    }
                }
            });
            /**/
        }

        //////////////////////////////////////////////////

        controller.join = function(roomName) {

            if (socket) {
                // console.log('Subscribe to room', roomName)
                //////////////////////////////////////////////////

                //Start listening on connect
                socket.on('connect', function() {

                    console.log('Socket connected to ' + roomName);
                    // socket.on('content', receiveMessage);
                    socket.emit("subscribe", {
                        room: roomName
                    });

                });

                //Start listening on connect
                socket.on('reconnect', function() {

                    console.log('Socket reconnected to ' + roomName);
                    // socket.on('content', receiveMessage);
                    socket.emit("subscribe", {
                        room: roomName
                    });

                });

                //Stop listening on disconnect
                socket.on('disconnect', function() {

                    console.log('Socket disconnected');
                    // socket.off('content', receiveMessage);

                });
            } else {
                console.log('No socket connected');
            }
        }

        //////////////////////////////////////////////////

        controller.leave = function(roomName) {

            if (socket) {

                console.log('Leave channel', roomName)

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
            }
        }

        //////////////////////////////////////////////////

        controller.off = function(event, callback) {
            if (socket) {
                socket.off(event, callback);
            }
        }

        //////////////////////////////////////////////////

        return controller;
    });