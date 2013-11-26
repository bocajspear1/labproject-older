
var auth = require('./client-auth');
var lab = require('./client-lab');
var interface = require('./interface');



interface.start();

interface.button('login-button',function(){
	var username = $('#username-textbox').val();
	var password = $('#password-textbox').val();
	$('#login-button').hide();
	$('#login-message').html('<img src="/images/wait.gif">');
	auth.authenticate(username,password, function(result){
		
		if (result=='success')
			{
				interface.login_overlay_disable();
				
				on_login();
				
				
			}else{
				$('#password-textbox').val('');
				$('#login-button').show();
				$('#login-message').html('Error: Failed Login');
			}
	});
});

interface.button('logout-button',function(){
	
	auth.logout(function(result){
		alert(result)
		if (result=='logout')
			{
				interface.login_overlay_enable();
			}else{
				
			}
	});
});

interface.button('menu_about_button',function(){
	interface.about_dialog(function(test_dialog){
		test_dialog.display();
	});
	
});

interface.button('menu_new_lab',function(){
	
	lab.check_lab(function(results){
		if (result===true)
			{
				alert('Sure?');
			}else{
				alert('New');
			}
	});
	
});

interface.button('new_device_button',function(){
	auth.check_device_permissions(function(result){
			if (result===true)
				{
					interface.new_device_dialog(function(new_device){
						new_device.display();
					});
				}else{
					interface.show_banner_alert("You do not have permssions to create new devices","ERROR");
				}
	});
});

function on_login()
	{
		lab.check_lab(function(result){
		if (result===true)
			{
				interface.show_banner_alert("Loading Lab...","");
			}else{
				interface.show_banner_alert("Creating new lab...","");
			}
		});
	}


//var test_dialog = interface.popup_dialog('Test','Welcome to LabProject');
//test_dialog.display();

	//interface.show_banner_alert("Creating new lab...","");




