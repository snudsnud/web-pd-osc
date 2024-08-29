// Initialize the Image Classifier method with MobileNet. A callback needs to be passed.
let classifier;

let video;
let object = '';
let confidence = 0;
let vowels = 0;
let consonants = 0;


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
    // console.log("sending");
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
    createCanvas(windowWidth, windowHeight);
    video = createCapture(VIDEO);
    video.hide();
    background(0);
    classifier = ml5.imageClassifier('MobileNet', video, modelReady);
}


// A function to run when we get any errors and the results
function gotResult(error, results) {
    // Display error in the console
    if (error) {
      console.error(error);
    } else {
    //   console.log(results);
      object = results[0].label;
      confidence = results[0].confidence;
  
      modelReady();
    }
}
  
function modelReady() {
  classifier.predict(gotResult)
}

function isVowel(c) {
    return ['a', 'e', 'i', 'o', 'u'].indexOf(c.toLowerCase()) !== -1
}

function checkObject(o) {
    for (let i = 0; i < o.length; i++) {
        if (isVowel(o[i])){
            vowels++;
        } else {
            consonants++;
        }
    };
}

function draw() {
    background(0);
    image(video, 100, 100);
    fill(255);
    textSize(32);
    text(object, 10, height-100);
    text(confidence, 10, height-50);
    checkObject(object);

    setInterval(sendOsc(255, 1000));
    setInterval(sendOsc(vowels, 1000));
    setInterval(sendOsc(consonants, 1000));
    setInterval(sendOsc(confidence, 1000));

    vowels = 0;
    consonants = 0;
}

 

