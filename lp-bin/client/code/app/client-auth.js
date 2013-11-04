
module.exports = {
	authenticate: function(username,password, callback){
		ss.rpc('auth.authenticate', username, password, function(response){
			callback(response.auth_result);	
		});
	},
	logout: function(callback){
		ss.rpc('auth.logout', function(response){
			callback(response);	
		});
	},
	get_permissions: function(){
		alert(1);
	}
}







