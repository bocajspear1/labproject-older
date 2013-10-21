socket.on('notice', function (data) {
	add_message(data.message,'notice');
	
});

socket.on('warning', function (data) {
	add_message(data.message,'warning');
	
});
