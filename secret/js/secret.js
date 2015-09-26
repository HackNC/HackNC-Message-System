var socket = io();

socket.on('message', function(msg){
  console.log(msg);

  if (msg.hasOwnProperty("error")){
	  alert(msg.error);
	  console.log(msg.error);
  }
});
$('#refresher').click(function() {
  socket.emit('message', 
	  {msg: 		"refresh",
	   pass: 		$('#pass').val(),
	   email:		false,
	   body:		"",
	   subject:	""});
  });


String.prototype.trunc = String.prototype.trunc ||
  function(n){
      return this.length>n ? this.substr(0,n-1)+'…' : this;
  };
