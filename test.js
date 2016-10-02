console.log("ble ecg interfacing");

// CONSTANTS
var noble = require('noble');
var ARRAY_SIZE = 1000;
var buffer_x = 1000;
var buffer_y = 1000;
var min_width = 60;
var MIN_NUM_VALUES_TO_PLOT = 100;
var counter = -1;
var lead1data = [];
var lead2data = [];
var ws;
var ECG_DATA_PORT = 8097;
var connected = false;

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
                });
            });
        });
    });
}
