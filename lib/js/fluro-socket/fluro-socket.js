angular.module('fluro.socket')
.service('FluroSocket', function($rootScope) {

    //////////////////////////////////////////////////

    var controller = {}

    //////////////////////////////////////////////////

    var host = window.location.origin;
    var socket = io(host);
    var currentRoom = '';

    //////////////////////////////////////////////////

    $rootScope.$watch('user.account._id', function(id) {
        if(id) {
            //Subscribe
            controller.join(id);
        } else {
            controller.leave(currentRoom);
        }
    });

    //////////////////////////////////////////////////

    controller.join = function(roomName) {

        //Store the current room
        currentRoom = roomName;
        
        //////////////////////////////////////////////////

        //Start listening on connect
        socket.on('connect', function() {
            console.log('Socket connected')
            socket.on('content', receiveMessage);
            socket.emit("subscribe", { room: roomName });
        });

        //Start listening on connect
        socket.on('reconnect', function() {
            console.log('Socket reconnected')
            socket.on('content', receiveMessage);
            socket.emit("subscribe", { room: roomName });
        });

        //Stop listening on disconnect
        socket.on('disconnect', function() {
            console.log('Socket disconnected')
            socket.off('content', receiveMessage);
        });
    }

    //////////////////////////////////////////////////

    function receiveMessage(data) {
        console.log('Retrieved Socket Message', data);
    }

    //////////////////////////////////////////////////

    controller.on = function(event, callback) {
        socket.on(event, callback);
        /*
        socket.on(event, function() {
            var args = arguments;
            $rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        });
        /**/
    }

    //////////////////////////////////////////////////

    controller.off = function(event, callback) {
        socket.off(event, callback);
    }

    //////////////////////////////////////////////////

    return controller;
});
