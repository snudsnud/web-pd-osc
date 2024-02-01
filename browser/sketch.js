// Set up osc.js with websocket
var oscPort = new osc.WebSocketPort({
    url: "ws://localhost:8081", // URL to your Web Socket server.
    metadata: true
});
oscPort.open();
oscPort.on("message", function (oscMsg) {
    console.log("An OSC message just arrived!", oscMsg);
});

// When you need to send oscMsg to Pd via node.js bridge
function sendOsc(msg)
{
    console.log("sending");
    oscPort.send({
        address: "/carrier/frequency",
        args: [
            {
                type: "f",
                value: msg
            }
        ]
    });
    
}

function setup() {

}


function draw() {
    setInterval(sendOsc(1, 1000));
}

 

