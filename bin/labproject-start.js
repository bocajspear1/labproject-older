// Startup for Labproject
var execute = require('child_process');
var color = require('cli-color');
var lib_dir = './lib/';

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
				
				//look for "Hello"
				var version_pattern =/[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2}/g;
				
				if (version_pattern.test(resp))
					{
						console.log(color.greenBright('\nLibvirt installed: Version ' + resp.trim()  + ' \n\n'));
						check_libvirt_running()
					}else{
						console.log(color.redBright('\nLibvirt is not installed. \n\n'));
						throw new Error(STARTUP_ERROR);
					}
				
			});
	}

var supported_providers = ['vbox','qemu','xen'];
var provider_count = 0;

function check_hypervisors()
	{
		console.log(color.blueBright.underline('Checking hypervisors installed...\n'));
		
		check_hypervisor(0)
		
	
	}
	
function check_hypervisor(number)
	{
		if (number == (supported_providers.length))
			{
				if (provider_count==0)
					{
						console.log(color.redBright('\nNo hypervisors installed. \n\n'));
						throw new Error(STARTUP_ERROR);
					}else{
						
						console.log('\n');
						check_login()
					}
				
			}else{
				var connection_string = '';
				
				  if (supported_providers[number]!='xen')
						{
							connection_string = 'virsh -c ' + supported_providers[number] + ':///system list';
						}else{
							connection_string = 'virsh -c ' + supported_providers[number] + ':/// list';
						}
				
				execute.exec(connection_string, function(err, resp) 
					{ 
						if (err!=null)
							{
								console.log(color.red(supported_providers[number] + ' is NOT installed\n'));
							}else{
								console.log(color.green(supported_providers[number] + ' is installed\n'));
								provider_count +=1;
							}
						check_hypervisor(number + 1)
					});
			}
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
