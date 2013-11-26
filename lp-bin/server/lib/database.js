var mongodb = require('mongodb');
var mongoclient = mongodb.MongoClient;
var mongostring = require('../config').database_connection_string;


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
	update: function(collection_name, query, update, do_all ,callback){
		mongoclient.connect(mongostring, function(err, db) {
			var col = db.collection(collection_name)
			if (col)
				{
					var options = {safe:true}
					if (do_all === true)
						{
							options.multi = true;
						}
					col.update(query, update, options, function(err, query_result) {
						if (err)
							{
								console.log(err);
								throw new Error('Error in update query!');
							}
						callback(query_result);
					});
				}else{
					throw new Error('Invalid collection name ' + collection_name);
				}
			
		});
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
