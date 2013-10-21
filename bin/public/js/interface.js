// Setup interface
function init_interface()
	{
		 $( "#user_profile_dialog" ).dialog({
		 autoOpen: false,
		 height: 500,
		 width: ($( "body" ).width() * .90),
		 modal: true,
		 draggable: false,
		});
		
		 $( "#device_manager_dialog" ).dialog({
		 autoOpen: false,
		 height: 600,
		 width: ($( "body" ).width() * .90),
		 modal: true,
		 draggable: false,
		});	
		
		  $(function() {
			$( "#device-menu" ).accordion({
			  collapsible: true,
			  heightStyle: "content",
			  active:false
			});
			
			
		  });
		  
		  $(function() {
			$( "#insert-device" ).dialog({
			  height: 140,
			  modal: true,
			  autoOpen: false,
			});
		  });
  
	}

 
// Declare functions for events
function init_listeners()
	{
		// Click function for chat
		$("#send_chat").click(function(){
			var message = $("#chat_input").val();
			$("#chat_input").val('');
			var to = $("#chat_to").val();
			
			lab_interface.send_chat(message,to,'cyan');
		  });
		
		$(".add_device_button").click(function(){
			lab_interface.display_new_device_dialog($(this).attr('data-type'));
		  });
		
		$("#user_profile_button").click(function(){
			lab_interface.display_user_profile_dialog();
		  });
		
		$("#device_manager_button").click(function(){
			lab_interface.display_device_manager_dialog();
		  });
		 
		 $("#user_admin_button").click(function(){
			lab_interface.display_user_admin_dialog();
		  });
		 
		 $("#save_lab_button").click(function(){
			
		  });
		  
		 $("#open_lab_button").click(function(){
			
		  });
		 
	}

// End Functions for events


function interface()
{

this.devices = new device_manager();

this.init = init;
function init()
	{
		init_listeners();
		init_interface();
	}
	
	
this.addMessage = addMessage;
function addMessage(data, type)
	{
		var full_message = '<span class="message-' + type + '">' + data + '</span>';
			
			
		$("#message").append(full_message);
		
		$('#message-box').scrollTop($('#message-box')[0].scrollHeight);
	}

this.send_chat = send_chat;
function send_chat(message, to)
	{
		this.addChat('me', message, 'green')
		// send message
		
		socket.emit('chat_message',{to: to,message: message});
		
		
	}
	
this.addChat = addChat;
function addChat(user, message, color)
	{
		if (typeof color == 'undefined'||color.trim == '')
			{
				color='black';
			}
		var full_message = '<span class="message-chat"><span class="chat-user chat-user-' + color + '">' + user +  '</span> - ' + message + '</span>';
			
			
		$("#chat").append(full_message);
		
		$('#chat-box').scrollTop($('#chat-box')[0].scrollHeight);
		
	}




this.display_dialog = display_dialog;
function display_dialog(title,load)
	{
		$("#dialog").html('<img src="images/wait.gif">');
		$("#dialog").dialog({
			title: title,
			autoOpen: false,
			height: 500,
			width: ($( "body" ).width() * .90),
			modal: true,
			draggable: false,
		});
		$( "#dialog" ).dialog('open');
		
		load(function(dialog_contents){
			$( "#dialog" ).html(dialog_contents);
		});
		
		
		
	}
	

this.display_new_device_dialog = display_new_device_dialog;
function display_new_device_dialog(type)
	{
		
		var display_name = []
		display_name['router'] =  'Router';
		display_name['switch'] =  'Switch';
		display_name['firewall'] =  'Firewall';
		display_name['pc'] =  'Computer';
		display_name['server'] =  'Server';
		display_name['traffic_generator'] =  'Traffic Generator';
		display_name['service_verifier'] =  'Service Verifier';
		var innerthis = this;
		
		this.devices.get_available_providers(function(result){
			var render_data = {providers: result}
			var resulthtml = new EJS({url: '/js/ejs/new_device_dialog.ejs'}).render(render_data);
			
			innerthis.display_dialog('Add ' + display_name[type] + ' to lab', function(done){
				done(resulthtml);
				
				$('#new_device_provider_select').change(function() 
					{
						var value = $(this).attr('value');
						if (value !='')
							{
								var results = innerthis.devices.get_available_devices(value);
								var option_html = '<select id="new_device_select"><option value="">Select a device from ' + value + '</option>';
								
								for (var i = 0;i < results.length;i++)
									{
										option_html += '<option value="' + results[i] + '">' + results[i] + '</option>'
									}
								option_html += '</select>';
								$('#new_device_select_place').html(option_html);
								
								//Device Name: <input type="text" id="new_device_name">
								$('#new_device_select').change(function() 
									{
										var value = $(this).attr('value');
										if (value)
											{
												$('#new_device_name').html('Device Name: <input type="text" id="new_device_name_input">');
											}else{
												$('#new_device_name').html("");
											}
									});
								
							}else{
								$('#new_device_select_place').html('');
							}
						
					});
			});
			
			/*innerthis.display_dialog('Add ' + display_name[type] + ' to lab',resulthtml,function(dialog,done){
				
				
				done;
			});*/
		})
		
	}

this.display_user_admin_dialog = display_user_admin_dialog;
function display_user_admin_dialog()
	{
		socket.emit('user_admin', {request_type: 'get_users'})
		socket.on('user_admin_response', function (data) {
			console.log(data)
			if (data.error)
				{
					alert('You do not have privileges to access the user admin panel');
				}else{
					var render_data = {users: data.users};
					
					var resulthtml = new EJS({url: '/js/ejs/useradmin_main.ejs'}).render(render_data)
					
					display_dialog('User Administration', function(done){
						done(resulthtml);
						
						 $( "#new_user_button" )
						  .button()
						  .click(function( event ) {
								var render_data = {};
					
								var resulthtml = new EJS({url: '/js/ejs/useradmin_new_user.ejs'}).render(render_data)
								
								done(resulthtml);
								
								event.preventDefault();
						  });
						});
					
				}
		});
	}

this.display_device_manager_dialog = display_device_manager_dialog;	
function display_device_manager_dialog()
		{
			var innerthis = this;
			
			this.devices.get_providers(function(data){
				
					innerthis.addMessage('Good!','notice');
					var fullnames = [];
					fullnames['vbox'] = "VirtualBox";
					fullnames['qemu'] = "Qemu/KVM";
					fullnames['xen'] = "Xen";
					
					var render_data = {providers: data.results, fullname: fullnames,libvirt: data.libvirt};
					
					var resulthtml = new EJS({url: '/js/ejs/device_dialog.ejs'}).render(render_data)
					innerthis.display_dialog('Device Manager',resulthtml,function(dialog,done){
							$( "#device_manager_tabs" ).tabs();
							
							$("#virtualbox-tab-button").click(function(){
							
								socket.emit('get_provider', {provider: 'virtualbox'  });
								socket.on('get_provider_resp', function(data){
									render_data = {data: data.info};
									
									var resulthtml = new EJS({url: '/js/virt-provider.ejs'}).render(render_data)
									$( "#virtualbox-tab" ).html(resulthtml);
									get_virtualbox_devices();
									});
							});
							
							$(".provider-manage").click(function(){
								alert($(this).attr('data-provider'));
							  });
							
							done;
						});
				
				
			});
			
			/*
			socket.emit('device_request', {request_type: 'get_reg_devices'})
			socket.on('get_reg_devices_response', function (data) {
				
						
					
					
			

						
						
						
						
					
				
				
			});
			*/
		}
this.display_user_profile_dialog = display_user_profile_dialog;	
function display_user_profile_dialog()
		{
			
			$('#user_profile_dialog').html('<img src="/images/wait.gif">');
			$('#user_profile_dialog').dialog( 'open' );
			
			socket.emit('get_user_profile', { hash: cookiedata })
		
			socket.on('get_user_profile_resp', function (data) {
				var profile = data.profile
				
				var privilege_string = '';
				if (profile.privileges.users == true && profile.privileges.devices == true)
					{
						privilege_string = "Can Modify Users: <b>Yes</b><br>Can Modify Devices: <b>Yes</b>";
					}
				
				var dialog_contents = "<h2>"  + profile.username + "</h2><br><br>First Name: <input id='first_name' value='" + profile.first_name + "'><br>Last Name: <input id='last_name' value='" + profile.last_name + "'><br><br><h3>Privilege Level:</h3>" + privilege_string;
				$('#user_profile_dialog').html(dialog_contents);
			});
		}


}

lab_interface = new interface();

