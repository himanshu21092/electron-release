var POSApp;
var access_token = "";
var userInfo = null;


POSApp = angular.module("POSApp", ["ui.router", "ngRoute", "angular-websql"]);

POSApp.run(function ($rootScope, $state, HTTP_RESPONSE, appService, userSettings) {

    userSettings.getUserSetting("selectedEdc")
        .then(function (selectedEdc) {
            console.log("Edc data is found.");
            console.log(selectedEdc);
            $rootScope.connectEdc(selectedEdc.name, selectedEdc.referer.address, selectedEdc.port);
            
        }, function (fail) {
            // Handle Failure
            console.log("Edc data is not found.");
        })

    String.prototype.toBytes = function () {
        var arr = []
        for (var i = 0; i < this.length; i++) {
            arr.push(this[i].charCodeAt(0))
        }
        return arr
    }


    var WebSocketClient = require('websocket').client;
    var client = new WebSocketClient();
    var edcName = null;

    $rootScope.connectEdc = function (name, ipAddress, port) {
        edcName = name;
        client.connect('ws://' + ipAddress + ':' + port + '/');
        console.log('ws://' + ipAddress + ':' + port + '/');
    }

    $rootScope.cancelTransaction = function () {
        $rootScope.connection.sendUTF('{"messageType":"transactionCancelled"}');
    }

    $rootScope.sendTransactionToEdc = function (orderId, orderTotal, customerName, customerPhone) {
        message = {
            "messageType": "transaction",
            "totalAmount": orderTotal,
            "order_id": orderId,
            "consumer_name": customerName,
            "phone_number": customerPhone
        };
        console.log(message);
        $rootScope.connection.sendUTF(JSON.stringify(message));
    }

    client.on('connectFailed', function (error) {
        console.log("connection error");
        console.log('Connect Error: ' + error.toString());
    });

    client.on('connect', function (connection) {
        console.log('Edc is now Connected');
        console.log(connection);

        $rootScope.connection = connection;
        console.log(connection);
        $rootScope.connection.edcName = edcName;

        connection.on('error', function (error) {
            console.log("error");
            console.log("Connection Error: " + error.toString());
        });

        connection.on('close', function () {
            console.log('echo-protocol Connection Closed');
        });

        connection.on('message', function (message) {

            if (message.type === 'utf8') {
                console.log("Received: '" + message.utf8Data + "'");
                response = JSON.parse(message.utf8Data);

                if (response.messageType == 'transactionCancelled') {
                    $rootScope.$broadcast('transactionCancelled');
                }
                else if (response.messageType == 'busy') {
                    $rootScope.$broadcast('busy');
                }
                else if (response.messageType == 'transactionComplete') {
                    $rootScope.$broadcast('transactionComplete');
                }

            }
        });
    });

});
