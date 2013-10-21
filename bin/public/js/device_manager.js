function device_manager()
	{
		this.get_providers = get_providers;
		function get_providers(callback)
			{
				socket.emit('device_request', {request_type: 'get_all_providers'})
				socket.on('get_all_providers_response', function (data) {
					console.log(data)
					callback(data);
				});
				
				
			}
		
		
		this.get_available_providers = get_available_providers;
		function get_available_providers(callback)
			{
				var test_data = ['virtualbox','qemu'];
				
				callback(test_data);
			}
			
		this.get_available_devices = get_available_devices;
		function get_available_devices(provider,type)
			{
				if (provider=='virtualbox')
					{
						return ['vm_1', 'vm_2'];
					}else{
						return ['other_vm'];
					}
				
			}
			
		this.get_device_info = get_device_info;
		function get_device_info(device_id)
			{
				
			}
			
	}
