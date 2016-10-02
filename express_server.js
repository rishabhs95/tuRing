// SET UP ========================
var port = process.env.PORT || 8080;

// NODE BLE CONFIGURATION
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

// INCLUDE DEPENDENCIES ========================
var express = require('express');
var app = express();
// var mongoose = require('mongoose');
var morgan = require('morgan');
// var bodyParser = require('body-parser');
// var methodOverride = require('method-override');

// CONFIGURATION =================
// mongoose.connect('mongodb://localhost/ble');

// app.use(express.static(__dirname + '/public'));
app.use(morgan('dev')); // log every request to the console
// app.use(bodyParser.urlencoded({ 'extended': 'true' }));
// app.use(bodyParser.json());
// app.use(methodOverride());

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
    /*
    	MOVE PERIPHERAL EXPLORE TO /API/GET
    	explore(peripheral);
    */
});


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'OPTIONS,GET');
    res.header("Access-Control-Allow-Headers", "Content-Type, Accept, X-Access-Token, X-Key");

    if (req.method == 'OPTIONS') {
        return res.sendStatus(200);
    }
    next(); // make sure we go to the next routes and don't stop here
});

// GET data from socket connection
router.get('/recieve', function(req, res) {
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
                    // LISTEN to emitted data on ANGULAR application 
                });
            });
        });
    });
}



// REGISTER OUR ROUTES ================================
// all of our routes will be prefixed with /api
app.use('/ble_api', router);

// listen (start app with node server.js) ======================================
app.listen(1234);
console.log("App listening on port 1234");
