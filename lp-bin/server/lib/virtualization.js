var LABPROJECT_BASE = process.cwd();
var LABPROJECT_SERVER_LIBS = process.cwd() + "/server/lib";


var database = require(LABPROJECT_BASE +'/server/database');
var libvirt = require('libvirt');
var config = require(LABPROJECT_BASE +'/config');
var os = require('os');
var uuid = require('node-uuid');
var disk = require(LABPROJECT_SERVER_LIBS + '/disk');

var pool_xml = '<pool type="dir"><name>labproject</name><target><path>' + config.pool_path + '</path></target></pool>'

var default_hypervisor = '';


var volume = {
		get_all_volumes: function(){
			
		},
		get_volume_info: function(){
			
		},
		create_volume: function(sizekb,name,type,callback){
			// Sanitize type and name input
			type = type.replace(/[^a-zA-Z]/,"");
			name = name.replace(/[^a-zA-Z\-_]/,"");
			
			// Check if the size given is valid
			if (isNaN(sizekb))
				{
					throw new Error('Invalid size');
				}
			
			
			volume.get_available_space(function(space){
				if (space!=null)
					{
						if (sizekb < space)
							{
													
								// Verify the pool exists
								verify_pool();
								
								//
								var hypervisor_string = get_connection_string(config.hypervisors[default_hypervisor].libvirtstring);
								var hypervisor = new libvirt.Hypervisor(hypervisor_string);
								
								var pool = hypervisor.lookupStoragePoolByName('labproject');
								var volume_xml = '<volume><name>'+ name + '.' + type + '</name><allocation>0</allocation><capacity unit="K">' + sizekb + '</capacity><target><path>' + config.pool_path + "/" + name +'.' + type + '</path><format type="' + type + '"/></target></volume>';
								console.log(volume_xml);
								var volume = pool.createVolume(volume_xml);
								console.log(volume.getName());
								//volume.remove();
							}else{
								console.log('bad');
								callback({error: 'Not enough space'});
							}
					}else{
						
					}
				
				
			});
			
		},
		remove_volume: function(){
			
		},
		import_volume: function(){
			
		},
		clone_volume: function(){
			
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
		var hypervisor_string = get_connection_string(hypervisor_string);
		var hypervisor = new libvirt.Hypervisor(hypervisor_string);
		
		var inactive_domains = hypervisor.getDefinedDomains();
		//console.log(inactive_domains);
		var active_domains = hypervisor.getActiveDomains();
		//console.log(active_domains);
		
		callback({inactive: inactive_domains,active: active_domains});
	},
	new_device: function(config,callback){
		var vm_name = config.name;
		var vm_mem = config.mem;
		var vm_description = config.description;
		var vm_uuid = '';
		var gen = false;
		while (gen === false)
			{
				vm_uuid = uuid.v1();
				gen = virt_util.verify_uuid(vm_uuid);
				console.log(vm_uuid);
			}
		var vm_disk_size = config.disk_size;
		var vm_init_iso = config.iso;
		
	},
	remove_device: function(){
		
	}
};

var network = {
	
}

var virt_util = {
	verify_uuid: function(uuid){
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
	}
}



function verify_pool()
	{
		
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
	get_available_hypervisors: function ()
	{
		console.log();
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
	device: device
}
