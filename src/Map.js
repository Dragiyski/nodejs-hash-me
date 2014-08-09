module.exports = (function() {
	"use strict";
	var hash = require('./hash');

	/**
	 * Map is a collection mapping unique keys to values.
	 * Since hashes are not unique, map must store them in a way multiple values to be allowed to have the same hash and
	 * still be distinguished. The only secure way to distinguish values is strict equality.
	 * @constructor
	 */
	function Map() {
		if(!(this instanceof Map)) {
			return new Map();
		}
		Object.defineProperties(this, {
			'_keys': {
				'value': {}
			},
			'_values': {
				'value': {}
			}
		});
	}

	Map.prototype = Object.create(Object.prototype, {
		'constructor': {
			'value': Map
		},
		'name': {
			'value': 'Map'
		},
		'length': {
			'enumerable': true,
			'get': function() {
				var l = 0;
				for(var i in this._keys) {
					l += this._keys[i].length;
				}
				return l;
			}
		},
		//Modifiers
		'set': {
			'enumerable': true,
			'value': function(key, value) {
				var hashKey = hash(key);
				if(this._keys[hashKey] instanceof Array) {
					var index = this._keys[hashKey].indexOf(key);
					if(index < 0) {
						this._values[hashKey].push(value);
						this._keys[hashKey].push(key);
					} else {
						this._values[hashKey][index] = value;
					}
				} else {
					this._values[hashKey] = [value];
					this._keys[hashKey] = [key];
				}
			}
		},
		'delete': {
			'enumerable': true,
			'value': function(key) {
				var hashKey = hash(key);
				if(this._keys[hashKey] instanceof Array) {
					var index = this._keys[hashKey].indexOf(key);
					if(index < 0) {
						return false;
					}
					this._keys[hashKey].splice(index, 1);
					this._values[hashKey].splice(index, 1);
					if(this._keys[hashKey].length === 0) {
						delete this._keys[hashKey];
						delete this._values[hashKey];
					}
					return true;
				}
				return false;
			}
		},
		//Readers
		'get': {
			'enumerable': true,
			'value': function(key) {
				var hashKey = hash(key);
				if(this._keys[hashKey] instanceof Array) {
					var index = this._keys[hashKey].indexOf(key);
					if(index < 0) {
						return;
					}
					return this._values[hashKey][index];
				}
			}
		},
		'has': {
			'enumerable': true,
			'value': function(key) {
				var hashKey = hash(key);
				if(this._keys[hashKey] instanceof Array) {
					return this._keys[hashKey].indexOf(key) !== -1;
				}
				return false;
			}
		},
		//Iterators
		'forEach': {
			'enumerable': true,
			'value': function (callback, thisArg) {
				var i, j;
				for (i in this._keys) {
					for (j = 0; j < this._keys[i].length; ++j) {
						callback.call(thisArg, this._values[i][j], this._keys[i][j], this);
					}
				}
			}
		},
		'every': {
			'enumerable': true,
			'value': function (callback, thisArg) {
				var i, j;
				for (i in this._keys) {
					for (j = 0; j < this._keys[i].length; ++j) {
						if (!callback.call(thisArg, this._values[i][j], this._keys[i][j], this)) {
							return false;
						}
					}
				}
				return true;
			}
		},
		'some': {
			'enumerable': true,
			'value': function (callback, thisArg) {
				var i, j;
				for (i in this._keys) {
					for (j = 0; j < this._keys[i].length; ++j) {
						if (callback.call(thisArg, this._values[i][j], this._keys[i][j], this)) {
							return true;
						}
					}
				}
				return false;
			}
		},
		'filter': {
			'enumerable': true,
			'value': function (callback, thisArg) {
				var i, j, k = {}, v = {};
				for (i in this._keys) {
					for (j = 0; j < this._keys[i].length; ++j) {
						if (callback.call(thisArg, this._values[i][j], this._keys[i][j], this)) {
							if(!(k[i] instanceof Array)) {
								k[i] = [];
								v[i] = []
							}
							k[i].push(this._keys[i][j]);
							v[i].push(this._values[i][j]);
						}
					}
				}
				//Although we are not calling the construtor
				//returned object is instanceof Map and has exactly the same properties.
				return Object.create(Map.prototype, {
					'_keys': {
						'value': k
					},
					'_values': {
						'value': v
					}
				});
			}
		},
		'reduce': {
			'enumerable': true,
			'value': function (callback, value, thisArg) {
				var i, j;
				for (i in this._keys) {
					for (j = 0; j < this._keys[i].length; ++j) {
						value = callback.call(thisArg, value, this._values[i][j], this._keys[i][j], this);
					}
				}
				return value;
			}
		},
		'find': {
			'enumerable': true,
			'value': function (callback, thisArg) {
				var i, j;
				for (i in this._keys) {
					for (j = 0; j < this._keys[i].length; ++j) {
						if(callback.call(thisArg, this._values[i][j], this._keys[i][j], this)) {
							return this._values[i][j];
						}
					}
				}
			}
		},
		'findKey': {
			'enumerable': true,
			'value': function (callback, thisArg) {
				var i, j;
				for (i in this._keys) {
					for (j = 0; j < this._keys[i].length; ++j) {
						if(callback.call(thisArg, this._values[i][j], this._keys[i][j], this)) {
							return this._keys[i][j];
						}
					}
				}
			}
		},
		//Method that result new map from the current map (and others)
		/**
		 * Merge maps, the method is similar to array_merge in PHP.
		 * All key-values from current map are taken.
		 * Then every specified map as argument is iterated.
		 * If key in iterated map is already taken, its value are replaced by current iterating map.
		 * Otherwise key-value is taken.
		 *
		 * This will essentially result as merge current map and a chain of maps in arguments.
		 * If map is specified later in arguments, its override the values in previous map is key clashes.
		 */
		'merge': {
			'enumerable': true,
			'value': function() {
				if(arguments.length === 0) {
					throw new TypeError('Merge require one or more maps to merge with current map.');
				}
				var i, j, a, k = {}, v = {}, index;
				for (i in this._keys) {
					k[i] = this._keys.slice(0);
					v[i] = this._values.slice(0);
				}
				for(a = 0; a < arguments.length; ++a) {
					if(!(arguments[a] instanceof Map)) {
						throw new TypeError('Expected all arguments to be [object Map], got ' + Object.prototype.toString.call(arguments[a]));
					}
					for(i in arguments[a]._keys) {
						if(!(k[i] instanceof Array)) {
							k[i] = [];
							v[i] = [];
						}
						for(j = 0; j < arguments[a]._keys[i].length; ++j) {
							if((index = k[i].indexOf(arguments[a]._keys[i][j])) === -1) {
								k[i].push(arguments[a]._keys[i][j]);
								v[i].push(arguments[a]._values[i][j]);
							} else {
								v[i][index] = arguments[a]._values[i][j];
							}
						}
					}
				}
				//Although we are not calling the construtor
				//returned object is instanceof Map and has exactly the same properties.
				return Object.create(Map.prototype, {
					'_keys': {
						'value': k
					},
					'_values': {
						'value': v
					}
				});
			}
		},
		'keys': {
			'enumerable': true,
			'value': function() {
				return Array.prototype.concat.apply([], Object.getOwnPropertyNames(this._keys).map(function(h) { return this._keys[h] }, this));
			}
		},
		'values': {
			'enumerable': true,
			'value': function() {
				return Array.prototype.concat.apply([], Object.getOwnPropertyNames(this._values).map(function(h) { return this._values[h] }, this));
			}
		},
		'isEmpty': {
			'enumerable': true,
			'value': function() {
				Object.getOwnPropertyNames(this._keys).length === 0;
			}
		}
	});
	return Map;
})();