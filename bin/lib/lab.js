/*
 * Module: lab
 * 
 * Description: This module manages the actual labs, like saving, loading, and removing the actual lab
 * 
 */

// Include module for system logging
var server_logging = require('./server-log');

// Include module for database access
var mongodb = require('mongodb');
var mongoclient = mongodb.MongoClient;
var mongostring = 'mongodb://localhost:27017/labproject';
var DB;

// Make the connection to the database
mongoclient.connect(mongostring, function(err, db) {
	DB = db;
	})

module.exports = {
	create_lab: function(user,name,callback){
		var lab_table = DB.collection('labs');
		
		//lab_table.save(
		
		callback();
	},
	save_lab: function(user,name,callback){
		
	},
	load_lab: function(user,name,callback){
		
	},
	remove_lab: function(user,name,callback){
		
	},
	get_saved_labs: function(callback){
		
	}
	
}
