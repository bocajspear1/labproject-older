var server_logging = require('./server-log');
var cryptojs = require('./cryptojs');
var mongodb = require('mongodb');
var mongoclient = mongodb.MongoClient;
var mongostring = 'mongodb://localhost:27017/labproject';
var DB;

mongoclient.connect(mongostring, function(err, db) {
	DB = db;
	})


module.exports = {
	authenticate: function (username,password, done_auth)
	{
		
		if (!typeof done_auth == 'function')
			{
				console.log ('It is not a function');
				return;
			}
		
		//Check if already logged in
		var multi_check = DB.collection('current_users');
		console.log(username)
		multi_check.findOne({username: username}, function(err, user) {
			
			// If the database returned something, the user is already logged in
			if (user)
				{
					done_auth(false);
				}else{
						var collection = DB.collection('users');
						if (!collection)
							{
								console.log("User collection problem"); 
								done_auth(false);
								return;
							}
						collection.findOne({username: username}, function(err, user) {
							if (err) 
							{ 
								console.log(err); 
								done_auth(false);
								return;
							}
							if (!user) {
								console.log('No user found');
								done_auth(false);
									  
							}else{
								var salt = user.salt;
								var hashed_password = cryptojs.pbkdf2_hash(password,salt,500);
								
								
								if (hashed_password==user.password)
									{
										console.log("User Logged in");
										done_auth(user);
									}else{
										done_auth(false);
									}
							}
							
						});
				}
		});
		

		
			
			
	},
	
	is_authenticated: function (session)
	{
		if (session)
			{
				if (session.authenticated === true)
					{
						
						return true;
					}else{
						return false;
					}
			}else{
				return false;
			}
		
	},
	
	logout: function(req, done)
		{
			if (!typeof done == 'function')
				{
					console.log ('It is not a function');
					return;
				}
			if (DB)
				{
					DB.collection('current_users').remove({username: req.sessionID},function (err, inserted) {
								if (err)
									{
										console.log(err);
										done(false);
										
									}
							});
				}else{
					console.log("DB Error 133");
					done(false);
				}
			
			req.session.authenticated = false;
			req.session.username = '';
			

			req.session.destroy(function()
			{
				console.log('logout function stuff');
			});
			done(true);
		},
	
	update_current: function(sessionid,session_data)
		{
			DB.collection('current_users').remove({sessionid: sessionid},function (err, inserted) {
				if (err)
					{
						console.log(err);
						
						
					}
					
				});
			
		
		},
	
	socket_auth: function(){
		
	},
		
	has_user_permissions: function(username, callback){
		DB.collection('users').findOne({username: username}, function(err, user) {
			if (user)
				{
					var permissions = user.privileges;
					if (permissions.users == true)
						{
							callback(true);
						}else{
							callback(false);
						}
				}else{
					callback(false);
				}
				
			
		});
	},
	
	has_device_permissions: function(username, callback){
		DB.collection('users').findOne({username: username}, function(err, user) {
			if (user)
				{
					var permissions = user.privileges;
					if (permissions.devices == true)
						{
							callback(true);
						}else{
							callback(false);
						}
				}else{
					callback(false);
				}
				
			
		});
	}

}
