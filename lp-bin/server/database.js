var mongodb = require('mongodb');
var mongoclient = mongodb.MongoClient;
var mongostring = 'mongodb://localhost:27017/labproject';


module.exports = {
	find: function(collection_name,query,options,callback){
		mongoclient.connect(mongostring, function(err, db) {
			
			db.collection(collection_name).find(query,options).toArray(function(err, query_results){
					if (err)
						{
							console.log(err);
							throw new Error('Error in find query!');
						}
					callback(query_results);	
						
				});
			
			
			
		})
	},
	findOne: function(collection_name,query,callback){
		mongoclient.connect(mongostring, function(err, db) {
			var col = db.collection(collection_name)
			if (col)
				{
					col.findOne(query, function(err, query_result) {
						if (err)
							{
								console.log(err);
								throw new Error('Error in findOne query!');
							}
						callback(query_result);
					});
				}else{
					throw new Error('Invalid collection name ' + collection_name);
				}
			
		});
	},
	insert: function(collection_name, query,callback){
		mongoclient.connect(mongostring, function(err, db) {
			var col = db.collection(collection_name)
			if (col)
				{
					col.insert(query, {safe:true}, function(err, query_result) {
						if (err)
							{
								console.log(err);
								throw new Error('Error in insert query!');
							}
						callback(query_result);
					});
				}else{
					throw new Error('Invalid collection name ' + collection_name);
				}
			
		});
	},
	update: function(collection_name, query, do_all ,callback){
		
	},
	remove: function(collection_name,query,callback){
		mongoclient.connect(mongostring, function(err, db) {
			var col = db.collection(collection_name)
			if (col)
				{
					col.remove(query, {safe:true}, function(err, query_result) {
						if (err)
							{
								console.log(err);
								throw new Error('Error in remove query!');
							}
						callback(query_result);
					});
				}else{
					throw new Error('Invalid collection name ' + collection_name);
				}
			
		});
	}
}
