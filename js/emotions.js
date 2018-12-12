let emotions = ['angry','neutral', 'happy'];
let classifier = null;
let mobilenet_model = null;
let detected_e = null;
let mode = 'test';
let video = null;

async function init(){
  // load the load mobilenet and create a KnnClassifier
  this.classifier = knnClassifier.create();
  this.mobilenet_model = await mobilenet.load();

  read_data_file()
}

function read_data_file() {
  $.ajax({
    type: "GET",
    url: "./fer2013/data.csv",
    dataType: "text",
    success: function(data) {train(data);}
 });
}

function train(csv) {
  console.log('training model...')
  let split = csv.split('\n');
  let headers = split[0].split(',');
  let lines = [];

  console.log('training on ' + split.length + ' cases');
  for (let i=1; i<5; i++) {
      let data = split[i].split(',');
      if (data.length == headers.length) {
        // train model on each image
        addExample(data[1], data[0]);
      }
  }

  getEmotion();
}


function addExample(img, emotion){
  // create off-screen canvas element
  var canvas = document.createElement('canvas'),
  ctx = canvas.getContext('2d');

  canvas.width = 48;
  canvas.height = 48;

  // create imageData object
  var idata = ctx.createImageData(48, 48);

  // set our buffer as source
  idata.data.set(img);

  // update canvas with new data
  ctx.putImageData(idata, 0, 0);

  const logits = this.mobilenet_model.infer(canvas, 'conv_preds');
  console.log(emotion)
  this.classifier.addExample(logits, parseInt(emotion));
}


async function getEmotion(){
  let frame = document.getElementById('test')
  const img = tf.fromPixels(frame);
  const logits = this.mobilenet_model.infer(img, 'conv_preds');
  const pred = await this.classifier.predictClass(logits);
  console.log(pred);
  this.detected_e = this.emotions[pred.classIndex];
  this.registerEmotion();
}


function registerEmotion(){
    alert(this.detected_e)
}


function captureWebcam(){
  video = document.getElementById("videoElement");
 
  if (navigator.mediaDevices.getUserMedia) {       
      navigator.mediaDevices.getUserMedia({video: true})
    .then(function(stream) {
      video.srcObject = stream;
    })
    .catch(function(error) {
      console.log("Error capturing webcam video: " + error);
    });
  }
}

//captureWebcam();
init();