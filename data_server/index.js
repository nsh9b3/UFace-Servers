var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var ejs = require('ejs');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var request = require('request');
//var dns = require('dns');
var fs = require('fs');
var tcpp = require('tcp-ping');
var exec = require('child_process').exec;
var cmd;
var cmd_start = 'cd ./SMC && ';
var cmd_end = ' && cd ..';
var cmd_mid = '';

app.engine('html', ejs.renderFile);

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies

// List of services registered with UFace
// {Service : 
//            {Address   : a unique Url to communicate with the service,
//             Port      : the port number for this address,
//             Url       : the http address and port for this service,
//             Passwords : 
//                         {Index    : The index of a user
//                          Password : The password of this index}}}
var services = {};

var smcFiles = {};

// Where the services are stored on the server
var servicesLoc = path.join(__dirname, 'services');

// List of indicies being used to add new users
//{Mac :            The MAC address of the user being added (used to identify correct individuals)
//       {Index   : The index of this user (who is being added)
//        Service : The service this user is being added to}}
var add_indices = {};

// List of indices being used to authenticate registered users
//{Mac :            The MAC address of the user being authorized (used to identify correct individuals)
//       {Index   : The index of this user (who is being authorized)
//        Service : The service this user is being authorized to}}
var auth_indices = {};

// List of indicies used
// Contains just a list of integers 
var used_indices = [];

// List of indicies of deleted users
var unused_indices = [];

// Next index to be used
var current_max_index = 0;

// This is the address of this server
var localIP;

// This is web the address to reach this server (with port)
var address;

// Port of this server
var port = 3000;

localIP = '131.151.8.33';
address = 'http://' + localIP + ':' + port + '/';

// Get the address of this server
/* 
dns.lookup(require('os').hostname(), function (err, add, fam) {
	console.log(require('os').networkInterfaces());
	localIP = add;
	address = 'http://' + localIP + ':' + port + '/';
	console.log(localIP);
});*/

// Open the file containing each users information
fs.access(servicesLoc, fs.F_OK, function(err) {
	// File exists get the data
    if (!err) {
    	fs.readFile(servicesLoc, 'utf8', function (err, data) {
			if(data != '')
			{
				services = JSON.parse(data);
			}
		});
	// If it doesn't create the file
    } else {
        fs.open(servicesLoc, "wx", function (err, fd) {
		// handle error
			fs.close(fd, function (err) {
			    // handle error
			});
		});
    }
});

// Go to the home page of the Data Server
app.get('/', (req, res) => {
	res.render(path.join(__dirname, 'views', 'data_home.html'), {address : address});
});

// Get the list of registered services (names only)
app.get('/service_list', (req, res) => {
	// We only want to provide the names of the services so be sure to grab just that information
	var serviceNames = [];
	for(var service in services)
	{
		serviceNames.push({Name : service, Url : services[service].Url});
	}

	res.json(JSON.stringify({Services : serviceNames}));
});


// Show registered services and options to add a new one
app.get('/register_service', (req, res) => {
	// Response back
	var resp = {};
	resp.Result = false;
	resp.Message = '';

	res.render(path.join(__dirname, 'views', 'register_service.html'), {
		Services: services, 
		Response : resp, 
		Address : localIP, 
		Port : port});
});

// Update webpage with new information
// Called from a web page
app.post('/register_service', (req, res) => {
	// Get the sent json
	var json = req.body;

	// Response back to web service
	var resp = {};
	resp.Result = true;
	resp.Message = 'Service Registered!';

	var url = 'http://' + json.Address + ':' + json.Port + '/';

	// Make sure the name isn't already a registered service
	if(!(json.Name in services))
	{
		var addService = true;

		// Make sure the URL is not already used for another service
		for(var key in services)
		{
			if(services[key].Url == url)
			{
				resp.Result = false;
				resp.Message = 'Url (' + url + ') is already being used by another service!';
				addService = false;
			}
		}

		// Check if the provided URL is a real URL
		tcpp.probe(json.Address, json.Port, function(err, available) 
		{
			if(!available)
			{
				resp.Result = false;
				resp.Message = 'Could not verify the web site URL: ' + url + '!';
				addService = false;
			}
			// If the service is valid, add it to the list of services
			if(addService)
			{
				// Add this information to the list of services
				// Attach it's address and an empty passwords list
				services[json.Name] = {};
				services[json.Name].Url = 'http://' + json.Address + ':' + json.Port + '/';
				services[json.Name].Address = json.Address;
				services[json.Name].Port = json.Port;
				services[json.Name].Passwords = {};

				fs.writeFile(servicesLoc, '', function (err) {

				});
				fs.writeFile(servicesLoc, JSON.stringify(services), function (err) {

				});
			}

			res.render(path.join(__dirname, 'views', 'register_service.html'), 
				{Services : services, 
				 Response : resp, 
				 Address : localIP,
				 Port : port});
		});
	}
	// This service already registered with
	else
	{	
		resp.Result = false;
		resp.Message = 'Service already registered with!';

		res.render(path.join(__dirname, 'views', 'register_service.html'), 
			{Services : services, 
			 Response : resp, 
			 Address : localIP,
			 Port : port});
	}
});

// Show passwords
app.get('/passwords', (req, res) => {
	res.render(path.join(__dirname, 'views', 'passwords.html'), {Services : services});
});

// Get ready to add a new password to the database
// Service -> Data Server
app.post('/add_user', (req, res) => {
	// Get the sent json
	var json = req.body;

	// Response back to web service
	var resp = {};
	resp.Result = true;
	resp.Message = '';
	resp.Index = -1;

	// Used to check if the service is even a registered service
	if(!(json.Service in services))
	{
		resp.Result = false;
		resp.Message = 'Provided service does not exist.';
	}
	else
	{
		// This is the unique index for the new user
		var addedIndex;

		// This is used to make sure we aren't waiting a response from an IP with this Index currently
		// This can occur because if multiple users register at the same time, the same index might be assigned multiple times
		var awaitingIndex = false;

		// Create a unique Index for the user
		if(unused_indices.length != 0)
			added_index = unused_indices.pop();
		else
			addedIndex = current_max_index++;

		// Add this index to the service information letting them know we are waiting on a password now
		add_indices[addedIndex] = json.Service;

		// Add this index to the used indices list
		used_indices.push(addedIndex);

		// Respond with the created index
		resp.Index = addedIndex;
	}

	// Send to the web service the Index for this new user
	res.json(JSON.stringify(resp));
});

// TODO: call this when things fail
app.post('/delete_user', (req, res) => {
	var json = req.body;

	// Response back to web service
	var resp = {};
	resp.Result = true;
	resp.Message = 'Deleted user.';

	if(!(json.Service in services))
	{
		resp.Result = false;
		resp.Message = 'Service does not exist!';
	}
	else
	{
		if(!(json.Index in services[json.Service].Passwords))
		{
			resp.Result = false;
			resp.Message = 'User not in the system.';
		}
		else
		{
			delete services[json.Service].Passwords[json.Index];
		}
	}

	res.json(JSON.stringify(resp));
});

// Add password to database
// This is called from the client (Android device)
app.post('/add_password', (req, res) => {
	// Response back to web service
	var resp = {};
	resp.Result = true;
	resp.Message = 'Wait for a response from the web service before continuing.';

	// Get the sent json
	var json = req.body;

	// Make sure the client knows which service he/she is registering with
	if(json.Service in services)
	{
		// If we are waiting a response from this ip address, then that means this device is needing to be registered with
		// Also make sure the service it's registering with is the same service we are waiting on
		if(add_indices[json.Index] == json.Service)
		{
			// Add the password to the Index pointed to by the IP address
			services[json.Service].Passwords[json.Index] = {};
			services[json.Service].Passwords[json.Index].Password = json.Password;
			services[json.Service].Passwords[json.Index].Size = json.Size;

			fs.writeFile(servicesLoc, '', function (err) {

			});
			fs.writeFile(servicesLoc, JSON.stringify(services), function (err) {

			});

			// Send the registration information to the service
			request.post({url: services[json.Service].Url + 'add_user/result', 
				form : {Response : resp, Index : json.Index}}, 
				function (error, response, body) {
			});

			// And remove the fact that we are looking for this ip address anymore
			delete add_indices[json.Index];
		} 
		else
		{
			resp.Result = false;
			resp.Message = "Can't recognize this index or trying to register with a different service."
		}
	}
	else
	{
		resp.Result = false;
		resp.Message = "This service does not exists!"
	}

	// Respond to the client
	res.json(JSON.stringify(resp));
});

// This happens from a web service
app.post('/authenticate_user', (req, res) => {
	// Get the sent json
	var json = req.body;

	// Response back to web service
	var resp = {};
	resp.Result = true;
	resp.Message = '';

	// Make sure the service is an actual service
	if(!(json.Service in services))
	{
		resp.Result = false;
		resp.Message = 'Provided service does not exist.';
	}
	else
	{
		// Make sure the user isn't trying to authenticate with any services already
		if(!(json.Index in auth_indices))
		{
			// Set the authentication 
			auth_indices[json.Index] = {};
			auth_indices[json.Index].Service = json.Service;
			auth_indices[json.Index].Attempt = json.Attempt;
		}
		else
		{
			resp.Result = false;
			resp.Message = 'Already waiting on this ip address.';
		}
	}

	// Send to the web service the Index for this new user
	res.json(JSON.stringify(resp));
});

// Called from the android client
app.post('/authenticate_password', (req, res) => {
	// Get the sent json
	var json = req.body;

	// Response back to the client AND web service
	var resp = {};
	resp.Result = true;
	resp.Message = 'The provided password is not similar for this user.';

	// Make sure the client knows which service he/she is authenticating with
	if(json.Service in services)
	{
		// Make sure we are actually expecting an authentication attempt from this ip
		// And the service it is authenticating with is expecting an athentication attempt
		if(auth_indices[json.Index].Service == json.Service)
		{
			var testSize = json.Size;
			var origSize = services[json.Service].Passwords[json.Index].Size;

			if(testSize == origSize)
			{				
				var testPassword = json.Password;
				var origPassword = services[json.Service].Passwords[json.Index].Password;

				var testFile = json.Index + '-' + auth_indices[json.Index].Attempt + '-test.txt';
				var origFile = json.Index + '-' + auth_indices[json.Index].Attempt + '-orig.txt';

				smcFiles[json.Index] = {};
				smcFiles[json.Index].Test = testFile;
				smcFiles[json.Index].Orig = origFile;
				smcFiles[json.Index].Size = json.Size;

				// write the test file
				fs.writeFile(testFile, '', function (err) {

				});
				fs.writeFile(testFile, testPassword, function (err) {

				});
				// write the original file
				fs.writeFile(origFile, '', function (err) {

				});
				fs.writeFile(origFile, origPassword, function (err) {

				});

				var dir = json.Index + '-' + auth_indices[json.Index].Attempt;
				cmd_mid = '../' + smcFiles[json.Index].Test + ' ../' + smcFiles[json.Index].Orig + ' ' + smcFiles[json.Index].Size + ' ./saved-results/' + dir;

				var cmd = cmd_start + 'mkdir ./saved-results/' + dir + 
									  ' && mkdir ./saved-results/' + dir + '_1' +
									  ' && mkdir ./saved-results/' + dir + '_2' +
							     ' && ./driver ' + cmd_mid + '_1 && ./driver ' + cmd_mid + '_2 && ./driver ' + cmd_mid + cmd_end;

				console.log(cmd);
				exec(cmd, function(error, stdout, stderr) {
					delete smcFiles[json.Index];

					console.log(stdout);

					if(stdout.indexOf('Pass') > -1)
					{
						resp.Result = true;
						resp.Message = 'The password is valid.';
						resp.Index = json.Index;
					}
					else
					{
						resp.Result = false;
						resp.Message = 'The password is invalid.';
						resp.Index = json.Index;
					}

					delete auth_indices[json.Index];

					// Tell the web service the result
					request.post({url: services[json.Service].Url + 'authentication_result', 
						form : {Response : resp}}, 
						function (error, response, body) {

					});
				});
				res.json(JSON.stringify(resp));
				return;
			} 
			else
			{
				resp.Result = false;
				resp.Message = 'The sizes do not match.';
				resp.Index = json.Index;

				// Tell the web service the result
				request.post({url: services[json.Service].Url + 'authentication_result', 
					form : {Response : resp}}, 
					function (error, response, body) {

				});
				res.json(JSON.stringify(resp));
				return;
			}
		}
		else
		{
			resp.Result = false;
			resp.Message = "Can't recognize this IP address or trying to authenticate with a different service."

			// Tell the web service the result
			request.post({url: services[json.Service].Url + 'authentication_result', 
				form : {Response : resp}}, 
				function (error, response, body) {

			});

			res.json(JSON.stringify(resp));
			return;
		}
	}

});

app.listen(port);
