var socket = io();

var messagePost = function() {
  if ($("#m").val() == '' || $("#s").val() == '') {
    alert("Must fill out subject and message. Not sent.");
    return false;
  }
  socket.emit('message', {
    message: $('#m').val(),
	  subject: $('#s').val(),
	  pass:	   $('#pass').val(),
	  level:	 $('#level').checked,
	});
  return false;
};
