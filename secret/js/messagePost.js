var socket = io();

var messagePost = function() {
  socket.emit('message', 
	  {msg:		$('#m').val(),
	   pass:	$('#pass').val(),
	   level:	$('#level').checked,
	  });
  return false;
};
