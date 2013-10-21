var authenticator = require('./authenticate');
var virtualization = require('./virtualization');
var useradmin = require('./useradmin');

module.exports = {
	
	
	
	start: function (socket){
		console.log('A socket with sessionID ' + socket.handshake.sessionid  + ' connected: ');
        
        
        
        //socket.broadcast.emit("broadcast_emit_notice",{message: 'User ' + current_session.username + ' has logged in' });
        
        // Join to a private room
        socket.join(socket.handshake.session.username);
        
        // Broadcast the user has connected
        socket.broadcast.emit('broadcast_emit_notice', {message: 'User ' + socket.handshake.session.username + ' has connected'});
        
		socket.on('disconnect', function(){
			console.log('client disconnected');
			socket.broadcast.emit('broadcast_emit_notice', {message: 'User ' + socket.handshake.session.username + ' has disconnected'});
		});
		
		socket.on('device_request', function(data){
		if (data.request_type=='get_reg_devices')
			{
				authenticator.has_device_permissions(socket.handshake.session.username, function(result){
					if (result==true)
						{
							virtualization.get_registered_devices('all',function(data){
								
								socket.emit('get_reg_devices_response', {devices: data});
							});
						}else{
							socket.emit('no_device_manager_permissions', {error: 'NOPRIV'});
						}
					
				});
			}else if(data.request_type=='get_all_providers'){
				
				
				authenticator.has_device_permissions(socket.handshake.session.username, function(result){
					if (result==true)
						{
							virtualization.get_all_providers(function(results,libvirt_ver){
								socket.emit('get_all_providers_response', {results: results, libvirt: libvirt_ver});
							});
								
							
						}else{
							socket.emit('no_device_manager_permissions', {error: 'NOPRIV'});
						}
					
				});
				
				
				
				
			}
		});
		
		socket.on('user_admin', function(data){
			
			authenticator.has_user_permissions(socket.handshake.session.username, function(result){
					if (result==true)
						{
						
						if (data.request_type == 'get_users')
							{
								useradmin.get_all_users(function(data){
									socket.emit('user_admin_response', {users: data});
								});
							}
						
						
						}else{
							socket.emit('user_admin_response', {error: 'NOPRIV'});
						}
					
				});
			
			
		});
		
		socket.on('chat_message', function(data){
			if (data.to == 'all_users')
				{
					console.log('send chat');
					socket.broadcast.emit('chat_message', {message: data.message,user: socket.handshake.session.username});
				}else{
					
				}
			
		});
	},
	
	
	send_error: function(error_message){
		
	},
	
}

/*

		  
		  socket.on('auth_init', function (data) {
			authenticator.update_current();  
			  
			var values = data.hash.split(":");
			authenticator.socket_auth
			DB.collection('current_users').findOne({username: values[0], authhash: values[1]}, function(err, current_user) {
					if (err)
						{
							console.log(err);
							socket.set('authenticated', false, function () {
							  socket.emit('auth_bad');
							});
						}else{
							if (current_user)
								{
									DB.collection('current_users').update({username: values[0]},
									   {
										 $set: { 'socket': socket.id },
									   },function (err, updated) {
										if (err)
											{
												console.log(err);
											}else{
												//console.log(updated);
											}
									});
									   console.log(socket.id);
								
									// Send message that authentication is good!
									socket.set('authenticated', values[0], function () {
									  socket.emit('auth_good');
									});
								}else{
									console.log('Bad User');
									socket.set('authenticated', false, function () {
									  socket.emit('auth_bad');
									});
								}
							
						}
				
				}); 
			
		  });

			

			socket.on('get_user_profile', function(data){
				 authenticator.update_current();
				
				 socket.get('authenticated', function (err, result) {
					 if (result!=false)
						{
							
							
							DB.collection('users').findOne({username: result}, function(err, user) {
							if (user)
								{
									var send_user = {first_name: user.first_name, last_name: user.last_name, username: user.username, privileges: user.privileges};
									socket.emit('get_user_profile_resp', {profile: send_user});
								}else{
									socket.set('authenticated', false, function () {
									  socket.emit('warning', {message: 'Socket Authentication Failed'});
									});
								}
							});
											
								
							
						}else{
							socket.emit('warning', {message: 'You are not authenticated to the socket!'});
						}
					 
				 });
				
			});

			socket.on('get_provider', function(data){
				if (data.provider=='virtualbox')
					{
						virtualization.get_provider_info('virtualbox',function(info){
							socket.emit('get_provider_resp', {provider: 'virtualbox', info: info});
						});
					}else{
						
					}
			});
			
			socket.on('get_provider', function(data){
				if (data.provider=='virtualbox')
					{
						virtualization.get_provider_info('virtualbox',function(info){
							socket.emit('get_provider_resp', {provider: 'virtualbox', info: info});
						});
					}else{
						
					}
			});
			
			socket.on('get_provider_devices', function(data){
				if (data.provider=='virtualbox')
					{
						virtualization.get_devices('virtualbox',function(devices){
							for(var i = 0;i < devices.length;i++)
								{
									virtualization.get_device_info('virtualbox'
								}
						});
						
						virtualization.get_provider_info('virtualbox',function(info){
							socket.emit('get_provider_devices_resp', {provider: 'virtualbox', info: info});
						});
					}else{
						
					}
			});	

*/
