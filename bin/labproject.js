/*
 * 
 * This is main LabProject file. This is what is run on the server and manages all incoming requests.
 * 
 * This file should be kept as clean and as small as possible
 * 
 */ 
 
// Set the library directory for other classes
var LIB_DIR = './lib/';

// Include startup routine
var startup = require(LIB_DIR + 'startup');

// Include for server logging
var server_logging = require(LIB_DIR + 'server-log');

// Do startup stuff
startup.start(__dirname + '/../conf/labproject-head.conf',function(CONF_DATA,DB){

	// Start including for server operation
	
	// Include express (http://expressjs.com)
	var express = require('express');
	var app = express();
	var server = require('http').createServer(app);
	
	// Include socket.io, used for websockets (http://socket.io)
	var io = require('socket.io').listen(server);

	// Setup node_session (made by me, Jacob Hartman)
	
	// Setup session storage
	var storage_class = require('./node_modules/node_session/mongodb_node_session');
	var current_session = new storage_class.session_storage({connection_string: 'mongodb://localhost:27017/labproject'});

	// Setup session stuff
	var node_session = require('node_session');

	// Setup authenicator, which will manage authentication
	var authenticator = require(LIB_DIR + 'authenticate');

	// Finalize node_session setup
	node_session.middleware_config(
	{
	storage: current_session,
	type: 'persistent',
	expire_time: 14400,
	cookie_domain: '10.0.2.15',
	on_session_destroy: authenticator.update_current
	});


	
		
	// Include Cryptography class, which contains cryptographic functions
	var cryptojs = require(LIB_DIR + 'cryptojs');


	// Virtualization module
	var virtualization = require(LIB_DIR + 'virtualization');

	// Lab management module
	var lab = require(LIB_DIR + 'lab');

	// This module will manage all socket communications
	var socket_manager = require(LIB_DIR + 'socket_manager');

	// This checks that the user is not attempting to access from localhost
	function localhost_check(request,response,next)
		{
			var host_header = String(request.headers.host);
			
			if(host_header.indexOf("localhost")!=-1)
				{
					response.send("The app will not function properly if you access at localhost");
				}else{
					next();
				}
			
			
		}

	// Setup the express middleware
	app.configure(function () {
		app.use(express.bodyParser());
		app.use(express.static(__dirname+'/public'));
		app.set('views', __dirname + '/pages');
		app.set( 'view engine', 'ejs' );
		app.use(express.favicon())
		app.use(express.cookieParser());
		app.use(node_session.session_middleware);
		app.use(localhost_check);
	});


	/*
	 *  This section manages connections to certain urls on the site
	 */


	app.get('/', function (req, res) {
		console.log("Hi There");
		// Check if the user is authenticated
		if (authenticator.is_authenticated(req.session))
			{
				// Check if the user is currently in a lab
				if (req.session.current_lab == null||req.session.current_lab=='')
					{
						// Create a new, blank lab
						
						// Get the date to put in lab name
						var today = new Date();
						var new_labname = req.session.username + "_lab_" + today.getMonth() + "-" + today.getDate()+ "-" + today.getFullYear();
						lab.create_lab(req.session.username,new_labname,function(err){
							req.session.current_lab = new_labname;
							res.sendfile(__dirname + '/pages/display.html');
						});
					}else{
						// If so, send him the app main interface
						res.sendfile(__dirname + '/pages/display.html');
					}
				
			}else{
				// If not send him to the login page
				res.sendfile(__dirname + '/pages/login.html');
			}
	  
	});

	// Run when the url '/login' is recieved
	app.get('/login', function (req, res) {
		// Check if the user is authenticated
		if (authenticator.is_authenticated(req.session))
			{
				// If he is, send him back tp main app interface
				res.redirect('/');
			}else{
				// Check if this is an error page
				if (!req.query.res == 'error')
					{
						server_logging.log_debug('send regular login page');
						res.sendfile(__dirname + '/pages/login.html');
					}else{
						res.sendfile(__dirname + '/pages/error_login.html');
					}
				
			}
	});

	app.get('/pref', function (req, res) {
		if (authenticator.is_authenticated(req.session))
			{
				res.render('prefs',{})
			}else{
				res.redirect('/login');
			}
	});

	app.get('/logout', function (req, res) {
		server_logging.log_notice('Username ' + username + " has logged out");
		var username = req.session.username;
		authenticator.logout(req, function(complete){
			if (complete)
				{
					io.sockets.emit('broadcast_emit_notice', {message: 'User ' + username + ' has logged out'});
						
					res.redirect('/login');
				}else{
					res.send(500, { error: 'Logout Failed' });
				}
			
			
			});

		

		
			
	});

	app.post('/login', function (req, res) {
		
	  var username = req.body.username;
	  var password = req.body.password;
	  
	  
	  if (typeof username != 'undefined' && typeof password != 'undefined'&&username.trim()!=''&&password.trim()!='')
		{
			
			
			authenticator.authenticate(username,password, function(response){
				server_logging.log_debug("Authentication Process Complete");
				if (response!=false)
					{
						req.session.authenticated = true;
						req.session.username = response.username;
						
						var username = req.session.username;
						var authhash = cryptojs.random_hash();
						new Date(Date.now() + 60 * 1000)
						var setup_user = {username: username, authhash: authhash, socket: "", sessionid: req.sessionid};
						
						//server_logging.log_debug("User data: ");
						//console.log(setup_user);
						//server_logging.log_debug("End User data");
						DB.collection('current_users').insert(setup_user, function (err, inserted) {
							if (err)
								{
									console.log(err);
								}
						});


						res.cookie('socketauth', username + ":" + authhash);
						//console.log("Cookie: " + username + ":" + authhash);
						
						io.sockets.emit('broadcast_emit_notice', {message: 'User ' + username + ' has logged in'});
						res.redirect('/');
						
					}else{
						res.redirect('/login?res=error');
					}
				
				});
			
		}else{
			res.redirect('/login?res=error');
		}
		
		
	});
	
	// Actually start the server
	server_logging.log_notice('Server started at port ' + CONF_DATA.HEAD_PORT); // Log startup
	server.listen(CONF_DATA.HEAD_PORT);

	/*
	 * This section is for websockets
	 */
	 
	io.set('authorization', function (data, accept) {
		// check if there's a cookie header
		if (data.headers.cookie) {
			
			
			
			var session = new node_session.session()
			
			session.setup({
				storage: current_session,
				type: 'persistent',
				expire_time: 14400,
				on_session_destroy: authenticator.update_current
			});
			
			var cookie_value = session.get_cookie(session.name,data.headers.cookie);
			
			session.get_session(cookie_value,function(session_data){
				if (session_data == null)
					{
						accept('No session', false);
					}else{
						if (session_data.data.authenticated === true)
							{
								data.session = session_data.data;
								data.sessionid = cookie_value;
								accept(null, true);
							}else{
								accept('Not Authenticated.', false);
							}
					}
				
			});
			
			
		} else {
		   // if there isn't, turn down the connection with a message
		   // and leave the function.
			accept('No cookie transmitted.', false);
		}
		// accept the incoming connection
		//accept(null, true);
	});


	io.sockets.on('connection', function (socket) {
		//io.sockets.emit('broadcast_emit_notice', {message:'user has logged in'});
		server_logging.log_notice('Starting socket connection');
		socket_manager.start(socket, current_session);
	});


});


