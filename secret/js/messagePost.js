//var socket = io();
var drafts = [];

var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }

var messagePost = function() {
  if ($("#m").val() == '' || $("#s").val() == '') {
    alert("Must fill out subject and message. Not sent.");
    return false;
  }
  socket.emit('message', {
    message: $('#m').val(),
	  subject: $('#s').val(),
	  pass: $('#pass').val(),
	  level: $('input:radio[name=level]:checked').val()
	});
  return false;
};

var addDraft = function() {
  /*socket.emit('draft', {
    message: $('#m').val(),
	  subject: $('#s').val(),
	  pass: $('#pass').val(),
	  level: $('input:radio[name=level]:checked').val()
	});*/
	nextDraft = {
		message: $('#m').val(),
		subject: $('#s').val(),
		level: $('input:radio[name=level]:checked').val()
	};
	drafts.push(nextDraft);
	updateDrafts();
}

function updateDrafts() {
	hizzle = "";
	for (i = 0; i < drafts.length; i++) {
		hizzle += "<div class=draft><h2>" + escapeHtml(drafts[i].subject) + "</h2><p>" + escapeHtml(drafts[i].message) + "</p></div><br>";
	}
	$("#drafts").html(hizzle);
}
