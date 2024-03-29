

function mongodb_node_session(values)
	{
		// Holds the connection string
		this.connection_string = values.connection_string;
		
		this.mongoclient = require('mongodb').MongoClient;
		
		this.on_save = '';
		
		this.on_destroy = '';
		
		this.session_expire_time = '';
		
		this.save_session = save_session;
		function save_session(sessionid,data,callback)
			{
				if (!this.connection_string)	
					{
						throw new Error('No connection string was defined');
					}
					
				var innerthis = this;
				
				this.mongoclient.connect(this.connection_string,function(err,db){
					
					db.collection('node_sessions').findOne({sessionid: sessionid}, function(err,session){
						var base_timestamp = new Date().getTime();
					
						var timestamp = base_timestamp + (innerthis.session_expire_time * 1000);
						
						var serialized_data = JSON.stringify(data);
						
						if (typeof(this.on_save) == "function")
							{
								this.on_save(sessionid,data)
							}
						
						if (session)
							{
								
								db.collection('node_sessions').save({_id: session._id,sessionid: sessionid, data: serialized_data, expires: timestamp}, {safe: true}, function(err, records){
									if (err)
										{
											throw err;
										}
									callback();
									
								});
							}else{
								
								db.collection('node_sessions').save({sessionid: sessionid, data: serialized_data, expires: timestamp}, {safe: true}, function(err, records){
									if (err)
										{
											throw err;
										}
									callback();
									
								});
							}
					});
					
					
					
				});
			}
			
		this.get_session= get_session;
		function get_session(sessionid,callback)
			{console.log('start session get');
				if (!this.connection_string)	
					{
						throw new Error('No connection string was defined');
					}
				
					
				this.mongoclient.connect(this.connection_string,function(err,db){
					
					if (err)
						{
							console.log(err);
							throw new Error('Error in database connection');
						}
					db.collection('node_sessions').findOne({sessionid: sessionid}, function(err,session){
						
						if (session!=null)
							{
								var temp = session.data;
								session.data = JSON.parse(temp);
								callback(session);
							}else{
								console.log('found no session');
								callback(null);
							}
					}); 
				
				
				});	
			}
		
		this.destroy_session = destroy_session;
		function destroy_session(sessionid, callback)
			{
				if (!this.connection_string)	
					{
						throw new Error('No connection string was defined');
					}
				
				var innerthis = this;
				
				this.mongoclient.connect(this.connection_string,function(err,db){
						if (!err)
							{
								if (typeof(innerthis.on_destroy) == "function")
										{
											var session_data = innerthis.get_session(sessionid,function(session){
												innerthis.on_destroy(sessionid,session_data)
											});
											
										}
								
								db.collection('node_sessions').remove({sessionid: sessionid},{safe: true}, function(err, records){
										console.log('in delete');
										callback(records);
									}); 
							}else{
								console.log(err);
							}
					});
			}
		

		this.cleanup = cleanup;
		function cleanup(callback)
			{
				
				if (!this.connection_string)	
					{
						throw new Error('No connection string was defined');
					}
				
				var innerthis = this;
				
				this.mongoclient.connect(this.connection_string,function(err,db){
					if (!err)
						{
							var current_timestamp = new Date().getTime();
							
							db.collection('node_sessions').find({expires: {$lte: current_timestamp}}).toArray(function(err, results){
								if (results.length == 0)
									{
										callback();
									}
								
								for(var i = 0;i < results.length;i++)
									{
										var result = results[i];
										console.log('delete');
										
										
										if (i == results.length - 1)
											{
												innerthis.destroy_session(result.sessionid,callback);
											}else{
												innerthis.destroy_session(result.sessionid,function(){});
											}
										
										
									}
									//callback();
							});
							
						}else{
							
						}
				});
			}
	}

module.exports = {
	session_storage: mongodb_node_session
}
