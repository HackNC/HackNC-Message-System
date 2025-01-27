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
	meSpeak.speak(text, {"speed":125, "variant":"f5"});
}

$(function(){
	$("#s").characterCounter({
	});
	$("#m").characterCounter({
	});
	$("#v").characterCounter({
	});
});
