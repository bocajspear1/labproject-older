/*
 * Module: system
 * 
 * Description: This module gives statistics and information on the current host system.
 * 
 * 
 */
 
// Modules for OS functions and process spawning functions
var os = require('os');
var child_process = require('child_process');


module.exports = {
	system_info: function()
		{
			var info = {};
			
			info.hostname = os.hostname();
			info.arch = os.arch();
			info.os_type = os.type();
			info.os_version = os.release();
			info.interfaces = os.networkInterfaces();
			info.cpu = os.cpus();
			
			return info; 
		},
	mem_percent: function()
		{
			var mem_free = os.freemem();
			var total_mem = os.totalmem();
			
			return round((mem_free / total_mem) * 100);
		},
	
	cpu_stat: function()
		{
			return os.loadavg();
		},
		
	disk_stats: function(callback)
		{
			// Stores the disk usage data
			var disk_info = array();
			// Runs 'df -h' and then parses it into a more usable format
			child_process.exec('df -h', function(err, resp) 
				{
					// Split by newlines 
					var resp_array = resp.split(/\n/);
			
					// Parses through each row
					for(var i = 0;i < resp_array.length;i++)
						{
							// Skip first line
							if (i != 0)
								{
									// Split according to spaces
									var line_array = resp_array[i].split(' ');
									
									// Check
									if (line_array.length > 1)
										{
											var r = line_array.indexOf("");
											while(r != -1)
												{
													line_array.splice(r, 1);
													r = line_array.indexOf("");
												}
											
											item_obj = {};
											
											item_obj.fs = line_array[0];
											item_obj.size = line_array[1];
											item_obj.used = line_array[2];
											item_obj.available = line_array[3];
											item_obj.used_percent = line_array[4];
											item_obj.mounted_on = line_array[5];
											
											disk_info.push(item_obj);
										}
								
									
								}
							
							
						}
					
					callback(disk_info);
					
				}); 
		}
}
