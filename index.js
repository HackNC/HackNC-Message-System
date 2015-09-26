var app = require('express')();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var secret = require('./secret.json');
var googleKey = secret.googleKey;
var gcm = require('node-gcm');
var sender = new gcm.Sender(googleKey);
var fs = require("fs");

var regIDs = JSON.parse(fs.readFileSync('regids.txt'));

var messageArchive = JSON.parse(fs.readFileSync('archive.txt'));

//files and stuff
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, './', 'index.html'));
});

app.get('/js/index.js', function(req, res){
  res.sendFile(path.join(__dirname, './js', 'index.js'));
});

app.get('/secret', function(req, res){
  res.sendFile(path.join(__dirname, './secret', 'index.html'));
});

app.get('/js/secret.js', function(req, res){
  res.sendFile(path.join(__dirname, './secret', 'js', 'secret.js'));
});

app.get('/js/messagePost.js', function(req, res){
  res.sendFile(path.join(__dirname, './secret', 'js', 'messagePost.js'));
});

app.get('/js/arrive.js', function(req, res){
  res.sendFile(path.join(__dirname, './secret', 'js', 'messagePost.js'));
});

app.get('/reg', function(req, res) {
	res.set("Content-Type", "text/plain")
	res.send('id: ' + req.query.id);
	regIDs[req.query.id] = true;
	fs.writeFile('regids.txt', JSON.stringify(regIDs),  function(err) {
		if (err) {
			console.error("failed to write json");
		}
	});

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
	if (msg.pass===secret.pass) {
		// delete pass
		delete msg['pass'];
		io.emit("message", msg);
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
		sender.send(notificate, Object.keys(regIDs), 5, function(err, result) {
			if (err) { console.error("send error", err);return;}
			console.log("send result", result);
		});
		messageArchive.push(msg);
		fs.writeFile('archive.txt', JSON.stringify(messageArchive),  function(err) {
			if (err) {
				console.error("failed to write json");
			}
		});
	} else {
		console.error("invalid password");
		socket.emit("message", {'error':"invalid password"});
	};
	
  });
});

//archive
app.get('/archive', function(req, res) {
	res.set("Content-Type", "text/plain")
	res.send(JSON.stringify(messageArchive, null, '\t'));
});

http.listen(9001, function(){
  console.log('listening on *:80');
});
