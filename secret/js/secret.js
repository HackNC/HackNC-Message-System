var socket = io();
meSpeak.loadConfig("mespeak_config.json");
meSpeak.loadVoice('en-us.json');

socket.on('message', function(msg){
  if (msg.hasOwnProperty("error")){
	  alert(msg.error);
	  console.log(msg.error);
  }
});

demoVoice = function(text) {
	meSpeak.speak(text, {"speed":125});
}

$(function(){
	$("#s").characterCounter({
		limit: 120
	})
	$("#m").characterCounter({
		limit: 200
	})
	$("#v").characterCounter({
		limit: 200
	})
});
