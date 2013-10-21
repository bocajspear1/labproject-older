var exec = require('child_process').exec;


module.exports = {
	get_devices: function(done)
		{
			var child = exec("VBoxManage list vms", function (error, stdout, stderr) {
				if (error !== null) 
					{
						console.log('exec error: ' + error);
					}else{
						console.log(stdout + "\n\n");
						
						var devices = stdout.split("\n");
						
						var array_of_devices = Array();
						for (var i = 0;i<=devices.length-1;i++)
							{
							
								if (devices[i]!="")
									{
										console.log(i + ":");
								
										console.log("it:" + devices[i] + ":");
										var device_array = devices[i].split("{");
										
										console.log(device_array);
										
										var device_name = device_array[0].replace(/["]/g,'');;
										device_name = device_name.trim();
										console.log(":" +  device_name+ ":");
										
										var device_uid = device_array[1].replace('}',"");
										device_uid = device_uid.trim();
										console.log(":" +  device_uid + ":");
										
										array_of_devices[i] = {name: device_name, uid: device_uid}
									}else{
										console.log('blank');
									}
								
							}
						//console.log(stdout);
						done(array_of_devices);
					}

				});
		},

	start_vm: function (name,options, callback){
		
	},
	
	stop_vm: function (name,options, callback){
		
	},
	
	clone_vm: function(toclone, newname, options, callback){
			
	},
		
	delete_vm: function(name, options, callback){
		
	},
	
	modify_vm: function(name, setting, value, options, callback){
		
	},
	
	change_ram: function(name, amount, callback){
		
	},
	

}



