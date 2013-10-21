/*
 * Startup routine:
 * 		1: Show startup messages
 * 		2: Load config file
 * 		3: Connect to database
 * 
 */

// Include filesystem functionality
var config_fs = require('fs');
var server_logging = require('./server-log');

var mongoclient = require('mongodb').MongoClient;


module.exports = {
	/*
	 * Function: start
	 * 
	 * Author: Jacob Hartman, September 2013
	 * 
	 * Description: Starts the execution of startup routines, passes execution, and callback onto load_config
	 * 
	 * Input:
	 * 		config_path[string]: path to config file
	 * 		callback[function]: callback function that starts the server
	 * 
	 * Output:
	 * 		None
	 * 
	 * 
	 */
	start: function(config_path,callback){
			// Show startup messages
			server_logging.log_startup('\n\n*** LabProject v. 0.1 ***\n\n*** Starting LabProject Head server ***\n\n');
			
			// Do other start stuff here
			
			// Load the config file (step 2)
			this.load_config(config_path,callback);
		},
		
	/*
	 * Function: load_config
	 * 
	 * Author: Jacob Hartman, September 2013
	 * 
	 * Description: Loads the config file and passes execution on to 'connect_database' to connect to the database
	 * 
	 * Input:
	 * 		config_path[string]: path to config file
	 * 		callback[function]: callback function that starts the server
	 * 
	 * Output:
	 * 		None
	 * 
	 * 
	 */
	load_config: function(config_path,callback){
		
		var innerthis = this;
		
		// Read the config file
		config_fs.readFile(config_path, function (err, data) {
			// Check if an error has been made
			if (err) 
				{
					server_logging.log_error('\nError opening and reading config file.\n\n');
					throw err;
				}else{
					// Set notice that the config file has loaded
					server_logging.log_notice('Config file loaded.\n\n');
					
					// Parse the config file data
					var conf_file = data.toString();
					var parsed_data = JSON.parse(conf_file);
					
					innerthis.connect_database(parsed_data,callback);
					
				}
			});
	},
	connect_database: function(data,callback){
		// Database connection
		var DB;

		// Make connection to database
		mongoclient.connect(data.CONNECTION_STRING, function(err, db) {
			if (err)
				{
					server_logging.log_error('\nError connecting to database.\n\n');
				
					throw err;
				}
				// Set notice that the config file has loaded
				server_logging.log_notice('Connected to database.\n\n');
				
				callback(data,db);
			})
	}
}
