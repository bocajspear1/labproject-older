var database = require('../database');

exports.actions = function(req, res, ss){
	req.use('session');
	req.use('auth_check.run');
	
	return {
		check_lab: function(){
			var username = req.session.username;
			database.find('current_labs',{username: username},{},function(results){
			if (results)
				{
					res('success');
				}else{
					res('fail');
				}
			});	
		},
		new_lab: function(name){
		
		},
		delete_lab: function(){
			res();
		},
		update_lab: function(){
			res();
		},
		
	}
	
}
