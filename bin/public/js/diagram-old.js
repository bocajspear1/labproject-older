function diagram_class()
	{
		this.stage ='';
		this.mainLayer = '';
		
		this.init = init;
		function init(stage)
			{
				this.stage = new Kinetic.Stage({
					container: stage,
					width: ($( "#" + stage ).width() * .98),
					height: ($( "#" + stage).height() * .98 )
				});
				
				this.mainLayer = new Kinetic.Layer();
				this.stage.add(this.mainLayer);
			}
		
		this.add_item = add_item;
		function add_item(name, type)
			{
				
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
			
		this.test = test;
		function test()
			{
				var rect = new Kinetic.Rect({
					x: 5,
					y: 5,
					width: 100,
					height: 50,
					fill: 'green',
					stroke: 'black',
					strokeWidth: 4,
					draggable: true
				});

				  // add the shape to the layer
				rect.on('dragmove', function() {
						document.body.style.cursor = 'pointer';
						add_message('X:' + rect.getX() + ", but i'm mean",'notice')
						rect.setY(5);
						rect.setX(5); 
						this.update();
						
				});
				
				this.add_to_layer(rect);
				
				

				  // add the layer to the stage
				 
				
				  
				}
	}

var jdiagram = new diagram_class();



