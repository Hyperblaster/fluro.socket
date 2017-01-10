
//Create Fluro UI With dependencies
angular.module('fluro.socket', []);
angular.module('fluro.socket')
    .service('FluroSocket', ['Fluro', '$rootScope', function(Fluro, $rootScope) {

        //////////////////////////////////////////////////

        var controller = {}

        //////////////////////////////////////////////////

        var host = Fluro.apiURL; //window.location.origin;
        var socket;
        var currentAccount = '';
        var currentUser = '';
        var currentSocketID;

        /////////////////////////////////////////

        var listeners = [];

        /////////////////////////////////////////

        if (typeof io !== 'undefined') {
            // socket = io(host);
            socket = io(Fluro.apiURL, {transports: ['websocket'], upgrade: false});

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

                    if (currentAccount) {
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

        controller.getSocketID = function() {
            return currentSocketID;
        }

        //////////////////////////////////////////////////

        controller.join = function(roomName) {

            if (socket) {
                //console.log('join', roomName)
                    //////////////////////////////////////////////////

                //Start listening on connect
                socket.on('connect', function() {

                    //Set the current socket id
                    currentSocketID = socket.io.engine.id;

                    // //console.log('Socket connected to ' + roomName);
                    // socket.on('content', receiveMessage);
                    socket.emit("subscribe", {
                        room: roomName
                    });
                });

                //Start listening on connect
                socket.on('reconnect', function() {

                    //Set the current socket id
                    currentSocketID = socket.io.engine.id;

                    // //console.log('Socket reconnected to ' + roomName);
                    // socket.on('content', receiveMessage);
                    socket.emit("subscribe", {
                        room: roomName
                    });

                });

                //Stop listening on disconnect
                socket.on('disconnect', function() {

                    //Set the current socket id
                    currentSocketID = null;
                    // //console.log('Socket disconnected');
                    // socket.off('content', receiveMessage);

                });

                //console.log('Reattach', listeners.length, 'listeners')

                //Stop listening to all events
                _.each(listeners, function(listener) {
                    socket.on(listener);
                })


            } else {
                // //console.log('No socket connected');
            }
        }

        //////////////////////////////////////////////////

        controller.leave = function(roomName) {

            if (socket) {

                //console.log('leave', roomName)

                // socket.off('content', receiveMessage);
                socket.emit("unsubscribe", {
                    room: roomName
                });

                //Start listening on connect
                socket.off('connect')
                socket.off('reconnect')
                socket.off('disconnect');

                //console.log('Leave', listeners.length, 'listeners')
                    //Stop listening to all events
                _.each(listeners, function(listener) {
                    socket.off(listener);
                })
            }
        }

        //////////////////////////////////////////////////

        controller.emit = function(roomName, key, data) {

            if(socket) {

                //emit to room
                console.log('Emit to room', roomName, socket);
                // socket.to(roomName).emit(key, data);

                socket.emit(key, data);
            }
            
            // socket.emit(key, {room:roomName}channelName).emit(eventName, data);
            /**
            data.key = key;
            data.message = message;

            ////////////////////////////////////////////////////////////

            //Simplify the references
            if (data.item && data.item._id) {
                data.item = data.item._id;
            }

            ////////////////////////////////////////////////////////////

            //Simplify the references
            if (data.account && data.account._id) {
                data.account = data.account._id;
            }

            ////////////////////////////////////////////////////////////

            //Simplify the references
            if (data.user && data.user._id) {
                data.user = {
                    _id: data.user._id,
                    name: data.user.name
                }
            }

            ////////////////////////////////////////////////////////////

            var log = new Log(data);
            log.save(callback);

            ////////////////////////////////////////////////////////////

            //Also alert everyone via socket what happened
            var account = data.account;
            socketController.emit(account, key, data);
            /**/

        }

        //////////////////////////////////////////////////

        controller.on = function(event, callback) {

            var alreadyListening = _.find(listeners, function(listener) {
                var sameCallback = listener.callback == callback;
                var sameEvent = listener.event == event;
                return (sameCallback && sameEvent);
            })

            //Already listening for this event
            if(alreadyListening) {
                return console.log('Already listening for ', event);
            } else {

                //Add this listener to the array
                listeners.push({event:event, callback:callback});

                //start listening
                if (socket) {
                    socket.on(event, callback);
                }   
            }

            // if (listeners.indexOf(event) == -1) {
            //     listeners.push(event);
            //     // console.log('Add listener', event, listeners.length);
            // }
            
        }

        //////////////////////////////////////////////////

        controller.off = function(event, callback) {

            if(callback) {
                var match = _.find(listeners, function(listener) {
                    var sameCallback = listener.callback == callback;
                    var sameEvent = listener.event == event;
                    return (sameCallback && sameEvent);
                });

                if(match) {
                    _.pull(listeners, match);

                    if(socket) {
                        //Remove the listener
                        socket.removeListener(event, callback);
                    }
                }
            } else {

                //Crop listener list to only those that dont match the event specified
                listeners = _.filter(listeners, function(listener) {
                    return listener.event != event;
                });

                if(socket) {
                   socket.off(event);
                }
            }
        }

        //////////////////////////////////////////////////

        return controller;
    }]);