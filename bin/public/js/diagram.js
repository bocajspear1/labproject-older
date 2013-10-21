
function diagram_class()
    {
		// Stores the main stage
        this.stage ='';
        
        // Stores the main layer
        this.mainLayer = '';

		// Indicates the currently selected object
		this.selected = '';

		
		this.addMode = false;
		this.addInfo = {};
		
		this.OnConnectionAttempt = '';
		
		this.connection_1_find = false;
		this.connection_1_item = '';
		
		
		
		this.connection_2_find = false;
		this.connection_2_item = '';
		
		this.all_items = [];
		this.all_connections = [];
		
		this.detailed_connections = [];
		
		this.data_storage = [];
		
		
        this.init = init;
        function init(stage)
            {
				
				
				
                this.stage = new Kinetic.Stage({

                    container: stage,

                    width: ($( "#" + stage ).width() * .98),

                    height: ($( "#" + stage).height() * .98 )

                });
				


                this.mainLayer = new Kinetic.Layer();
				
				  var background = new Kinetic.Rect({
					x: 0,
					y: 0,
					width: this.stage.getWidth(),
					height: this.stage.getHeight(),
					fill: 'transparent',
					stroke: 'black',
					strokeWidth: 0
				  });
				
				var innerthis = this;
				
				background.on('click',function(evt){
					
					if (innerthis.is_function(innerthis.on_click_off))
						{
							innerthis.on_click_off();
						}
						
					if (innerthis.addMode==true)
						{
							
							innerthis.add_item(innerthis.addInfo.name ,innerthis.addInfo.item,innerthis.addInfo.data,evt.layerX - 50,evt.layerY - 33.75);
							
							
							
							// Blank out addInfo
							innerthis.addInfo = '';
							innerthis.addMode = false;
						}
					if (innerthis.selected!='')
						{
							innerthis.unselect_object(innerthis.selected);
						}
					
				});
				
				background.on('mousemove',function(evt){
					if (innerthis.connection_2_find==true)
						{
							var line = innerthis.get_object('temp_line')[0];
							
							
							var points = line.getAttr('points');
							
							
							
							line.setAttr('points',[points[0],{x: evt.layerX - 10, y: evt.layerY - 10}]);
							innerthis.update();
						}
				});
				
				this.mainLayer.add(background);
				
                this.stage.add(this.mainLayer);
                
                // Turn off left click for stage
				$('#' + stage).bind("contextmenu",function(e){
				   return false;
				}); 
            }

       
		this.click_add = click_add;
		function click_add(to_add)
			{
				
				this.addMode=true;
				this.addInfo = to_add;
			}

        this.add_item = add_item;
        function add_item(name, item_info,data,  x , y)
            {
				var innerthis = this;
				
				var i = 1;
				if (this.all_items.indexOf(name)!=-1)
					{
						var basename = name;
						while (this.all_items.indexOf(name)!=-1)
							{
								name = basename + "(" + i + ")";
								i++;
							}
					}
				
				this.all_items.push(name);
				innerthis.data_storage[name] = data;
				
				var item_group = new Kinetic.Group({
					draggable: true,
					id: name + "_group"
				  });
				
				var diagram_item;
				
				if (item_info.type=='object')
					{
						diagram_item = new Image();				
						diagram_item.onload = function() {
							var item_image_kobject = new Kinetic.Image({
							  x: x,
							  y: y,
							  image: diagram_item,
							  width: 100,
							  height: 67.5,
							  id:  name + "_group_image" 
							});

							item_group.add(item_image_kobject);
							
							 var item_text = new Kinetic.Text({
								x: item_image_kobject.getX(),
								y: item_image_kobject.getY() + (item_image_kobject.getHeight()),
								text: name,
								fontSize: 12,
								fontFamily: 'Calibri',
								fill: 'green',
								width: 100,
								align: 'center'
							  });
						   
							item_group.add(item_text);
							
							var select_rect = new Kinetic.Rect({
								x: x -5,
								y: y-5,
								width: item_image_kobject.getWidth() + 10,
								height: item_image_kobject.getHeight() + item_text.getHeight() + 10,
								fill: 'transparent',
								strokeWidth: 2,
								strokeEnabled: false,
								id: name + "_group_select_rect"
								
								
							  });
							
							item_group.add(select_rect);
							
							
							
							item_group.on('mouseover', function(evt) {
								document.body.style.cursor = 'pointer';
								if (innerthis.connection_2_find==true)
								{
									var line = innerthis.get_object('temp_line')[0];
									
									
									var points = line.getAttr('points');
									
									
									
									line.setAttr('points',[points[0],{x: evt.layerX - 10, y: evt.layerY - 10}]);
									innerthis.update();
								}
							});
							item_group.on('mouseout', function() {
								document.body.style.cursor = 'default';
							});
							
							item_group.on('dragstart', function() {
								innerthis.select_object(name);
							});
							
							item_group.on('dragend', function() {
								innerthis.select_object(name);
							});
							
							item_group.on('dragmove', function(evt) {
								var results = innerthis.in_connection(name);
								
								for(var i = 0;i < results.length;i++)
									{
										var line_name = results[i];
										var line_info = innerthis.detailed_connections[line_name];
										
										var line = innerthis.get_object(line_name)[0];
										
										var this_object = innerthis.get_object(name + "_group_image")[0];
										
										var points = line.getAttr('points');
										
										
										console.log(item_image_kobject.getAbsolutePosition());
										if (line_info.end == name)
											{
												line.setAttr('points',[points[0],{x:item_image_kobject.getAbsolutePosition().x + 50, y: item_image_kobject.getAbsolutePosition().y + 33.75}]);
																	
											}else if (line_info.start == name){
												line.setAttr('points',[{x:item_image_kobject.getAbsolutePosition().x + 50, y: item_image_kobject.getAbsolutePosition().y + 33.75},points[1]]);
												
											}
										innerthis.update();
									}
								
								
							});
							
							item_group.on('click', function(evt) {
								if (!innerthis.is_selected_object(name))
									{
										
										innerthis.select_object(name);
									}else{
										
										innerthis.unselect_object(name);
									}
								if (evt.which == 3)
									{
										if (innerthis.is_function(innerthis.on_left_click))
											{
												innerthis.on_left_click(name + "_group", innerthis.data_storage[name + "_group"], item_group, evt);
											}
										
									}else{
										if (innerthis.connection_1_find==true)
											{
												var result;
												if (innerthis.is_function(innerthis.on_connection_attempt))
													{
														result = innerthis.on_connection_attempt(name + "_group", innerthis.data_storage[name + "_group"], item_group, evt);
													}else{
														result = true;
													}
												
												if (result==true)
													{
														var connection = new Kinetic.Line({
															points: [[item_image_kobject.getAbsolutePosition().x + 50,item_image_kobject.getAbsolutePosition().y + 33.75],[evt.layerX,evt.layerY]],
															stroke: 'red',
															strokeWidth: 5,
															lineCap: 'round',
															lineJoin: 'round',
															id: 'temp_line'
														  });
														
														
														
														innerthis.connection_2_find=true;
														innerthis.connection_1_find=false;
														innerthis.connection_1_item = name;
														
														 
														innerthis.add_to_layer(connection);
													}else{
														
													}
													
											}else if (innerthis.connection_2_find==true){
												if (name == innerthis.connection_1_item)
													{
														innerthis.get_object('temp_line')[0].destroy();
														
														innerthis.connection_2_find=false;
														innerthis.connection_1_find=false;
																	
														innerthis.update();
													}else if (innerthis.is_existing_connection(innerthis.connection_1_item,name)==false){
														var result;
														if (innerthis.is_function(innerthis.on_connection_attempt))
															{
																result = innerthis.on_connection_attempt(name + "_group", innerthis.data_storage[name + "_group"], item_group, evt);
															}else{
																result = true;
															}
														
														if (result==true)
															{
																	var line = innerthis.get_object('temp_line')[0];
									
									
																	var points = line.getAttr('points');
																	
																	line.setAttr('points',[points[0],{x:item_image_kobject.getAbsolutePosition().x + 50, y: item_image_kobject.getAbsolutePosition().y + 33.75}]);
																	
																	
																			
																	
																	var id = innerthis.connection_1_item + "_" + name + "_connection";
																	
																	line.setAttr('id',id);
																	
																	line.setStroke('#706E6F');
																	line.moveToBottom();
																	line.moveUp();
																	innerthis.all_connections.push(id);
																	
																	innerthis.detailed_connections[id] = {start: innerthis.connection_1_item, end: name};
																	
																	line.on('click',function(){
																			
																			line.setStroke('red');
																			innerthis.update();
																	});
																	
																	//alert(innerthis.all_connections);
																	
																	innerthis.connection_2_find=false;
																	innerthis.connection_1_find=false;
																	innerthis.connection_1_item = '';
																	innerthis.update();
															}else{
																
															}
													}else{
														
													}
												
											}else{
												
												
												
												
											}
										
									}
								
								
								});

							innerthis.add_to_layer(item_group);
						  };
						  diagram_item.src = item_info.image;
						
						
					}else{
						
					}
				
				
				
				
				

               
               
		
				
            }
		
		this.is_selected_object = is_selected_object;
		function is_selected_object(name)
			{
				
				if (this.selected == name)
					{
						return true;
					}else{
						return false;
					}
			}
		
		this.select_object = select_object;
		function select_object(name)
			{
				var therect = this.get_object(name + "_group_select_rect")[0];
				
				if (this.selected != '')
					{
						var unselect = this.get_object(this.selected + "_group_select_rect")[0];
						unselect.disableStroke();
					}
				therect.enableStroke();
				this.update();
				this.selected = name;
			}


		this.unselect_object = unselect_object;
		function unselect_object(name)
			{
				var therect = this.get_object(name + "_group_select_rect")[0];
				therect.disableStroke();
				this.update();
				this.selected = '';
					
			}
			
		this.select_line = select_line;
		function select_line(name)
			{
				
			}

		this.is_existing_connection = is_existing_connection
		function is_existing_connection(start, end)
			{
			
				
				var exists = false;
				for (var i in this.detailed_connections) {
					if (this.detailed_connections[i].start == start && this.detailed_connections[i].end == end)
							{
								exists = true;
							}else if (this.detailed_connections[i].start == end && this.detailed_connections[i].end == start){
								exists = true;
							}
				}
				
				return exists;
			}

		this.in_connection = in_connection;
		function in_connection(item)
			{
				var results = [];
				for (var i in this.detailed_connections) {
					if (this.detailed_connections[i].start == item || this.detailed_connections[i].end == item)
							{
								results.push(i);
							}
				}
				return results;
			}
		
		
        this.add_to_layer = add_to_layer;

        function add_to_layer(item)

            {

                this.mainLayer.add(item);

                this.update();

               

            }

        this.update = update;
        function update()
            {
                this.mainLayer.draw();
            }

		this.get_object = get_object;
		function  get_object(name)
			{
				return this.mainLayer.get("#" + name);
			}


		this.connection_add = connection_add;
		function connection_add()
			{
				this.connection_1_find = true;
				this.connection_2_find = false;

			}
		
		this.on_left_click = '';
		this.on_click_off = '';
		
		this.on = on;
		function on(event,torun)
			{
				if (is_function(torun))
					{
						if (event=='left_click')
							{
								this.on_left_click = torun;
							}else if (event=='click_off'){
								this.on_click_off = torun;
							}else if (event=='connection_attempt'){
								this.on_click_off = torun;
							}
					}else{
						
					}
				
			}
			
		this.is_function = is_function;
		function is_function(item)
			{
				return Object.prototype.toString.call(item) == '[object Function]';
			}
    }

var jdiagram = new diagram_class();


function load_topology()
	{
		$("#main-display").append("<div class='screen-loading'><div></div></div>");
		socket.emit('get_topology', { });
	}

