var child_process = require('child_process');

module.exports = {
	get_available_by_path: function(path,callback)
		{
			var return_array = Array();
			path = path.replace(/[^\/a-zA-Z\-_ ]/g, "");
			//console.log("running: " + 'df -h ' + path);
			child_process.exec('df -h ' + path, function(err, resp){ 
			if (err)
				{
					callback(null);
				}
			var resp_array = resp.split(/\n/);
			
			for(var i = 0;i < resp_array.length;i++)
				{
					if (i != 0)
						{
							//console.log(resp_array[i]);
							var line_array = resp_array[i].split(' ');
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
									
									callback(item_obj);
									//console.log(item_obj);
								}
						}
				}
			
			//console.log(resp_array); 
			}); 
		}
}


//console.log(__filename);
