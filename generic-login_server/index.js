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
var passwords = {};

// Name and port of this service (change this)
var name = 'Generic';
var port = '3100';

// Where this server is stored
var address = '';

// Where the services are stored on the server
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
    }
});

dns.lookup(require('os').hostname(), function (err, add, fam) {
	var localIP = add;
	address = 'http://' + localIP + ':' + port + "/";
});

app.get('/', (req, res) => {
	res.render(path.join(__dirname, 'views', 'home.html'), {Passwords : passwords, Name : name, Address : address});
});

app.get('/register/', (req, res) => {
	var valid = {};
	valid.Result = false;
	valid.Messages = [];

	res.render(path.join(__dirname, 'views', 'register.html'), {Valid : valid, Address : address});
});

app.post('/register/', (req, res) => {
	// Get the sent information
	var urlencoded = req.body;

	var valid = {};
	valid.Result = true;
	valid.Messages = [];

	if(urlencoded.Name.length < 8)
	{
		valid.Result = false;
		valid.Messages.push('Please pick a user ID that is at least 8 characters long!\n');
	}
	if(/[^a-zA-Z0-9]/.test(urlencoded.Name))
	{
		valid.Result = false;
		valid.Messages.push('User ID contains invalid characters. Only use alphanumeric characters!\n');
	}
	if(urlencoded.Name in passwords)
	{
		valid.Result = false;
		valid.Messages.push('User ID is already being used. Please pick a different user ID!\n');
	}
	if(urlencoded.Password.length < 8)
	{
		valid.Result = false;
		valid.Messages.push('Please pick a password that is at least 8 characters long!\n');
	}
	if(urlencoded.Confirm != urlencoded.Password)
	{
		valid.Result = false;
		valid.Messages.push('Passwords do not match!\n');
	}

	if(valid.Result == true)
	{
		passwords[urlencoded.Name] = {};
		passwords[urlencoded.Name].Password = urlencoded.Password;
		passwords[urlencoded.Name].Success = 0;
		passwords[urlencoded.Name].Failed = 0;
		passwords[urlencoded.Name].Forgot = 0;

		fs.writeFile(passwordLoc, '', function (err) {

		});
		fs.writeFile(passwordLoc, JSON.stringify(passwords), function (err) {

		});
	}

	res.render(path.join(__dirname, 'views', 'register.html'), {Valid : valid,  Address : address});
});

app.get('/login/', (req, res) => {
	var valid = {};
	valid.Result = false;
	valid.Messages = [];

	res.render(path.join(__dirname, 'views', 'login.html'), {Valid : valid, Address : address});
});

app.post('/login/', (req, res) => {
	var urlencoded = req.body;


	var valid = {};
	valid.Result = true;
	valid.Messages = [];

	console.log(urlencoded);

	if(urlencoded.Task == 'Login')
	{
		if(!(urlencoded.Name in passwords))
		{
			valid.Result = false;
			valid.Messages.push('User ID does not exist!');
		}
		else
		{
			if(urlencoded.Password != passwords[urlencoded.Name].Password)
			{
				valid.Result = false;
				valid.Messages.push('Password is incorrect');

				passwords[urlencoded.Name].Failed = passwords[urlencoded.Name].Failed + 1;
			}
			else
			{
				passwords[urlencoded.Name].Success = passwords[urlencoded.Name].Success + 1;
			}

			fs.writeFile(passwordLoc, '', function (err) {

			});
			fs.writeFile(passwordLoc, JSON.stringify(passwords), function (err) {

			});
		}
	} else if (urlencoded.Task == 'Forgot')
	{
		if(!(urlencoded.Name in passwords))
		{
			valid.Result = false;
			valid.Messages.push('User ID does not exist!');
		}
		else
		{
			valid.Result = false;
			valid.Messages.push('Your password is: "' + passwords[urlencoded.Name].Password + '"');
			passwords[urlencoded.Name].Forgot = passwords[urlencoded.Name].Forgot + 1;

			fs.writeFile(passwordLoc, '', function (err) {

			});
			fs.writeFile(passwordLoc, JSON.stringify(passwords), function (err) {

			});
		}
	}


	res.render(path.join(__dirname, 'views', 'login.html'), {Valid : valid, Address : address});
});

app.listen(port);