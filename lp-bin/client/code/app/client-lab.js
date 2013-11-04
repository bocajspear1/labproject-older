
module.exports = {
	new_lab: function(name, callback){
		
	},
	check_lab: function(callback){
		ss.rpc('lab.check_lab', name, function(response){
			if (response=='success')
				{
					callback(true);
				}else{
					callback(false);
				}
		});
	},
	delete_lab: function(callback){
		ss.rpc('auth.logout', function(response){
			callback(response);	
		});
	},
	modify_lab: function(){
		alert(1);
	}
}
