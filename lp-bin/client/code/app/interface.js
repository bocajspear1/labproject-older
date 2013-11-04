var overlay_is_enabled = false;

module.exports = {
	start: function(){
		
		$('#overlay').hide();
		$('#overlay-message').hide();
		$('#banner-alert').hide();
		$('#dialog').hide();
		
		$('#left').scrollTop($('#left').height()/2);
		$('#left').scrollLeft($('#left').width()/2);
		innerthis = this;
		ss.rpc('auth.check', function(response){
			
			if (response=='success')
				{
					innerthis.login_overlay_disable();
					
				}else{
					
				}
			var timer = setInterval(function(){
			$('#loading').fadeOut();
			clearInterval(timer);
			},1000);
			
		});
	},
	
	button: function(id, onclick){
		$('#' + id).click(onclick);
	},
	
	overlay_enable: function(message){
		if (overlay_is_enabled===false)
			{
				$('#overlay').fadeIn();
				$('#overlay-message').fadeIn();
				$('#overlay-message').html(message);
				overlay_is_enabled = true;
			}
		
	},
	overlay_disable: function(){
		if (overlay_is_enabled===true)
			{
				$('#overlay').fadeOut();
				$('#overlay-message').fadeOut();
				$('#overlay-message').html('');
				overlay_is_enabled = false;
			}
		
	},
	
	login_overlay_enable: function(){
		$('#login').fadeIn();
	},
	
	login_overlay_disable: function(){
		$('#login').fadeOut();
	},
	show_banner_alert: function(message,type){
		//$('#banner-alert').html($(message).text());
		$('#banner-alert').html(message);
		$('#banner-alert').fadeIn();
		var timer = setInterval(function(){
			//alert(1);
			$('#banner-alert').fadeOut();
			$('#banner-alert').html('');
			clearInterval(timer);
			},3000);
	},
	basic_dialog: function(contents){
		
	},
	popup_dialog: function(title, message, button_type, callback)
		{
			var popup_dialog = new dialog(title);
			popup_dialog.set_contents(message);
			popup_dialog.add_button(popup_dialog.default_buttons.cancel);
			popup_dialog.add_button(popup_dialog.default_buttons.default_okay);
			return popup_dialog;
		},
	about_dialog: function()
		{
			var the_dialog = new dialog('About');
			the_dialog.set_contents('<h1>LabProject</h1> v. Dev 0.001<br>Made by Jacob Hartman');
			the_dialog.add_button(the_dialog.default_buttons.default_okay);
			return the_dialog;
		},
	new_lab_dialog: function()
		{
			
			var the_dialog = new dialog('New Lab');
			the_dialog.set_contents('<h1>LabProject</h1> v. Dev 0.001<br>Made by Jacob Hartman');
			the_dialog.add_button(the_dialog.default_buttons.default_okay);
			return the_dialog;
		}
}



function dialog(inner_title)
	{
		var title = inner_title;
		var contents;
		var buttons = new Array();
		var inner_this = this;
		
		this.default_buttons = 
			{
				cancel: 
					{
						
						name:'interface_dialog_cancel',
						text: 'Cancel',
						onclick: function(){
							inner_this.close();
						}
						
					},
				no:
					{
						name:'interface_dialog_no',
						text:"No",
						onclick: function(){
							inner_this.close();
						}
					},
				default_okay:
					{
						name:'interface_dialog_default_okay',
						text:"Okay",
						onclick: function(){
							inner_this.close();
						}
					}
			}
		
		this.dialog_size = dialog_size;
		function dialog_size(width,height)
			{
				
			}
		
		this.set_contents = set_contents
		function set_contents(value)
			{
				contents = value;
			}
		
		this.display = display;
		function display()
			{
				var inner_content = contents;
				var button_content = '';
				
				// Add the buttons
				for (var i=0;i<buttons.length;i++) {
					var button = buttons[i];
					
					
					button_content += "<button id='" + button.name + "'>" + button.text + "</button>";
				}
				
				
				$('#overlay').fadeIn();
				$('#dialog-content').html(inner_content);
				$('#dialog-title').html(title);
				$('#dialog-buttons').html(button_content);
				
				for (var i=0;i<buttons.length;i++) {
					var button = buttons[i];
					$('#' + button.name).click(function(){
						button.onclick();
					});
				}
				$('#dialog').fadeIn();
				
			}
			
		this.add_button = add_button
		function add_button(button_info)
			{
				buttons.push(button_info)
			}
		
		this.close = close;
		function close()
			{
				$('#dialog').fadeOut();
				$('#overlay').fadeOut();
				window.setTimeout(function(){
					$('#dialog-content').html('');
					$('#dialog-title').html('');
					$('#dialog-buttons').html('');
				},1000)
				
				
			}
	}
	

