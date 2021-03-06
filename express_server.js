// SET UP ========================
var port = process.env.PORT || 1234;

// NODE BLE CONFIGURATION
var noble = require('noble');

// INCLUDE DEPENDENCIES ========================
var express = require('express');
var app = express();
var server   = require('http').Server(app);
var io       = require('socket.io')(server);

var connectedSockets = 0;
var sockets = {};

app.use("/node_modules", express.static(__dirname + '/node_modules'));

// MIDDLEWARE: set cross origin sharing headers
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:9000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

// SOCKET SERVER CONNECTION
io.on('connection', function(socket){
  socket.emit('connect', "Connection created.")
  if (!sockets[socket.id]) connectedSockets++;
  sockets[socket.id]={ id: socket.id };
  console.log('Client Connected: ' + socket.id + '; Total Socket Count: ' + connectedSockets);
  socket.on('disconnect', function (data) {
    delete sockets[socket.id];
    connectedSockets--;
    console.log('Client Disconnected: ' + socket.id + '; Total Socket Count: ' + connectedSockets );
  });
});

// CONNECT BLE INTERFACE ===============================
// start scanning after connection is established
noble.on('stateChange', function(state) {
    console.log("statechange:" + state);
    if (state === 'poweredOn') {
        console.log("Bluetooth is on here");
        noble.startScanning();
    } else {
        console.log("Bluetooth not on");
        noble.stopScanning();
    }
});

// if the connected device is recognised, call function
noble.on('discover', function(peripheral) {
    var advertisement = peripheral.advertisement;
    var localName = advertisement.localName;
    console.log(localName);
    // OSX will have `undefined` as peripheral name if not connected earlier
    if (localName == undefined || localName.substring(0, 6) != "ADS129") {
        return;
    } else {
        noble.stopScanning();
    }
    explore(peripheral);
});

// FUNCTION TO CALCULATE AND RETURN DATA FROM CONNECTED BLE DEVICE
function explore(peripheral) {
    peripheral.on('disconnect', function() {
        console.log('device disconnected');
    });

    peripheral.connect(function(error) {
        console.log('connected to peripheral: ' + peripheral.uuid);
        peripheral.writeHandle('0x0013', new Buffer([0x01, 0x00]), 0, function(error) {
            console.log("handle written");
        });

        peripheral.discoverServices(['2d0d'], function(error, services) {
            console.log('service discovered');
            var service = services[0];
            service.discoverCharacteristics(['2d37'], function(error, characteristics) {
                //console.log(characteristics);
                var characteristic = characteristics[0];
                characteristic.on('read', function(data, isNotification) {
                    // 8 bits for each data entry X 3
                    x = data[0] * 65536 + data[1] * 256 + data[2];
                    y = data[3] * 65536 + data[4] * 256 + data[5];
                    // EMIT `x` and `y` using node socket server
                    console.log('New point on graph sent to client!');
                    socket.emit('pointData', { value_x: x, value_y: y });
                    // LISTEN to emitted data on ANGULAR application 
                });
            });
        });
    });
}

// listen (start app with node server.js) ======================================
server.listen(1234, function() {
  console.log('Server listening at port ', port);

  setInterval(function(){
    console.log(connectedSockets + ' Online Devices At ' + Date());
  }, 1000 * 60 * 1);
});
