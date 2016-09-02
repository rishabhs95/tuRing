console.log("ble ecg interfacing");

var noble = require('noble');
const fs = require('fs');
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

noble.on('stateChange', function(state) {
    console.log("statechange:" + state);
    if (state === 'poweredOn') {
        console.log("Bluetooth is on here");
        noble.startScanning();
    } 
    else {
        console.log("Bluetooth not on");
        noble.stopScanning();
    }
});

noble.on('discover', function(peripheral) {

    var advertisement = peripheral.advertisement;
    var localName = advertisement.localName;
    console.log(localName);
    if (localName == undefined || localName.substring(0, 6) != "ADS129") {
        return;
    } 
    else {
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
            console.log("inside loop");
        });

        peripheral.discoverServices(['2d0d'], function(error, services) {
            console.log('service discovered');
            var service = services[0];
            service.discoverCharacteristics(['2d37'], function(error, characteristics) {
                //console.log(characteristics);
                var characteristic = characteristics[0];
                characteristic.on('read', function(data, isNotification) {
                    //console.log( data[0]*65536+data[1]*256+data[2] ,data[3]*65536+data[4]*256+data[5] );

                    x = data[0] * 65536 + data[1] * 256 + data[2];
                    y = data[3] * 65536 + data[4] * 256 + data[5];
                });
            });

        });
    });
}
