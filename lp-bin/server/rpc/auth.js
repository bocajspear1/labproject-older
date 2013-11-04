var database = require('../database');
var crypto = require('../cryptojs');

exports.actions = function(req, res, ss){
	req.use('session');
	
	return {

		authenticate: function(username,password){
			
			database.findOne('current_users',{username: username},function(results){
				
				if (results)
					{
						
						req.session.authenticated = false;
						req.session.save();
						res({'auth_result':'fail'});
					}else{

						database.findOne('users',{username: username},function(result){
							if (!result)
								{
									req.session.authenticated = false;
									req.session.save();
									res({'auth_result':'fail'});
								}else{
									var salt = result.salt;
									var hashed_password = crypto.pbkdf2_hash(password,salt,500);
									
									if (hashed_password==result.password)
										{
											req.session.authenticated = true;
											req.session.username = username;
											req.session.save();
											res({'auth_result':'success'});
										}else{
											req.session.authenticated = false;
											req.session.save();
											res({'auth_result':'fail'});
										}
									
								}
						});
						
					}
			});
			
			//res({'AUTH':'SUCCESS'});
		},
		check: function(){
			//console.log(req.session.authenticated);
			
			if (req.session && req.session.authenticated===true)
				{
					res('success');
				}else{
					res('fail');
				}
		},
		logout: function()
			{
				console.log("logout");
				req.session.authenticated = false;
				req.session.username = false;
				req.session.save();
				res('logout');
			}
		
	}
	
}


