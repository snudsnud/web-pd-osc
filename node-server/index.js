var osc = require("osc");
    WebSocket = require("ws");
const express = require('express');

// Importing events
const EventEmitter = require('events');
// Initializing event emitter instances 
var eventEmitter = new EventEmitter();

// Handling incoming oscMsg
var currentMessage;
var prevMessage = -1;

// Registering to  
eventEmitter.on('sendToPd', (msg) => {
    console.log(msg);

        udpPort.send({
        address: "/s_new",
        args: [
            {
                type: "s",
                value: msg
            },
        ]
        }, "127.0.0.1", 57110);
 });


// Create an osc.js UDP Port listening on port 57121.
var udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 57121,
    metadata: true,
    broadcast: true,

});

// // Listen for incoming OSC messages.
// udpPort.on("message", function (oscMsg, timeTag, info) {
//     console.log("An OSC message just arrived!", oscMsg);
//     console.log("Remote info is: ", info);
// });

// Open the socket.
udpPort.open();


// Create an Express-based Web Socket
// and serve up a directory of static files.
var app = express(),
    server = app.listen(8081);
app.use("/", express.static(__dirname + "/static"));
// Listen for Web Socket requests.
var wss = new WebSocket.Server({
    server: server
});

// Listen for Web Socket connections.
wss.on("connection", function (socket) {
    var socketPort = new osc.WebSocketPort({
        socket: socket,
        metadata: true
    });

    socketPort.on("message", function (oscMsg) {
        console.log("An OSC Message was received!", oscMsg);
        pdflag = oscMsg.args[0].value;
        eventEmitter.emit('sendToPd', pdflag);
    //     // console.log(pdflag);
    });

    // var relay = new osc.Relay(udpPort, socketPort, {
    //     raw: true
    // });

});



