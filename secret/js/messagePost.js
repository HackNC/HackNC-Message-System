//var socket = io();
var drafts = [];
var messageTemplate = '<div class="panel {0}"><div class="panel-heading"><h3 class="panel-title">{1}</h3></div><div class="panel-body">{2}</div></div>';
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match;
    });
  };
}

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
	$('#m').val("");
	$('#s').val(""); 
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
	$('#m').val("");
	$('#s').val(""); 
}

deleteDraft = function(i) {
	drafts.splice(i, 1);
	updateDrafts();
}

var useDraft = function(i) {
	$('#m').val(drafts[i].message);
	$('#s').val(drafts[i].subject); 
}

function updateDrafts() {
	hizzle = "";
	for (i = 0; i < drafts.length; i++) {
		hizzle = messageTemplate.format("hacknc_panel", escapeHtml(drafts[i].subject), escapeHtml(drafts[i].message)) + "<a href='javascript:useDraft(" +  i  + ")' class='btn btn-primary' id='addDraft" + i + "'>Use this draft</a> <a href='javascript:deleteDraft(" +  i  + ")' class='btn btn-primary' id='deleteDraft" + i + "'>Delete this draft</a>" + hizzle;
	}
	$("#drafts").html(hizzle);
}
