# tuRing - the smart ring
A Real-time application for rendering and processing smart ring data efficiently.

## Running the project

  - `grunt serve` to run the client application
  - `node express_server.js` to run the node proxy server which connect to the hardware over BLE
  - go to `localhost:9000`

## Technologies
We are currently using Angular 1.4 for front-end and express over node.js for the back-end proxying server.

## Architecture

**Smart Ring** <-> *BLE* <-> **express_server** <-> *socket* <-> **AngularJS_client**

  1. Smart Ring: Hardware Team
  2. Express Server
     - connects to hardware over BLE and recieves data at a constant rate.
     - connects to AngularJS client over socket to maintain a connection and updates pushes data in real time.
  3. AngularJS Client:
     - connects to express_server over socket to recieve data at a constant rate.
     - maintains a Queuing model, consisting of fixed number of elements which contains data to be plot,
     fixed eleents help in preventing buffer overflows.
