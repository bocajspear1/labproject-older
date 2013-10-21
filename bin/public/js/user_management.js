function user_management()
	{
		this.show_current_users = show_current_users;
		function show_current_users()
			{
				// Ask server for all currently logged in users
				socket.emit('user_request', {request_type: 'get_current_users'})
				socket.on('get_current_users_response', function (data) {
					
					
				});
			}
	}
