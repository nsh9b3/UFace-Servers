var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var ejs = require('ejs');
var request = require('request');
//var dns = require('dns');
var fs = require('fs');

// Using ejs to render html files 
app.engine('html', ejs.renderFile);

// Passing around json and urlencoded information so use it
app.use(bodyParser.json());       
app.use(bodyParser.urlencoded({ extended: true })); 

// List of users in database:
// Layout of database ---------->
//
// {User : 
//         {Index      : a_unique_number_generated_by_data_server,
//          Time       : used_during_authentication_and_registration,
//          Info       : secure information (not dealt with here)
//			Mac        : mac address for this unique user
//          Registered : user_is_or_is_not_registered
//          Process    : this states whether the user is registering, authenticating, or nothing}}
var users = {};

// Where the services are stored on the server
var usersLoc = path.join(__dirname, 'users');

// Name of service
var serviceName = 'Blank';

// Read the user list and populate the information properly (if data exists)
fs.access(usersLoc, fs.F_OK, function(err) {
	// File exists get the data
    if (!err) {
    	fs.readFile(usersLoc, 'utf8', function (err, data) {
    		// If the file isn't empty
			if(data != '')
			{
				// Update the user information (includes user information)
				users = JSON.parse(data);
			}
		});
	// If it doesn't create the file
    } else {
        fs.open(usersLoc, "wx", function (err, fd) {
			// handle error
			fs.close(fd, function (err) {
			    // handle error
			});
		});
    }
});

var localIP = '131.151.8.33';
var dataServerIP = 'http://' + localIP + ':3000/';
var port = 3001;
var address = 'http://' + localIP + ':' + port + '/';

// Get the ip address of this server
/*
dns.lookup(require('os').hostname(), function (err, add, fam) {
  localIP = add;
  dataServerIP = 'http://' + localIP + ':3000/';
})*/

// Show the users on the homepage of the server
// Currently just shows a list of users IDs and their corresponding index
app.get('/', (req, res) => {
	res.render(path.join(__dirname, 'views', 'blank_home.html'), {users : users});
});

// Called on by the client (Android device)
// This is called when a user wishes to use this service with a specific user ID
app.post('/add_user', (req, res) => {
	// Get the json information from the client
	// This includes: User
	//                Service
	var json = req.body;

	// This message is passed back to the client letting him/her know whether he/she was added
	var resp = {};
	resp.Result = true;
	resp.Message = 'You were successfully added!';

	// If the provided service name does not match this service, tell the user the service is incorrect
	if(json.Service != serviceName)
	{
		resp.Result = false;
		resp.Message = 'Provided service - ' + json.Service + ' - Does not match this serivce - ' + serviceName + '!';

		// Respond to Client
		res.json(JSON.stringify(resp));
		return;
	}
	// If the user ID provided is already taken, tell the user to try a different user name
	else if(json.User in users)
	{
		resp.Result = false;
		resp.Message = 'User ID already taken!';

		// Respond to Client
		res.json(JSON.stringify(resp));
		return;
	}
	else
	{
		// Tell the data server that a user will be adding a password soon from a spcific IP address for a new user
		// This will fail if it takes too long
		request.post({url: dataServerIP + 'add_user/', 
			form : {Service : json.Service}}, 
			function (error, response, body) {
				// Get the json response from the data server
				var jsonResp = JSON.parse(JSON.parse(body));

				// Get the generated index for this user
				var index = jsonResp.Index;

				// If the user was added to the data server
				if(jsonResp.Result)
				{
					users[json.User] = {};
					users[json.User].Index = index;
					users[json.User].Time = Math.floor(Date.now() / 1000);
					users[json.User].Registered = false;
					users[json.User].Process = 'Add';
					resp.Result = true;
					resp.Message = 'Data Server is awaiting the registration password!';
					resp.Index = index;

					fs.writeFile(usersLoc, '', function (err) {

					});
					fs.writeFile(usersLoc, JSON.stringify(users), function (err) {

					});

					// TODO: start a timer that last a minute for registration or else the user is deleted
					setTimeout(function() {
						if(!users[json.User].Registered)
						{
							delete users[json.User];
							fs.writeFile(usersLoc, '', function (err) {

							});
							fs.writeFile(usersLoc, JSON.stringify(users), function (err) {

							});
							request.post({url: dataServerIP + 'delete_user/', 
								form : {Service : json.Service, Index : index}},
								function(error, response, body) {

								});
						}
					}, 60000);
				}
				else
				{
					resp.Result = jsonResp.Result;
					resp.Message = jsonResp.Message;
				}

				// Respond to Client
				res.json(JSON.stringify(resp));
				return;
		});
	}
});

// This is called from the Data Server
app.post('/add_user/result', (req, res) => {
	// Get the current time to see if registration is valid
	var time = Math.floor(Date.now() / 1000);

	// Get the json information from the data server
	var json = req.body.Response;
	var index = req.body.Index;
	var result = json.Result;
	var message = json.Message;

	// This message is send back to the server letting it know if the authentication result was valid
	var resp = {};
	resp.Result = true;
	resp.Message = '';

	// If the result obtained is good
	if(result)
	{
		// Determine which user we are looking at
		for(var user in users)
		{
			// If the indices are the same, then this is the same user
			if(users[user].Index == index)
			{
				// Make sure the user is expected to register
				if(!(users[user].Registered))
				{
					// If the time is less than a minute
					if((time - users[user].Time) < 60)
					{
						//Then the user is successfully added to the data server and registered with this service
						delete users[user].Time;
						users[user].Registered = true;
						users[user].Process = 'Wait';
						users[user].Attempt = 0;

						fs.writeFile(usersLoc, '', function (err) {

						});
						fs.writeFile(usersLoc, JSON.stringify(users), function (err) {

						});
					}
					else
					{
						// Took too long to register the user, so try again
						// this probably won't ever occur here
						resp.Result = false;
						resp.Message = 'Took too long to register. Try registering again.';
						delete users[user].Time;
						users[user].Registered = false;
						user[user].Message = 'Took too long to register. Try registering again.';
						delete users[user];

						// Make sure the data server deletes the users information
						request.post({url: dataServerIP + 'delete_user/', 
							form : {Service : json.Service, Index : index}},
							function(error, response, body) {

							});

						fs.writeFile(usersLoc, '', function (err) {

						});
						fs.writeFile(usersLoc, JSON.stringify(users), function (err) {

						});
					}
				}
				else
				{
					// User is already registered in the system
					resp.Result = false;
					users[user].Registered = false;
					users[user].Message = 'User already registered.';
					resp.Message = 'User already registered.';
				}

				break;
			}
		}
	}
	else
	{
		// Determine which user we are looking at
		for(var user in users)
		{
			// If the indices are the same, then this is the same user
			if(users[user].Index == index)
			{
				resp.Result = false;
				users[user].Registered = false;
				users[user].Process = 'Wait';
				users[user].Message = 'Registration failed on the data server... try again.';
				resp.Message = 'Registration failed on the data server... try again.';
				delete users[user];

				// Make sure the data server deletes the users information
				request.post({url: dataServerIP + 'delete_user/', 
					form : {Service : json.Service, Index : index}},
					function(error, response, body) {

					});

				fs.writeFile(usersLoc, '', function (err) {

				});
				fs.writeFile(usersLoc, JSON.stringify(users), function (err) {

				});
			}
			break;
		}
	}

	res.json(JSON.stringify(resp));
});

// This is called by the android device 
// It will respond as soon as it gets a result from the data server
// TODO: FIX THIS
app.post('/add_user_result_client', (req, res) => {
	var json = req.body;

	// Response to the android device about whether the adding of the user has been successful
	var resp = {};
	resp.Result = false;
	resp.Message = '';
	resp.Continue = false;

	// Make sure the provided ID is a valid user
	// TODO: this messes up pretty bad if there is an error...
	if(json.User in users)
	{
		if(users[json.User].Process != 'Wait')
		{
			resp.Result = false;
			resp.Continue = true;
			res.json(JSON.stringify(resp));
		}
		else
		{
			// THIS is where I need to put stuff and respond to the Android device
			if(users[json.User].Registered == true)
			{
				resp.Result = true;
				resp.Message = 'User is registered!';
				res.json(JSON.stringify(resp));
			}
			else
			{
				// TODO: something
				resp.Result = false;
				resp.Message = 'User failed to be registered!';
				res.json(JSON.stringify(resp));
			}
		}
	}
});



// This lets the web service know that an authentication attempt is about to being for a specific user/password
// This is called from the Android client
app.post('/authenticate_user', (req, res) => {
	// Get the sent json
	var json = req.body;

	// This message is passed back to the client letting him/her know whether he/she can begin authentication with the data server
	var resp = {};
	resp.Result = true;
	resp.Message = '';

	// If the user is not a member of this service, then it fails
	if(!(json.User in users))
	{
		resp.Result = false;
		resp.Message = 'User is not part of this service.';
		res.json(JSON.stringify(resp));
		return;
	}
	else if(json.Service != serviceName)
	{
		resp.Result = false;
		resp.Message = 'Trying to authenticate for a different service.';
		res.json(JSON.stringify(resp));
		return;
	}
	// Otherwise tell the data server that a new authentication attempt is about to begin
	else
	{
		// If the user doesn't have a password registered, it fails.
		if(!(users[json.User].Registered))
		{
			resp.Result = false;
			resp.Message = 'User does not have a password registered.';
			res.json(JSON.stringify(resp));
			return;
		}
		else
		{
			// Make sure the user is not already being authenticated
			if(!('Time' in users[json.User]))
			{
				request.post({url: dataServerIP + 'authenticate_user/', 
					form : {Index   : users[json.User].Index, 
					    	Service : serviceName,
					   		Attempt : users[json.User].Attempt++}}, 
					function (error, response, body) {
						// Get the response from the data server
						reqRes = JSON.parse(JSON.parse(body));

						// If the data server sent the okay  for registration
						if(reqRes.Result == true)
						{
							// Begin a timer for this user to authenticate
							users[json.User].Time = Math.floor(Date.now() / 1000);
							users[json.User].Process = 'Authenticate';

							fs.writeFile(usersLoc, '', function (err) {

							});
							fs.writeFile(usersLoc, JSON.stringify(users), function (err) {

							});

							resp.Result = true;
							resp.Message = 'Authentication may begin.';
							res.json(JSON.stringify(resp));
							return;
						}
						else
						{
							resp.Result = false;
							resp.Message = reqRes.Message;
							res.json(JSON.stringify(resp));
							return;
						}
						
				});
			}
		}
	}
});

// This lets the web service know the result of the authentication attempt
// This is called on from the data server
app.post('/authentication_result', (req, res) => {
	// Get the sent json and the variables in this json
	var json = req.body.Response;
	var index = json.Index;
	var result = json.Result;
	var message = json.Message;

	var resp = {};
	resp.Result = result;
	resp.message = message;

	// Still need to figure out the user
	var user = '';

	// Get the current time
	var time = Math.floor(Date.now() / 1000);

	for(var key in users)
	{
		if(users[key].Index == index)
		{
			user = key;
			break;
		}
	}

	// Get the start time for this user
	var startTime = users[user].Time;

	// Delete Time attribute since it's not being used anymore
	delete users[user].Time;

	// If the result was a match and the time was acceptable, then it's a match
	if(result == 'true')
	{
		if(time - startTime < 60)
		{
			users[user].AuthResult = true;
		}
		else
		{
			users[user].AuthResult = false;
		}
			users[user].Process = 'Wait';

			fs.writeFile(usersLoc, '', function (err) {

			});
			fs.writeFile(usersLoc, JSON.stringify(users), function (err) {

			});
	}
	else
	{
		users[user].AuthResult = false;
		users[user].Process = 'Wait';

		fs.writeFile(usersLoc, '', function (err) {

		});
		fs.writeFile(usersLoc, JSON.stringify(users), function (err) {

		});
	}

	res.json(JSON.stringify(resp));
});

app.post('/authentication_result_client', (req, res) => {
	var json = req.body;

	// Response to the android device about whether the adding of the user has been successful
	var resp = {};
	resp.Result = false;
	resp.Message = '';
	resp.Continue = false;

	// Make sure the provided ID is a valid user
	if(json.User in users)
	{
		if(users[json.User].Process != 'Wait')
		{
			resp.Result = false;
			resp.Continue = true;
			res.json(JSON.stringify(resp));
		}
		else
		{
			// THIS is where I need to put stuff and respond to the Android device
			if(users[json.User].AuthResult == true)
			{
				resp.Result = true;
				resp.Continue = false;
				resp.Message = 'User is Authenticated!';
				delete users[json.User].AuthResult;

				fs.writeFile(usersLoc, '', function (err) {

				});
				fs.writeFile(usersLoc, JSON.stringify(users), function (err) {

				});
				res.json(JSON.stringify(resp));
			}
			else
			{
				resp.Result = false;
				resp.Continue = false;
				resp.Message = 'User authentication failed!';
				delete users[json.User].AuthResult;
				fs.writeFile(usersLoc, '', function (err) {

				});
				fs.writeFile(usersLoc, JSON.stringify(users), function (err) {

				});
				res.json(JSON.stringify(resp));
			}
		}
	}
});

app.listen(port);
