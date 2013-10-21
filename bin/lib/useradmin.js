var cryptojs = require('./cryptojs');
var mongodb = require('mongodb');
var mongoclient = mongodb.MongoClient;
var mongostring = 'mongodb://localhost:27017/labproject';
var DB;

mongoclient.connect(mongostring, function(err, db) {
	DB = db;
	})


module.exports = {
	get_all_users: function(callback){
		
		var all_users = [];
		
		DB.collection('users').find({}).toArray(function(err, results){
			for (var i =0; i < results.length;i++)
				{
					var single_user_data = {username: results[i].username, privileges: results[i].privileges}
					all_users.push(single_user_data);
				}
				callback(all_users);
				console.log(all_users);
		});
	},
};
