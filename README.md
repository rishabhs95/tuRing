# Web Summit 2016 Lisbon
A Real-time application for rendering and processing smart ring data.

## Running the project

  - `grunt serve` to run the client application
  - `node express_server.js` to run the node proxy server which connect to the hardware over BLE
  - go to `localhost:9000`

## Final project
We are currently using Angular 1.4 for front-end and express over node.js for the back-end proxying server.

Our application:

**Smart Ring** <-> *BLE* <-> **express_server** <-> *socket* <-> **AngularJS_client**

  1. Smart Ring: Hardware Team
  2. Express Server
     - connects to hardware over BLE and recieves data at a constant rate.
     - connects to AngularJS client over socket to maintain a connection and updates pushes data in real time.
  3. AngularJS Client:
     - connects to express_server over socket to recieve data at a constant rate.
     - maintains a Queuing model, consisting of fixed number of elements which contains data to be plot,
     fixed eleents help in preventing buffer overflows.


--------------------------------------------------------------------------------------------------------

## Initial Planning
We are planning to make a python based client for processing data sent by our hardware module over Bluetooth 
using Bluetooth Low Energy libraries. We also have to process the data in a meaningful and efficient manner 
to produce quick and a responsive application.

## Timeline
Time Duration : *60 days*

The tasks we need to deliver during the time period can be done in this following priority:

Task 1: We will first target towards making a server-side application to recieve and process data from our hardware module over python and its BLE libraries.  
Task 2: Make a client-side application to display the data and mock some features which we plan to do with this device.  
Task 3: Check if we need some mobile application for our interface and if time permits, we can work on it.
