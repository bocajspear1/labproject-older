// For command line based virtualization access
var virtualbox = require('./virtualbox');
var exec = require('child_process').exec;
var os = require('os');


// Libvirt based virtualization
var libvirt = require('libvirt');
var Hypervisor = libvirt.Hypervisor;

// Needed for virtual machine registering
var mongodb = require('mongodb');
var mongoclient = mongodb.MongoClient;
var mongostring = 'mongodb://localhost:27017/labproject';
var DB;

// Setup database
mongoclient.connect(mongostring, function(err, db) {
	DB = db;
	})


module.exports = {
	get_all_providers: function(callback){
		var supported_providers = ['vbox','qemu','xen']
				
		var results = [];
		
		var libvirt_ver = '';
		
		for(var i = 0;i < supported_providers.length;i++)
			{
				
				try
				  {
					  var hypervisor;
					  if (supported_providers[i]!='xen')
						{
							hypervisor = new Hypervisor(supported_providers[i] + ':///system');
						}else{
							hypervisor = new Hypervisor(supported_providers[i] + ':///');
						}
				  
					
					
					results[i] = {name: supported_providers[i], available: 'yes', version: hypervisor.getVersion()};
					libvirt_ver = hypervisor.getLibVirtVersion();
				  }
				catch(err)
				  {
					console.log('Error: ' + err.message);
					results[i] = {name: supported_providers[i], available: 'no', version: ''};
					
				  }
				finally
				{
					if (typeof hypervisor != 'undefined')
						{
							hypervisor.closeConnection();
						}
					
				}
			}
			
		callback(results,libvirt_ver);
	},
	
	
	get_devices: function(provider, callback){
		if (provider=='virtualbox')
			{
				virtualbox.get_devices(callback);
			}
	},
	
	get_registered_devices : function(type,callback){
		if (type=='all')
			{
				DB.collection('registered_virtual_machines').find({}).toArray(function(err,results){
					
					if (results.length>0)
						{
							callback(results);
						}else{
							callback(Array());
						}
				});
			}else{
				DB.collection('registered_virtual_machines').find({type: type}).toArray(function(err,results){
					if (results.length>0)
						{
							callback(results);
						}else{
							callback(Array());
						}
				});
			}
		
	},
	
	register_device: function(name,provider,options, callback){
		
	},
	
	get_provider_info: function(name, callback){
		if (name=='virtualbox')
			{
				
			}
		
	},
	
	find_providers: function(){
		check_virtualbox();
		check_kvm();
		check_qemu();
	},
	
	get_provider_info: function(name, callback)
		{
			if (name=='virtualbox')
				{
					get_virtualbox_info(callback);
				}
		}
	
	
}

function get_virtualbox_info(callback)
	{
		var virtualbox_info = {};
		
		
		get_virtualbox_version(function(version){
			virtualbox_info.host = get_host_info();
			virtualbox_info.version = version;
			virtualbox_info.provider = 'VirtualBox';
			callback(virtualbox_info);
		});
		
		
	}

function get_host_info()
	{
		var host_info = {};
		host_info.type = os.type()
		host_info.arch = os.arch();
		host_info.total_mem = os.totalmem();
		host_info.cpus = os.cpus();
		host_info.interfaces = os.networkInterfaces();
		
		return host_info;
	}

function get_virtualbox_version(callback)
	{
		var child = exec("VBoxManage --version", function (error, stdout, stderr) {
		var version_pattern =(/\d+\.\d+\.\d+r\d+/);
		if (version_pattern.test(stdout))
			{
				if (!error)
					{
						callback(stdout.trim());
					}
			}else{
				console.log('Virtualbox info error');
			}
			
		});
	}
	


function check_virtualbox()
	{
			var child = exec("VBoxManage --version", function (error, stdout, stderr) {
			var version_pattern =(/\d+\.\d+\.\d+r\d+/);
			if (version_pattern.test(stdout))
				{
					console.log("VirtualBox is installed");
					
					var virtualbox_installed = {name:'virtualbox', version: stdout.trim()};
					console.log(virtualbox_installed);
					
				}else{
					console.log("VirtualBox not installed:" + stdout);
				}
			
			});
	}
	
function check_kvm()
	{
		
	}
	
function check_qemu()
	{
		
	}
