(function() {
	"use strict";
	var native = require('../lib/native');
	module.exports = function(val) {
		var type = typeof(val), hash = val;
		if(type === 'object' || type === 'function') {
			//Object hash are not guaranteed to be unique!
			hash = native.objectHash(val);
		}
		return type + ":" + hash;
	};
})();