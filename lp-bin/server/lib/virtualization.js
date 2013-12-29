var LABPROJECT_BASE = process.cwd();
var LABPROJECT_SERVER_LIBS = process.cwd() + "/server/lib";

var os = require('os');

var ARCH = os.arch();

// Database functions
var database = require(LABPROJECT_SERVER_LIBS + '/database');

var libvirt = require('libvirt');
var config = require(LABPROJECT_BASE +'/config');

var uuid = require('node-uuid');
var xml_builder = require('xmlbuilder');
var xml_parser = require('xmldoc');
var disk = require(LABPROJECT_SERVER_LIBS + '/disk');
var iso_manager = require(LABPROJECT_SERVER_LIBS + '/iso_manager');

var pool_xml = '<pool type="dir"><name>labproject</name><target><path>' + config.pool_path + '</path></target></pool>'

var default_hypervisor = '';

// Set the default hypervisor
var hypervisors = config.hypervisors;
var i = 0;
var done = false;
while (i < hypervisors.length && done === false)
	{
		if (hypervisors[i].enabled === true&&default_hypervisor=='')
			{
				console.log('Default is ' + i);
				default_hypervisor = i;
				done = true;
			}
		i++;
	}


// Volume: Functionality for managing volumes

var volume = {
		get_all_volumes: function(){
			
		},
		get_volume_info: function(){
			
		},
		create_volume: function(sizekb,name,type,callback){
			// Sanitize type and name input
			type = virt_util.validate_disk_type(type);
			console.log('Type: ',type);
			if (type===false)
				{
					callback({ERROR: {message: 'Invalid volume type'}});
					return;
				}
			name = name.replace(/[^a-zA-Z\-_]/,"");
			
			
			
			// Check if the size given is valid
			if (isNaN(sizekb))
				{
					callback({ERROR: {message: 'Invalid volume size'}});
					return;
				}
			
			// Check if there is space on the current device's disk to store the new volume
			
			// Get available space
			volume.get_available_space(function(space){
				if (space!=null)
					{
						// Check if the allocation is greater than the available space
						if (sizekb < space)
							{
													
								// Verify the pool exists
								verify_pool();
								
								// Get the connection string for the default hypervisor
								var hypervisor_string = get_connection_string(config.hypervisors[default_hypervisor].libvirtstring);
								var hypervisor = new libvirt.Hypervisor(hypervisor_string);
								
								var pool = hypervisor.lookupStoragePoolByName('labproject');
								
								var path_to_disk = config.pool_path + "/" + name +'.' + type;
								
								var volume_xml = '<volume><name>'+ name + '.' + type + '</name><allocation>0</allocation><capacity unit="K">' + sizekb + '</capacity><target><path>' + path_to_disk + '</path><format type="' + type + '"/></target></volume>';
								console.log("Vol XML: ", volume_xml);
								var volume = pool.createVolume(volume_xml);
								callback(null,path_to_disk,volume_xml);
								//volume.remove();
							}else{
								
								callback({ERROR: {message: 'Not enough space available'}});
								return;
							}
					}else{
						
					}
				
				
			});
			
		},
		remove_volume: function(name, callback){
			
		},
		import_volume: function(name,path,callback){
			
		},
		clone_volume: function(name,new_name,callback){
			
		},
		get_available_space: function(callback){
			var pool_path = config.pool_path;
			disk.get_available_by_path(pool_path,function(result){
				//console.log(result);
				if (result!=null)
					{
						var space = result.available;

						callback(convert_to_kilo(space));
					}else{
						callback(null);
					}
			});
		}
	}

var device = {
	get_hypervisor_devices: function(hypervisor_string,callback){
		
		// Get the hypervisor connection string
		var hypervisor_string = get_connection_string(hypervisor_string);
		
		// Get the hypervisor
		var hypervisor = new libvirt.Hypervisor(hypervisor_string);
		
		var inactive_domains = hypervisor.getDefinedDomains();
		//console.log(inactive_domains);
		var active_domains = hypervisor.getActiveDomains();
		//console.log(active_domains);
		
		callback({inactive: inactive_domains,active: active_domains});
	},
	get_device: function(id,callback){
		
	},
	new_device: function(config,callback){
		
		// Check architecture
		if (ARCH=='ia32')
			{
				if (config.platform=='32bit')
					{
						// Okay
						vm_platform = config.platform;
					}else if(config.platform=='64bit'){
						callback({ERROR: {message: 'Cannot make a 64-bit virtual machine on a 32-bit system'}});
						return;
					}else{
						callback({ERROR: {message: 'Invalid platform'}});
						return;
					}
			}else if (ARCH=='x64'){
				if (config.platform=='64bit'||config.platform=='32bit')
					{
						// Okay
						vm_platform = config.platform;
					}else{
						callback({ERROR: {message: 'Invalid platform'}});
						return;
					}
			}else{
				callback({ERROR: {message: 'Invalid platform'}});
				return;
			}
		
		var vm_name = config.name.replace(/[^a-zA-Z]/,"");;

		// Register the new device
		private_device.register_device(vm_name,function(name,uuid){
			
			
			
			var vm = {};
			
			
			vm.uuid = uuid;
			vm.hypervisor = virt_util.validate_hypervisor(config.hypervisor);
			vm.platform = vm_platform;
			
			vm.name = name;
			vm.description = config.description.replace(/[^a-zA-Z ]/,"");
			vm.memory = convert_to_kilo(config.ram);

			if (config.cpus&&!isNaN(config.cpus))
				{
					if (config.cpus>os.cpus().length)
						{
							callback({ERROR: {message: 'Not enough CPUs'}});
							return;
						}else{
							vm.cpus = config.cpus;
						}
					
				}else{
					vm.cpus = 1;
				}
			
			vm.disk_size =  convert_to_kilo(config.disk_size);
			vm.disk_type = config.disk_type
			vm.init_iso = config.iso;
			
			var hypervisor_string = get_connection_string(vm.hypervisor);
			var hypervisor = new libvirt.Hypervisor(hypervisor_string);
			
			var capabilities = new xml_parser.XmlDocument(hypervisor.getCapabilities());
			var capabilities_guests = capabilities.childrenNamed('guest');
			//console.log(capabilities.childrenNamed('guest')) 
			
			for(var i = 0;i < capabilities_guests.length;i++)
				{
					var emulator_arch = capabilities_guests[i].valueWithPath("arch@name");
					console.log(emulator_arch);
					var emulator = capabilities_guests[i].valueWithPath("arch.emulator");
					console.log(i, emulator);
					if (emulator)
						{
							// Add emulator based on architecture
							if (emulator_arch=='i686'&&vm.platform=='32bit')
								{
									vm.emulator = emulator;
								}else if (emulator_arch=='x86_64'&&vm.platform=='64bit'){
									vm.emulator = emulator;
								}else{
									callback({ERROR: {message: 'Invalid platform'}});
									return;
								}
						}
					
				}
			
			console.log(hypervisor.getNodeInfo())
			
		
			console.log("UUID: ",vm.uuid);
			volume.create_volume(vm.disk_size, "hd_" + vm.uuid, vm.disk_type,function(result,hd_path,hd_xml){
				var hd_xml = '';
				if (result&&result.ERROR)
					{
						callback(result);
						return;
					}
				
				// Create XML builder
				var root = xml_builder.create('domain',{},{},{headless:true});
				
				// Set the type
				root.att('type', vm.hypervisor);
				// Set the name
				root.ele('name', {}, vm.name);
				// Set the UUID
				root.ele('uuid', {}, vm.uuid);
				// Set the description
				root.ele('description', {}, vm.description);
				// Set the memory
				root.ele('memory', {'unit':'KiB'}, vm.mem);
				root.ele('currentMemory', {'unit':'KiB'}, vm.memory);
				
				root.ele('vcpu', {'placement':'static'}, vm.cpus);
				var os_ele = root.ele('os');
				os_ele.ele('type','hvm');
				if (vm.hypervisor=='xen')
					{
						//os_ele.ele('loader','/usr/lib/xen-4.1/boot/hvmloader');
					}
				os_ele.ele('boot',{'dev':'cdrom'});
				os_ele.ele('boot',{'dev':'hd'});
				
				// Set the features section
				var features_ele = root.ele('features');
				features_ele.ele('acpi');
				features_ele.ele('apic');
				features_ele.ele('pae');
				
				// Set reactions to shutdowns and restarts...
				root.ele('on_poweroff',{},'destroy');
				root.ele('on_reboot',{},'reboot');
				root.ele('on_crash',{},'reboot');

				// Set the devices
				var device_ele = root.ele('devices');
				
				if (vm.emulator)
					{
						device_ele.ele('emulator',{},vm.emulator);
					}
				
				// Set the mouse
				device_ele.ele('input',{'type':'tablet','bus':'usb'});
				
				var hd_device_ele = device_ele.ele('disk',{'type':'file','snapshot':'external', 'device':'disk'});
				hd_device_ele.ele('source',{'file': hd_path});
				hd_device_ele.ele('target',{'dev':'sda', 'bus':'sata'});
				console.log(hd_device_ele + "");
				
				var cdrom_device_ele = device_ele.ele('disk',{'type':'file', 'device':'cdrom'});
				//cdrom_device_ele.ele('source',{'file': hd_path});
				cdrom_device_ele.ele('target',{'dev':'sdc', 'bus':'sata'});
				cdrom_device_ele.ele('readonly');
				
				// <target dev='hda' bus='ide'/>
				
				//var hd_device = {type: 'hd', name: vm_name + '_hd', path: path};
				
				console.log(root.end({ pretty: true}))
				
				callback();
			}); 
			
			
		});
		
		
		
		

		
	  
	},
	remove_device: function(uuid,callback){
		
	},
	clone_device: function(){
		
	},
	import_device: function(){
		
	},
	start_device: function(uuid){
		
	},
	
};

var private_device = {
	register_device: function(input_name,callback){
		
		private_device.set_device_name(input_name,function(name){
			var new_uuid = uuid.v1();
			
			
			database.insert('registered_devices',{uuid: new_uuid, name: name},function(result){
				if (result.ERROR)
					{
						if (result.ERROR.name == "MongoError" && result.ERROR.code == 11000)
							{
								private_device.register_device(name,callback);
							}else{
								throw new Error(result.ERROR);
							}
						
					}else{
						
						callback(name,new_uuid);
					}
			});
		});
		
		
	},
	set_device_name: function(name, callback){
		database.find('registered_devices',{name: name},{},function(result){
			console.log(result.length);
			if (result.length != 0)
				{
					// Increment number
					increment = function(match,offset,string)
						{
							var raw_number = match;
							raw_number = raw_number.replace("(","");
							raw_number = raw_number.replace(")","");
							var new_number = parseInt(raw_number) + 1;
							
							return "(" + new_number + ")";
						}

					var new_name = name.replace(/\(\d*\)/,increment)
					if (new_name==name)
						{
							new_name = name + "(1)";
						}
					console.log(new_name);
					
					private_device.set_device_name(new_name,callback);
					
				}else{
					callback(name);
				}
		});
	}
}


var network = {
	
}

var virt_util = {
	verify_uuid: function(uuid){
		virt_util.check_default_hypervisor();
		
		var hypervisors = config.hypervisors;
		for (var i = 0;i < hypervisors.length; i++)
			{
				if (hypervisors[i].enabled === true)
					{
						var hypervisor_string = get_connection_string(hypervisors[default_hypervisor].libvirtstring);
						console.log(hypervisor_string);
						try
						{
							var hypervisor = new libvirt.Hypervisor(hypervisor_string);
							return true;
						}catch(e) {
							return false;
						}
						
					}
			}
	},
	validate_hypervisor: function(name){
		if (name=='qemu'||name=='vbox'||name=='xen')
			{
				return name;
			}else{
				throw new Error('Invalid hypervisor of ' + name);
			}
	},
	validate_disk_type: function(type){
		
		var valid_disks = ['raw','bochs','cloop','cow','dmg','iso','qcow','qcow2','qed','vmdk','vpc', 'vdi'];
		
		if (valid_disks.indexOf(type)!=-1)
			{
				return type;
			}else{
				return false;
			}
		
	},
	check_default_hypervisor: function(){
		var hypervisors = config.hypervisors;
		var i =0;
		var done = false;
		
		while (i < hypervisors.length&&done===false)
			{
				if (hypervisors[i].enabled === true)
					{
					
						default_hypervisor = i;
						done = true;
						
					}
				i++;
			}
		
	}
}



function verify_pool()
	{
		virt_util.check_default_hypervisor();
		
		var hypervisor_string = get_connection_string(config.hypervisors[default_hypervisor].libvirtstring);
		var hypervisor = new libvirt.Hypervisor(hypervisor_string);
		try
		{
			var pool = hypervisor.lookupStoragePoolByName('labproject');
		}catch(e){
			//console.log('Nonexistant');
			var result = hypervisor.defineStoragePool(pool_xml);
			result.start();
		}
	}


function convert_to_kilo(value)
	{
		if (isNaN(value))
			{
				
				var space_unit = value.substring(value.length-1,value.length);
				var space_number = value.substring(0,value.length-1);
				
				
				var multiplier = 1;
				if (space_unit=='M')
					{
						multiplier = 1024;
					}else if (space_unit =='G'){
						multiplier = 1048576;
					}else if(space_unit == 'T'){
						multiplier = 1073741824;
					}else if(space_unit == 'P'){
						multiplier = 1099511627776;
						
					}
				return space_number * multiplier;
				//console.log("not");
			}else{
				
			}
	}


function get_connection_string(libvirtstring)
	{
		var hypervisor_string = '';
		if (libvirtstring=='xen')
			{
				hypervisor_string = libvirtstring + ':///';
			}else{
				hypervisor_string = libvirtstring + ':///system';
			}
		return hypervisor_string;
	}

module.exports = {
	get_available_hypervisors: function(){
		
		var results = Array();
		
		var hypervisors = config.hypervisors;
		for (var i = 0;i < hypervisors.length; i++)
			{
				if (hypervisors[i].enabled === true)
					{
						if (default_hypervisor=='')
							{
								default_hypervisor = i;
							}
						results.push({name: hypervisors[i].name, id: hypervisors[i].libvirtstring});
					}
			}
		return results;
		
	},
	get_libvirt_version: function(callback){
		var version = libvirt.libvirt_version;
		if (callback)
			{
				callback(version)
			}else{
				return callback;
			}
	},
	
	volume: volume,
	device: device,
	iso_manager: iso_manager
}
