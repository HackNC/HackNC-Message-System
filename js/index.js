var socket = io.connect('159.203.73.64');

socket.on('message', function(msg){
	console.log(msg);
	if (msg === "refresh") {
		location.reload(true);
	} else {
		addMessage(msg);
	}
});

// Add a message
var addMessage = function(msg) {
	var panel_type;
	if (msg.level == 'normal') {
		panel_type = 'hacknc-panel';
	} else if (msg.level == 'elevated') {
		panel_type = 'panel-warning';
	} else if (msg.level == 'emergency') {
		panel_type = 'panel-danger';
	} else {
		panel_type = 'panel-primary';
	}
  var elem = messageTemplate.format(panel_type, msg.subject, msg.message);
  $('#messages').prepend(elem);
};

// Room label
var room = window.localStorage.room;
if (room) {
	$("#room").text("You're in " + room);
} else {
	$("#room").text("Welcome to HackNC");			
}

// Set room
$(document).keydown(function(event) {
	if (event.which === 82 && event.shiftKey) { // 'shift + r'
		var roomName = window.prompt("What room is this?", "SN014");
		$("#room").text("You're in " + roomName);
		window.localStorage.room = roomName;
	}
});

// Clock

/*By JavaScript Kit
http://javascriptkit.com
Credit MUST stay intact for use
such script kiddie very wow
*/

var show2 = function() {
	if (!document.all&&!document.getElementById)
		return
	thelement=document.getElementById? document.getElementById("tick2"): document.all.tick2
	var Digital=new Date()
	var hours=Digital.getHours()
	var minutes=Digital.getMinutes()
	var seconds=Digital.getSeconds()
	var dn="PM"
	if (hours<12)
		dn="AM"
	if (hours>12)
		hours=hours-12
	if (hours==0)
		hours=12
	if (minutes<=9)
		minutes="0"+minutes
	if (seconds<=9)
		seconds="0"+seconds
	var ctime=hours+":"+minutes+":"+seconds+"&nbsp;"+dn
	thelement.innerHTML="<span>" + ctime + "</span>";
	setTimeout("show2()",1000)
};
window.onload=show2;

// String format
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

var messageTemplate = '<div class="panel {0}"><div class="panel-heading"><h3 class="panel-title">{1}</h3></div><div class="panel-body">{2}</div></div>';
var scheduleTemplate = '<div class="list-group-item"><div class="row-content"><h4 class="list-group-item-heading">{0}</h4><p class="list-group-item-text">{1}</p></div></div><div class="list-group-separator"></div>';

// Events loop
var init = function() {

}

var populateSchedule = function() {	
	var date = new Date(2015, 9, 10, 8, 59);
	var day = '';
	var $schedule = $('#schedule-list');
	if (date.getYear() == 115 && date.getMonth() == 9) {
		if (date.getDate() == 9) {
			// Friday
			day = 'friday';
			$schedule.empty();
		} else if (date.getDate() == 10) {
			// Saturday
			day = 'saturday';
			$schedule.empty();
		} else if (date.getDate() == 11) {
			// Sunday
			day = 'sunday';
			$schedule.empty();
		} else {
			// Not HackNC
			return;
		}
	} else {
		// Not HackNC
		return;
	}
	console.log(day);
  // display schedule
  var hizzler = "" ;
  for (var i = 0; i < schedule.events.length; i++){
  	//////////// This doesn't work yet..................
  	console.log('schedule sorting doesn\'t work yet');
    thisEvent = schedule.events[i];
    var hour, mins, ampm;
    if (thisEvent.endtime) {
    	hour = thisEvent.endtime.split(':');
	    mins = hour[1].split(' ');
	    ampm = mins[1];
    } else {
			hour = thisEvent.starttime.split(':');
	    mins = hour[1].split(' ');
	    ampm = mins[1];
    }  
    if (schedule.events[i].day.toLowerCase() == day && 
    	  hour[0] < ((date.getHours() % 12) + 1) &&
        mins[0] < date.getMinutes() &&
        (date.getHours() < 12 && ampm == 'am' || 
        date.getHours >= 12 && ampm == 'pm')) {
		console.log("testing");
      $schedule.html($schedule.html() + scheduleTemplate.format(thisEvent.starttime + " - " + thisEvent.endtime, thisEvent.title));
    } 
  }
}

var schedule = { "events" : [

		{"starttime" : "5:00 PM", 
		"endtime" : "11:59 PM",
		"day" : "Friday",
		"title": "Check-in"},
	
		{"starttime" : "5:30 PM", 
		"endtime" : "7:00 PM",
		"day" : "Friday",
		"title": "Dinner is served"},
		
		{"starttime" : "6:00 PM", 
		"endtime" : "6:50 PM",
		"day" : "Friday",
		"title": "Guest lectures"},
	
		{"starttime" : "7:30 PM", 
		"endtime" : "8:20 PM",
		"day" : "Friday",
		"title": "Hardware event"},
	
		{"starttime" : "8:30 PM", 
		"endtime" : "9:20 PM",
		"day" : "Friday",
		"title": "Team formation"},
	
		{"starttime" : "9:30 PM", 
		"endtime" : "10:30 PM",
		"day" : "Friday",
		"title": "Snack time!"},
	
		{"starttime" : "10:00 PM", 
		"endtime" : "7:00 AM",
		"day" : "Friday",
		"title": "Sleeping room is available"},
	
		{"starttime" : "6:30 AM", 
		"endtime" : "8:45 AM",
		"day" : "Saturday",
		"title": "Breakfast is served"},
	
	  {"starttime" : "7:00 AM", 
		"endtime" : " 8:45 AM",
		"day" : "Saturday",
		"title": "Check-in"},
	
		{"starttime" : "8:45 AM", 
		"endtime" : " 2:50 PM",
		"day" : "Saturday",
		"title": "Late check-in"},
		
		{"starttime" : "9:00 AM", 
		"endtime" : "9:50 AM",
		"day" : "Saturday",
		"title": "Keynote"},
		
		{"starttime" : "10:00 AM", 
		"endtime" : "",
		"day" : "Saturday",
		"title": "Hacking begins!"},
		
		{"starttime" : "10:00 AM", 
		"endtime" : "10:50 AM",
		"day" : "Saturday",
		"title": "Team formation"},
	
	  {"starttime" : "10:00 AM", 
		"endtime" : " 1:50 PM",
		"day" : "Saturday",
		"title": "Sponsor fair"},
		
		{"starttime" : "11:00 AM", 
		"endtime" : "6:00 PM",
		"day" : "Saturday",
		"title": "Tech talks"},
		
		{"starttime" : "11:45 AM", 
		"endtime" : "1:00 PM",
		"day" : "Saturday",
		"title": "Lunch is served"},
		
		{"starttime" : "5:30 PM", 
		"endtime" : "6:50 PM",
		"day" : "Saturday",
		"title": "Dinner is served"},
		
		{"starttime" : "7:00 PM", 
		"endtime" : "11:00 PM",
		"day" : "Saturday",
		"title": "Mini-events for fun"},
		
		{"starttime" : "10:00 PM", 
		"endtime" : "10:50 PM",
		"day" : "Saturday",
		"title": "Snack time!"},
		
		{"starttime" : "10:00 PM", 
		"endtime" : "7:00 AM",
		"day" : "Saturday",
		"title": "Sleeping room available"},
		
		{"starttime" : "6:30 AM", 
		"endtime" : "9:00 AM",
		"day" : "Sunday",
		"title": "Breakfast is served"},
		
		{"starttime" : "11:00 AM", 
		"endtime" : "",
		"day" : "Sunday",
		"title": "Hacking ends!"},
		
		{"starttime" : "11:30 AM", 
		"endtime" : "1:00 PM",
		"day" : "Sunday",
		"title": "Lunch is served"},
		
		{"starttime" : "12:30 PM", 
		"endtime" : "1:50 PM",
		"day" : "Sunday",
		"title": "Demos and project presentations"},
		
		{"starttime" : "2:00 PM", 
		"endtime" : "2:30 PM",
		"day" : "Sunday",
		"title": "Judges deliberate"},

		{"starttime" : "2:30 PM", 
		"endtime" : "3:50 PM",
		"day" : "Sunday",
		"title": "Prizes are awarded"},
		
		{"starttime" : "4:00 PM", 
		"endtime" : "",
		"day" : "Sunday",
		"title": "Time to go home!"}
	]
};

$(function() {populateSchedule()});


// function getEvent() {
// 	var currentTime = new Date();
// 	var i = 0;
// 	var size = schedule.length;
// 	while (schedule[i][0] < currentTime) {
// 		i++;
// 	}
// 	toReturn = [];
// 	for (j = i; j < Math.min(i+10, size); j++) {
// 		var hoursTil = (schedule[j][0].getTime() - currentTime.getTime()) / 1000 / 60 / 60;
// 		if (hoursTil > 1.5) {
// 			hoursTil = Math.round(hoursTil);
// 			toReturn.push(hoursTil + " hours until " + schedule[j][1]);
// 		} else {
// 			minutesTil = hoursTil * 60;
// 			if (minutesTil > 1.5) {
// 				minutesTil = Math.round(minutesTil);
// 				toReturn.push(minutesTil + " minutes until " + schedule[j][1]);
// 			} else {
// 				secondsTil = Math.round(minutesTil * 60);
// 				toReturn.push(secondsTil + " second(s) until " + schedule[j][1]);
// 			}
// 		}
// 	}
// 	return toReturn.length > 0 ? toReturn : ["See you next time!"]
// }

// setInterval(function(){
// 	events = getEvent();
// 	document.getElementById("scroller").innerHTML = "<span>" + events[0] + "</span>";
// 	$("#scroller").textfill({maxFontPixels:0});
// 	sString = "";
// 	for (i = 0; i < Math.min(8, events.length); i++) {
// 		sString += events[i];
// 		sString += "<br>";
// 	}
// 	document.getElementById("schedule").innerHTML = "<span class=message style='margin-left:10%'>" + sString + "</span>";
// 	$("#schedule").textfill({maxFontPixels:0});
// }, 1000);
