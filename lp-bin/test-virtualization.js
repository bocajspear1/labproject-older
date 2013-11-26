var virt = require('./server/lib/virtualization');

console.log("Available: ",virt.get_available_hypervisors());


virt.device.new_device({},function(){})

virt.device.get_hypervisor_devices('vbox',function(domains){
	console.log(domains);
});


virt.volume.create_volume(2048,'test','qed',function(result){
	
});

console.log("Got to the end");

