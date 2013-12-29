

module.exports = {
	new_user: function(info,callback){
		var new_user = {
			username: info.username,
			hash: ,
			salt: ,
			
		};
	},
	delete_user: function(username,callback){
		database.remove('users',{username: username},function(result){
			callback();
		});
	},
	verify_user: function(username,callback){
		
	},
	new_group: function(group_info, callback){
		
	},
	delete_group: function(group_nme, callback){
		
	},
	add_user_to_group: function(username,group_name,callback){
		
	},
	remove_user_from_group: function(username,group_name,callback){
		
	},
}
