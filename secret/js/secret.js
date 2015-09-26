var socket = io();

socket.on('message', function(msg){
  if (msg.hasOwnProperty("error")){
	  alert(msg.error);
	  console.log(msg.error);
  }
});
