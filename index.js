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

app.get('/mespeak.js', function(req, res){
  res.sendFile(path.join(__dirname, './mespeak', 'mespeak.js'));
});

app.get('/mespeak_config.json', function(req, res){
  res.sendFile(path.join(__dirname, './mespeak', 'mespeak_config.json'));
});

app.get('/en-us.json', function(req, res){
  res.sendFile(path.join(__dirname, './mespeak/voices/en', 'en-us.json'));
});

app.get('/s.ogg', function(req, res){
  res.sendFile(path.join(__dirname, './', 's.ogg'));
});

app.get('/green.png', function(req, res){
  res.sendFile(path.join(__dirname, './', 'green.png'));
});

app.get('/jquery.textfill.min.js', function(req, res){
  res.sendFile(path.join(__dirname, './', 'jquery.textfill.min.js'));
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

//socket.io stuff
io.on('connection', function(socket){
  socket.on('message', function(msg){
	console.log("message:", msg);
	if (msg.pass===secret.pass) {
		io.emit("message", msg.msg);
		notificate = new gcm.Message({
			data: {
				key1: 'message1'
			},
			notification: {
				title: msg.subject,
				body: msg.msg
			}
		});
		sender.send(notificate, Object.keys(regIDs), 5, function(err, result) {
			if (err) { console.error("send error", err);return;}
			console.log("send result", result);
		});
		msg.pass="";
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
