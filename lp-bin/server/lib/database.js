var LABPROJECT_BASE = process.cwd();
var LABPROJECT_SERVER_LIBS = LABPROJECT_BASE + "/server/lib";

var mongodb = require('mongodb');
var mongoclient = mongodb.MongoClient;
var mongostring = require(LABPROJECT_BASE + '/config').database_connection_string;


module.exports = {
	find: function(collection_name,query,options,callback){
		mongoclient.connect(mongostring, function(err, db) {
			var fields = {}
			if (options&&options.fields)
				{
					fields = options.fields;
				}
			var cursor = db.collection(collection_name).find(query, fields, options);
			if (cursor)
				{
					cursor.toArray(function(err, query_results){
					if (err)
						{
							callback({ERROR: err});
						}else{
							callback(query_results);
						}
							
						
					});
				}else{
					callback(false);
				}
			
			
			
			
		})
	},
	findOne: function(collection_name,query,callback){
		mongoclient.connect(mongostring, function(err, db) {
			var col = db.collection(collection_name)
			if (col)
				{
					col.findOne(query, function(err, query_results) {
						if (err)
							{
								callback({ERROR: err});
							}else{
								callback(query_results);
							}
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
					col.insert(query, {safe:true}, function(err, query_results) {
						if (err)
							{
								callback({ERROR: err});
							}else{
								callback(query_results);
							}
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
					col.update(query, update, options, function(err, query_results) {
						if (err)
							{
								callback({ERROR: err});							
							}else{
								callback(query_results);
							}

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
					col.remove(query, {safe:true}, function(err, query_results) {
						if (err)
							{
								callback({ERROR: err});
							}else{
								callback(query_results);
							}
					});
				}else{
					throw new Error('Invalid collection name ' + collection_name);
				}
			
		});
	}
}
