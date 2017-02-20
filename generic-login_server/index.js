var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var ejs = require('ejs');
var fs = require('fs');
var dns = require('dns');
var app = express();

app.engine('html', ejs.renderFile);

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies

// Passwords for this service
var passwords = { 'Bank': {},
				  'Health': {},
				  'School': {},
				  'Insurance': {},
				  'Tax': {},
				  'Food': {},
				  'Phone': {},
				  'Magazine': {},
				  'Music': {},
				  'House': {} };

// Port of these 'servers'
var port = '3100';

// This is the address of this server
var localIP = '131.151.8.33';

// This is web the address to reach this server (with port)
var address = 'http://' + localIP + ':' + port + '/';

// Where the passwords are stored on the server
var passwordLoc = path.join(__dirname, 'passwords');

// Read the passwordLoc list and populate the information properly (if data exists)
fs.access(passwordLoc, fs.F_OK, function(err) {
	// File exists get the data
    if (!err) {
    	fs.readFile(passwordLoc, 'utf8', function (err, data) {
    		// If the file isn't empty
			if(data != '')
			{
				// Update the services information (includes user information)
				passwords = JSON.parse(data);
			}
		});
	// If it doesn't create the file
    } else {
        fs.open(passwordLoc, "wx", function (err, fd) {
			// handle error
			fs.close(fd, function (err) {
			    // handle error
			});
		});
		// Use the names listed above
		fs.writeFile(passwordLoc, '', function (err) {

		});
		fs.writeFile(passwordLoc, JSON.stringify(passwords), function (err) {

		});
    }
});

app.get('/', (req, res) => {
	res.render(path.join(__dirname, 'views', 'home.html'), {Passwords : Object.keys(passwords), Address : address, Users : Object.keys(passwords['Bank'])});
});

app.get('/Bank/', (req, res) => {
	res.render(path.join(__dirname, 'views', 'generic.html'), {Service : 'Bank', Users : passwords['Bank'], Address : address});
});
app.get('/Health/', (req, res) => {
	res.render(path.join(__dirname, 'views', 'generic.html'), {Service : 'Health', Users : passwords['Health'], Address : address});
});
app.get('/School/', (req, res) => {
	res.render(path.join(__dirname, 'views', 'generic.html'), {Service : 'School', Users : passwords['School'], Address : address});
});
app.get('/Insurance/', (req, res) => {
	res.render(path.join(__dirname, 'views', 'generic.html'), {Service : 'Insurance', Users : passwords['Insurance'], Address : address});
});
app.get('/Tax/', (req, res) => {
	res.render(path.join(__dirname, 'views', 'generic.html'), {Service : 'Tax', Users : passwords['Tax'], Address : address});
});
app.get('/Food/', (req, res) => {
	res.render(path.join(__dirname, 'views', 'generic.html'), {Service : 'Food', Users : passwords['Food'], Address : address});
});
app.get('/Phone/', (req, res) => {
	res.render(path.join(__dirname, 'views', 'generic.html'), {Service : 'Phone', Users : passwords['Phone'], Address : address});
});
app.get('/Magazine/', (req, res) => {
	res.render(path.join(__dirname, 'views', 'generic.html'), {Service : 'Magazine', Users : passwords['Magazine'], Address : address});
});
app.get('/Music/', (req, res) => {
	res.render(path.join(__dirname, 'views', 'generic.html'), {Service : 'Music', Users : passwords['Music'], Address : address});
});
app.get('/House/', (req, res) => {
	res.render(path.join(__dirname, 'views', 'generic.html'), {Service : 'House', Users : passwords['House'], Address : address});
});

app.get('/Register/', (req, res) => {
	res.render(path.join(__dirname, 'views', 'register.html'), {Users : Object.keys(passwords['Bank']), Address : address});
});

app.post('/Register/', (req, res) => {
	var json = req.body;
	var name = json['Name'];
	var age = json['Age'];
	var job = json['Occupation'];
	var gender = json['Gender'];
	var degree = json['Degree'];

	for(var index in passwords)
	{
		passwords[index][name] = {};
		passwords[index][name]['Password'] = '';
		passwords[index][name]['Failed'] = 0;
		passwords[index][name]['Forgot'] = 0;
		passwords[index][name]['Valid'] = 0;
		passwords[index][name]['Attempt'] = [];
		passwords[index][name]['Time'] = [];
	}

	// Use the names listed above
	fs.writeFile(passwordLoc, '', function (err) {

	});
	fs.writeFile(passwordLoc, JSON.stringify(passwords), function (err) {

	});

	res.render(path.join(__dirname, 'views', 'register.html'), {Users : Object.keys(passwords['Bank']), Address : address});
});

app.get('/Login/*', (req, res) => {
	var service = req.url.split('/Login/')[1].split('.')[0];
	var user = req.url.split('/Login/')[1].split('.')[1];
	var isRegistered = (passwords[service][user]['Password'] == '' ? false : true);
	var previous = [];

	var result = {};
	result.Task = 'None';
	result.Valid = false;

	for(var key in passwords)
	{
		previous.push(passwords[key][user]['Password']);
	}

	res.render(path.join(__dirname, 'views', 'login.html'), {Service : service, User : user, Result : result, Registered : isRegistered, Previous : previous, Address : address});
});

app.post('/Login/*', (req, res) => {
	var pass = req.body.Password;
	var task = req.body.Task;

	var service = req.url.split('/Login/')[1].split('.')[0];
	var user = req.url.split('/Login/')[1].split('.')[1];

	var result = {};
	result.Task = task;
	result.Valid = false;

	if(task == 'Register')
	{
		passwords[service][user]['Password'] = pass;
		fs.writeFile(passwordLoc, '', function (err) {

		});
		fs.writeFile(passwordLoc, JSON.stringify(passwords), function (err) {

		});
	}
	else if(task == 'Login')
	{
		if(passwords[service][user]['Password'] == pass)
		{
			result.Valid = true;
			passwords[service][user]['Valid'] = passwords[service][user]['Valid'] + 1;
			passwords[service][user]['Attempt'].push('Valid');
			passwords[service][user]['Time'].push(req.body.Time);
			fs.writeFile(passwordLoc, '', function (err) {

			});
			fs.writeFile(passwordLoc, JSON.stringify(passwords), function (err) {

			});
		}
		else
		{
			passwords[service][user]['Failed'] = passwords[service][user]['Failed'] + 1;
			passwords[service][user]['Attempt'].push('Failed');
			passwords[service][user]['Time'].push(req.body.Time);
			fs.writeFile(passwordLoc, '', function (err) {

			});
			fs.writeFile(passwordLoc, JSON.stringify(passwords), function (err) {

			});
		}
	}
	else if(task == 'Forgot')
	{
		passwords[service][user]['Password'] = pass;
		passwords[service][user]['Forgot'] = passwords[service][user]['Forgot'] + 1;
		passwords[service][user]['Attempt'].push('Forgot');
		passwords[service][user]['Time'].push(req.body.Time);
		fs.writeFile(passwordLoc, '', function (err) {

		});
		fs.writeFile(passwordLoc, JSON.stringify(passwords), function (err) {

		});
	}


	var isRegistered = (passwords[service][user]['Password'] == '' ? false : true);
	var previous = [];
	for(var key in passwords)
	{
		previous.push(passwords[key][user]['Password']);
	}

	res.render(path.join(__dirname, 'views', 'login.html'), {Service : service, User : user, Result : result, Registered : isRegistered, Previous : previous, Address : address});
});

app.listen(port);