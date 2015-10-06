//var socket = io();
var drafts = [];
var messageTemplate = '<div class="panel {0}"><div class="panel-heading"><h3 class="panel-title">{1}</h3></div><div class="panel-body">{2}</div><div class="panel-body">{3}</div></div>';
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

 var refresher = function() {
	socket.emit('message', {
    message: "refresh",
	  pass: $('#pass').val(),
	  phones: false,
	  type: "message"
	});
 }
  
var messagePost = function() {
  if ($("#m").val() == '' || $("#s").val() == '' || $("#v").val() == '') {
    alert("Must fill out subject, message. Especially voice. Not sent.");
    return false;
  }
  
  socket.emit('message', {
    message: $('#m').val(),
	  subject: $('#s').val(),
	  pass: $('#pass').val(),
	  voice: $('#v').val(),
	  level: $('input:radio[name=level]:checked').val(),
	  phones: $('#p').attr('checked'),
	  type: "message"
	});
	$('#m').val("");
	$('#s').val(""); 
	$('#v').val(""); 
  return false;
};

var addDraft = function() {
	nextDraft = {
		message: $('#m').val(),
		subject: $('#s').val(),
		voice: $('#v').val(),
		level: $('input:radio[name=level]:checked').val()
	};
	drafts.push(nextDraft);
	socket.emit('message', {
		pass: $('#pass').val(),
		drafts: drafts,
		type: "draft"
	});
	updateDrafts(false);
	$('#m').val("");
	$('#s').val(""); 
	$('#v').val(""); 
	
}

deleteDraft = function(i) {
	drafts.splice(i, 1);
	socket.emit('message', {
		pass: $('#pass').val(),
		drafts: drafts,
		type: "draft"
	});
	updateDrafts(false);
}

var useDraft = function(i) {
	$('#m').val(drafts[i].message);
	$('#s').val(drafts[i].subject); 
	$('#v').val(drafts[i].voice); 
}

function updateDrafts(server) {
	//console.log("updating drafts");
	if (server) {
		$.getJSON("http://159.203.73.64/drafts" , function(data) {
			drafts = data;
		});
	}
	hizzle = "";
	for (i = 0; i < drafts.length; i++) {
		hizzle = messageTemplate.format("hacknc_panel", escapeHtml(drafts[i].subject), escapeHtml(drafts[i].message), escapeHtml(drafts[i].voice)) + "<a href='javascript:useDraft(" +  i  + ")' class='btn btn-primary' id='addDraft" + i + "'>Use this draft</a> <a href='javascript:deleteDraft(" +  i  + ")' class='btn btn-primary' id='deleteDraft" + i + "'>Delete this draft</a>" + hizzle;
	}
	$("#drafts").html(hizzle);
}

$(document).mouseenter(function() {
	//I'm sorry
	updateDrafts(true);
});
