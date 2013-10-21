function check_connection()
	{
		socket.emit('test', {})
		if(socket.socket.connected)
			{
				$("#lost-connection").css('display','none');
				$("#lost-connection-text").css('display','none');
			}else{
				$("#lost-connection").css('display','block');
				$("#lost-connection-text").css('display','block');
			}
		setInterval(check_connection,2000);
	}

check_connection();
