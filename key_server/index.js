var path = require('path');
var express = require('express');
var app = express();
var ejs = require('ejs');
var fs = require('fs');
//var dns = require('dns');

var publicKeyLoc = path.join(__dirname, 'public_key');
var publicKey = {};

app.engine('html', ejs.renderFile);

var port = 3002;

/*
dns.lookup(require('os').hostname(), function (err, add, fam) {
  localIP = add;
})*/

app.get('/public_key', (req, res) => {
	fs.readFile(publicKeyLoc, 'utf8', (err, data) => {
		var splitData = data.split(' ');
		res.json(JSON.stringify({ Public : 
			{n : splitData[0], 
			 g : splitData[1],
			 size : splitData[2]}}));
	});
});

app.listen(port);
