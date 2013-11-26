// Startup for Labproject
var execute = require('child_process');
var color = require('cli-color');
var config = require('./config');

console.log('\033[2J');
console.log(color.cyanBright('\n\n*** Welcome to LabProject v. 0.1 ***\n\n'))

console.log(color.cyanBright('*** Start process for LabProject VM Server ***\n\n'))


var STARTUP_ERROR = 'An startup error occured';


check_sudo();

function check_sudo(next)
	{
		execute.exec('whoami', function(err, resp) 
			{ 
			if (resp.trim() == 'root')
				{
					console.log(color.blueBright.underline('Checking sudo...'));
					console.log(color.greenBright('\nSudo access is enabled\n\n'));
					check_libvirt()
				}else{
					console.log(color.redBright('\nNot being run as sudo!\n\n'));
					throw new Error(STARTUP_ERROR);
				}
			});
	}


function check_libvirt()
	{
		console.log(color.blueBright.underline('Checking if libvirt is installed...'));
		execute.exec('virsh -v', function(err, resp) 
			{ 
				
				
				var version_pattern =/[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2}/g;
				
				if (version_pattern.test(resp))
					{
						console.log(color.greenBright('\nLibvirt installed: Version ' + resp.trim()  + ' \n\n'));
						check_libvirt_running()
					}else{
						console.log(color.redBright('\nLibvirt is not installed\n\n'));
						throw new Error(STARTUP_ERROR);
					}
				
			});
	}



function check_hypervisors()
	{
		var hypervisors = config.hypervisors;
		
		console.log(color.blueBright.underline('Checking hypervisors installed...\n'));
		var enabled_count = 0;
		
		for (var i = 0;i < hypervisors.length;i++)
			{
				if (hypervisors[i].enabled === true)
					{
						enabled_count+=1;
						check_hypervisor(hypervisors[i].libvirtstring);
					}
				
			}
			
		if (enabled_count==0)
			{
				console.log(color.redBright('\nNo hypervisors enabled \n\n'));
				throw new Error(STARTUP_ERROR);
			}
	}
	
function check_hypervisor(libvirtstring)
	{
	
			var connection_string = '';
			
			  if (libvirtstring!='xen')
					{
						connection_string = 'virsh -c ' + libvirtstring + ':///system list';
					}else{
						connection_string = 'virsh -c ' + libvirtstring + ':/// list';
					}
				
				execute.exec(connection_string, function(err, resp) 
					{ 
						if (err!=null)
							{
								console.log(err);
								console.log(color.red(libvirtstring + ' is NOT installed, but enabled\n'));
								throw new Error(STARTUP_ERROR);
							}else{
								console.log(color.green(libvirtstring + ' is installed and ready\n'));
								
							}
					});
	}

function check_libvirt_running()
	{
		console.log(color.blueBright.underline('Checking is Libvirt is running...\n'));
		
		execute.exec("ps -ewwo args | grep libvirtd", function(err, resp) 
			{ 
				var lines = resp.split(/\n/);
				var isrunning = false;
				
				for(var i = 0;i < lines.length;i++)
					{
						
						
						var nametest=/^libvirtd/g;
						
						var teststring = lines[i].trim()
						
						if (nametest.test(teststring))
							{
								
								isrunning = true;
								
							}
					}
				
				if (isrunning === true)
					{
						console.log(color.greenBright('Libvirt is running\n\n'));
						check_hypervisors();
					}else{
						console.log(color.redBright('\nLibvirt is not running \n\n'));
						
						
						
						throw new Error(STARTUP_ERROR);
					}
			});
	}

function check_login()
	{
		var cryptojs = require(lib_dir + 'cryptojs');
		var mongoclient = require('mongodb').MongoClient;
		var mongostring = 'mongodb://localhost:27017/labproject';
		var DB;

		mongoclient.connect(mongostring, function(err, db) {
			db.collection('users').find({}).toArray(function(err, results){
										
					if (results.length == 0)
						{
							console.log(color.red('\nNo users defined... \n\n'));
							var init_admin = cryptojs.pbkdf2_generate('admin',256,500);
							console.log(init_admin);
							
							var admin_user = {username: 'admin', salt: init_admin[1], password: init_admin[0], privileges: {users: true,devices: true}};
							
							console.log(color.blue('\nInserting user \'admin\' with password \'admin\' \n\n'));
							db.collection('users').insert(admin_user, function (err, inserted) {
									if (err)
										{
											throw err;
										}else{
											console.log(color.greenBright('Admin added successfully\n\n'));
										}
								});
						}else{
							
						}
					
					db.close();
				});
			})
	}
