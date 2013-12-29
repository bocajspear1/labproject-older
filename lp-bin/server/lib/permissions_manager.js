module.exports = {
	get_user_permissions: function(username,callback){
		
	},
	get_group_permissions: function(group, callback){
		
	}, 
	verify_device_permissions: function (username, permission, uuid,callback){
		if (permission=='device')
			{
				// Only expect one result, check
				database.findOne('users',{'permissions.device.uuid' : uuid},function(result){
					if (result)
						{
							var device_permissions = result.permissions.device;
							
							for
						}else{
							// Search through groups
							database.find('device_groups',{'devices': uuid},function(results){
								
							});
						}
				};
				
				
			}else if (permission=='user'){
				
			}
	},
	set_device_permissions: function(username,set_to,uuid,callback){
		
	},
	verify_permissions_for: function (username, verify_for, callback){
		
	},
}
