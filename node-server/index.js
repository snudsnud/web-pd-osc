var osc = require("osc");
    WebSocket = require("ws");
const express = require('express');

// HoloLens IPs
const sockets = {};
const ethernet1 = "::ffff:192.168.0.19";
const ethernet2 = "::ffff:192.168.0.248";
var hl3 = ethernet1;
var hl4 = ethernet2;

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
    server = app.listen(3000);
app.use("/", express.static(__dirname + "/static"));
// Listen for Web Socket requests.
var wss = new WebSocket.Server({
    server: server
});

// Listen for Web Socket connections.
wss.on("connection", function (ws, request, socket) {
    var socketPort = new osc.WebSocketPort({
        socket: socket,
        metadata: true
    });

    const user_id = request.socket.remoteAddress;
    ws.id = user_id;
    sockets[ws.id] = ws;
    //console.log(ws);


    socketPort.on("message", function (oscMsg) {
        console.log("An OSC Message was received!", oscMsg);
        pdflag = oscMsg.args[0].value;
        eventEmitter.emit('sendToPd', pdflag);
    //     // console.log(pdflag);
    });

    // var relay = new osc.Relay(udpPort, socketPort, {
    //     raw: true
    // });

    ws.on('error', console.error);
    ws.on('message', function message (data) {
        console.log(data);
        to(hl3, data);
        // if (exp_con == "rmi") {
        //       //RMI condition
        //   if (user_id == laptop1 ) {
        //         to(hl4, data)
        //   }else if (user_id == laptop2) {
        //         to(hl3, data)
        //   }
        
        // }else if (exp_con == "bmi") {
              //BMI condition
        // if (user_id == hl3) {
        //   to(hl4, data);
        // }else if (user_id == hl4) {
        //   to(hl3, data);
        // }
        // }else if (exp_con == "localtest"){
        //   to("::ffff:127.0.0.1", data)
        // }else if (exp_con == "hltest"){
        //   to(hl3, data)
        // }else if (exp_con == "dostest"){
        //   to("::ffff:192.168.0.216" ,data)
        // }else if  (exp_con == "duplex"){
        // //console.log(data)
        //   if (user_id == laptop1) {
        //   to(hl4, data)
        //   }else if (user_id == laptop2) {
        //   to(hl3, data)
        //   }
    
        //   if (user_id == hl4) {
        //     to(hl3, data)
        //   }else if (user_id == hl3) {
        //     to(hl4, data)
        //   }
    
        // }
    
    
    
      });

    ws.on('close', function() {
        console.log("client left.");
    });
});



// thanks to https://stackoverflow.com/questions/51316727/how-do-i-send-a-message-to-a-specific-user-in-ws-library.
function to(user, data) {
    if(sockets[user] && sockets[user].readyState === WebSocket.OPEN)
        sockets[user].send(data);
}
