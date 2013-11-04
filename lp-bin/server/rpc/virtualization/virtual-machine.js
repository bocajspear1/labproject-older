var database = require('../../database');

exports.actions = function(req, res, ss){
	req.use('session');
	req.use('auth_check.run');
	
	return {
		get_register_devices: get_register_devices,
		register_device: register_device,
		find_unregistered_devices: find_unregistered_devices,
	}
	
}

function get_register_devices(callback)
	{
		database.find('registered_devices',{},{},function(results){
				callback(results);
			});
	}
	
function register_device(info,callback)
	{
		
	}

function unregister_device(callback)
	{
		
	}

function find_unregistered_devices(callback)
	{
		
	}

function new_device(callback)
	{
		
	}
	
function delete_device(callback)
	{
		
	}
