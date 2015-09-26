var socket = io.connect('159.203.73.64:9001');

socket.on('message', function(msg){
	console.log(msg);
	if (msg === "refresh") {
		location.reload(true);
	} else {
		appendMessage(msg);
		$('#message').text(msg);
		$('#blocko').textfill({maxFontPixels:0});

		if (!chromaMode){
			timeouts.push(setTimeout(function(){
				$('#blocko').fadeOut(2000);
				$('#schedule').fadeIn(2000);
				$('#scroller').fadeOut(2000);
			}, 300000));
		} else {
			timeouts.push(setTimeout(function(){
				$('#blocko').fadeOut(2000);
			}, 60000));
		}
	}
});

// Room label
var room = window.localStorage.room;
if (room) {
	$("#room").text("You're in " + room);
} else {
	$("#room").text("Welcome to HackNC");			
}
$(document).keydown(function(event) {
	if (event.which === 82) { // 'r'
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

function show2(){
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
}
window.onload=show2;

////////////////////////////

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
