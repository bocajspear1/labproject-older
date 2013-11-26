var LABPROJECT_BASE = process.cwd();
var LABPROJECT_SERVER_LIBS = LABPROJECT_BASE + "/server/lib";

var database = require(LABPROJECT_SERVER_LIBS + '/database');

module.exports = {
	get_stored_isos: function(callback){
		database.find('isos',{},{},function(results){
			
		});
	},
	get_iso_info: function(iso_id, callback){
		
	},
	new_iso: function(url, name, version, verify, callback){
		
	}
}
