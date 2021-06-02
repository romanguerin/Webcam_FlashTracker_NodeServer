let colors; //get colors
let capture; //get Camera

//delayer
let track = true; // check if track is true
let wait = 0;     // wait in fps
let lock = false; // lock for falsifier

let numb = 0;     //starting number
let trackingData; // trackingdata

let session = {
  'values': [],
}; //session in json file

function setup() {
  createCanvas(1920,1080);
  capture = createCapture(VIDEO); //capture the webcam
  capture.position(0,0) ;//move the capture to the top left
  capture.style('opacity',0.5);// use this to hide the capture later on (change to 0 to hide)...
  capture.style('transform','scaleX(-1)');
  capture.style('object-fit','cover');
  capture.id("myVideo"); //give the capture an ID so we can use it in the tracker below.
  capture.size(1920,1080);

  //add new color
    tracking.ColorTracker.registerColor('white', function(r, g, b) {
    var threshold = 50,
      dx = r - 245,
      dy = g - 245,
      dz = b - 245;
    if ((r - g) >= threshold && (b - g) >= threshold) {
      return true;
    }
    return dx * dx + dy * dy + dz * dz < 19600;
  });

    colors = new tracking.ColorTracker(['white']);
  tracking.track('#myVideo', colors); // start the tracking of the colors above on the camera in p5

  //start detecting the tracking
  colors.on('track', function(event) { //this happens each time the tracking happens
      trackingData = event.data // break the trackingjs data into a global so we can access it with p5
  });

}

function draw() {
  stroke(255,255,0);  //color yellow
  strokeWeight(4); //stroke thicknes
  if(trackingData){ //if there is tracking data to look at, then...
    for (let i = 0; i < trackingData.length; i++) { //loop through each of the detected colors
detect(i);
    }
  }
  //locker if lock is true wait for input
  if (lock === true) {
    wait++;
    if (wait === 25) {
      console.log("new allowed");
      wait = 0;
      track = true;
      lock = false;
    }
  }
}

function detect(j){
  //track
  if (track === true){
    let wX = trackingData[j].x + (trackingData[j].width / 2)-25;
    let hY = trackingData[j].y + (trackingData[j].height / 2)-25;
  rect(1920 - wX, hY,50,50);
    console.log("x ",1920 - wX,"y",hY);
  lock = true; // lock waiter
  track = false; //stop tracking
    jsonExp(1920 - wX + 25, hY + 25); //send data
  }
}


function jsonExp(getX,getY,getW,getH){
  session.values.push({ 'v': numb, 'x': getX, 'y': getY});
  numb++; //number

  //remove maximum array of 24
  if (session.values.length > 36) {
    session.values.shift();
    for (let k = 0; k < session.values.length; k++) {
      session.values[k].v = k;
    }
  }
  aj(session); //send to ajax
}

function aj(jsData){
  $.ajax({
    url: 'http://127.0.0.1:8090/',
    data:   JSON.stringify(jsData),
    type: 'POST',
    jsonpCallback: 'callback', // this is not relevant to the POST   anymore
    success: function (response) {
      console.log(response);
    },
    error: function (error) {
      console.log(error);
    },
});
}
