let emotions = ['angry','neutral', 'happy'];
let classifier = null;
let mobilenet_model = null;
let learner = null;
let detected_e = null;
let mode = 'test';
let video = null;

async function init(){
  // load the load mobilenet and create a KnnClassifier
  this.classifier = knnClassifier.create();
  this.mobilenet_model = await mobilenet.load();
}


function trainModel(){
  let selected = document.getElementById("emotion_options");
  this.learner = selected.options[selected.selectedIndex].value;
  this.addExample();
}


function addExample(){
  const img= tf.fromPixels(this.$children[0].webcam.webcamElement);
  const logits = this.mobilenet_model.infer(img, 'conv_preds');
  this.classifier.addExample(logits, parseInt(this.learner));
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

/*
function changeOption(){
    const selected = document.getElementById("use_case");
    this.mode = selected.options[selected.selectedIndex].value;
}
*/


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

captureWebcam();
init();