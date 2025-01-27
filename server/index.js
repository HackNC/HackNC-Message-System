var app = require('express')();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
io.set('origins', '*:*');
var secret = require('./secret.json');
var fs = require("fs");
// Google push
var googleKey = secret.googleKey;
var gcm = require('node-gcm');
var sender = new gcm.Sender(googleKey);
// Apple push
var apn = require('apn');
var options = {
	'gateway': 'gateway.push.apple.com' // production environment
};
var apnConnection = new apn.Connection(options);

// Registered IDs
var regIDs = JSON.parse(fs.readFileSync('regids.txt'));
var messageArchive = JSON.parse(fs.readFileSync('archive.txt'));
var drafts = JSON.parse(fs.readFileSync('drafts.txt'));

//files and stuff
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, './', 'index.html'));
});

app.get('/tv', function(req, res){
  res.sendFile(path.join(__dirname, './', 'tv.html'));
});

app.get('/s.ogg', function(req, res){
  res.sendFile(path.join(__dirname, './', 's.ogg'));
});

app.get('/js/index.js', function(req, res){
  res.sendFile(path.join(__dirname, './js', 'index.js'));
});

app.get('/css/tv.css', function(req, res){
  res.sendFile(path.join(__dirname, './css', 'tv.css'));
});

app.get('/images/hacknc.png', function(req, res){
  res.sendFile(path.join(__dirname, './images', 'hacknc.png'));
});

app.get('/secret', function(req, res){
  res.sendFile(path.join(__dirname, './secret', 'index.html'));
});

app.get('/mespeak.js', function(req, res){
  res.sendFile(path.join(__dirname, './mespeak', 'mespeak.js'));
});

app.get('/mespeak_config.json', function(req, res){
  res.sendFile(path.join(__dirname, './mespeak', 'mespeak_config.json'));
});

app.get('/en-us.json', function(req, res){
  res.sendFile(path.join(__dirname, './mespeak/voices/en', 'en-us.json'));
});

app.get('/js/secret.js', function(req, res){
  res.sendFile(path.join(__dirname, './secret', 'js', 'secret.js'));
});

app.get('/js/jquery.charactercounter.js', function(req, res){
  res.sendFile(path.join(__dirname, './secret', 'js', 'jquery.charactercounter.js'));
});


app.get('/js/messagePost.js', function(req, res){
  res.sendFile(path.join(__dirname, './secret', 'js', 'messagePost.js'));
});

app.get('/js/arrive.js', function(req, res){
  res.sendFile(path.join(__dirname, './secret', 'js', 'messagePost.js'));
});

app.get('/jquery.textfill.min.js', function(req, res){
  res.sendFile(path.join(__dirname, './js', 'jquery.textfill.min.js'));
});


app.get('/reg', function(req, res) {
	res.set("Content-Type", "text/plain")
	res.send('id: ' + req.query.id);
	if (req.query.platform == 'Android') {
		regIDs.google[req.query.uuid] = req.query.id;
		fs.writeFile('regids.txt', JSON.stringify(regIDs),  function(err) {
			if (err) {
				console.error("failed to write json");
			}
		});
	} else if (req.query.platform == 'iOS') {
		regIDs.ios[req.query.uuid] = req.query.id;
		fs.writeFile('regids.txt', JSON.stringify(regIDs),  function(err) {
			if (err) {
				console.error("failed to write json");
			}
		});
	} else {
		//??????
	}
	console.log("registered: ", req.query.id);
});

function makeID() {
	// get latest id
	var maxid = 0;
	for (var i = 0; i < messageArchive.length; i++) {
		maxid = Math.max(messageArchive[i].id, maxid);
	}
	// if no id was found, the starting id is 1.
	maxid++;
	return maxid;
}

//socket.io stuff
io.on('connection', function(socket){
  socket.on('message', function(msg){
	console.log("message:", msg);
	if (msg.pass === secret.pass) {
		if (msg.type === "message") {
			// delete pass
			
			delete msg['pass'];
			io.emit("message", msg);
			if (msg.phones) {
				console.log("notified phones");
				msg.id = makeID();
				notificate = new gcm.Message({
					data: {
						id: msg.id
					},
					// remove the `notification` stuff to get a silent push.
					notification: {
						title: msg.subject,
						body: msg.message
					}
				});
				// Send GCM stuff
				sender.send(notificate, Object.keys(regIDs.google).map(function(key){return regIDs.google[key];}), 5, function(err, result) {
					if (err) { console.error("send error", err);return;}
					console.log("send result", result);
				});
				// Apple push notifications
				for (var uuid in regIDs.ios) {
					var id = regIDs.ios[uuid];
					var myDevice = new apn.Device(id);
					
					// do push
					var note = new apn.Notification();
					note.alert = {
						'title': msg.subject,
					  'body': msg.message
					};
					note.badge = 1;
					note.sound = "default";

					apnConnection.pushNotification(note, myDevice);
				}
			} else {
				console.log("did not nofity phones");
			}
			// Archive message
			messageArchive.push(msg);
			fs.writeFile('archive.txt', JSON.stringify(messageArchive),  function(err) {
				if (err) {
					console.error("failed to write json");
				}
			});
		} else if (msg.type === "draft") {
			console.log(msg);
			// delete pass
			delete msg['pass'];
			drafts = msg.drafts;
			fs.writeFile('drafts.txt', JSON.stringify(drafts),  function(err) {
				if (err) {
					console.error("failed to write json");
				}
			});
			io.emit("draft", msg);
		}
	} else {
		console.error("invalid password");
		socket.emit("message", {'error':"invalid password"});
	};
	
  });
  socket.on('draft', function(msg) {
		if (msg.pass === secret.pass) {
			console.log(msg);
			// delete pass
			delete msg['pass'];
			drafts = msg.drafts;
			s.writeFile('drafts.txt', JSON.stringify(drafts),  function(err) {
				if (err) {
					console.error("failed to write json");
				}
			});
			
			io.emit("draft", msg);
		} else {
			console.error("invalid password");
			socket.emit("message", {'error':"invalid password"});
		}
	});
  
});

//archive
app.get('/archive', function(req, res) {
	res.set("Content-Type", "text/plain")
	res.send(JSON.stringify(messageArchive, null, '\t'));
});

app.get('/drafts', function(req, res) {
	res.set("Content-Type", "text/plain")
	res.send(JSON.stringify(drafts, null, '\t'));
});

http.listen(80, function(){
  console.log('listening on *:80');
});
