var socket = io();

var messagePost = function() {
  alert('asdf' + $('input[name="level"]:checked').val());
  socket.emit('message', 
	  {msg:		$('#m').val(),
	   pass:	$('#pass').val(),
	   level:	$('#level').checked,
	  });
  return false;
};
