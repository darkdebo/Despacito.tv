var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: 'kJQP7kiw5Fk',
    events: {
      'onReady': onPlayerReady,
    }
  });
}

function onPlayerReady(event) {
  event.target.playVideo();
}

function resumeVideo() {
  player.playVideo()
}

function pauseVideo() {
  player.pauseVideo();
}