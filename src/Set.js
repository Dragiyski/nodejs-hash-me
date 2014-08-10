module.exports = (function() {
	"use strict";
	var hash = require('./hash');

	function Set() {
		if(!(this instanceof Set)) {
			return new Set();
		}
		Object.defineProperties(this, {
			'_values': {
				'value': {}
			}
		});
	}

	Set.prototype = Object.create(Object.prototype, {
		'constructor': {
			'value': Set
		},
		'name': {
			'value': 'Set'
		},
		'length': {
			'enumerable': true,
			'get': function() {
				var l = 0;
				for(var i in this._values) {
					l += this._values[i].length;
				}
				return l;
			}
		},
		'add': {
			'enumerable': true,
			'value': function(value) {
				var hashKey = hash(value);
				if(!(this._values[hashKey] instanceof Array)) {
					this._values[hashKey] = [value];
				} else if(this._values[hashKey].indexOf(value) === -1) {
					this._values[hashKey].push(value);
				}
			}
		},
		'has': {
			'enumerable': true,
			'value': function(value) {
				var hashKey = hash(value);
				if(this._values[hashKey] instanceof Array) {
					return this._values[hashKey].indexOf(value) !== -1;
				}
				return false;
			}
		},
		'delete': {
			'enumerable': true,
			'value': function(value) {
				var hashKey = hash(value);
				if(this._values[hashKey] instanceof Array) {
					var index = this._values[hashKey].indexOf(value);
					if(index !== -1) {
						this._values[hashKey].splice(index, 1);
						if(this._values[hashKey].length === 0) {
							delete this._values[hashKey];
						}
						return true;
					}
				}
				return false;
			}
		},
		'forEach': {
			'enumerable': true,
			'value': function (callback, thisArg) {
				var i, j;
				for (i in this._values) {
					for (j = 0; j < this._values[i].length; ++j) {
						callback.call(thisArg, this._values[i][j], this);
					}
				}
			}
		},
		'every': {
			'enumerable': true,
			'value': function (callback, thisArg) {
				var i, j;
				for (i in this._values) {
					for (j = 0; j < this._values[i].length; ++j) {
						if(!callback.call(thisArg, this._values[i][j], this)) {
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
				for (i in this._values) {
					for (j = 0; j < this._values[i].length; ++j) {
						if(callback.call(thisArg, this._values[i][j], this)) {
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
				var i, j, v = {};
				for (i in this._values) {
					for (j = 0; j < this._values[i].length; ++j) {
						if(callback.call(thisArg, this._values[i][j], this)) {
							if(!(v[i] instanceof Array)) {
								v[i] = [];
							}
							v[i].push(this._values[i][j]);
						}
					}
				}
				return Object.create(Set.prototype, {
					'_values': {
						'value': v
					}
				});
			}
		},
		'reduce': {
			'enumerable': true,
			'value': function(callback, value, thisArg) {
				var i, j;
				for (i in this._values) {
					for (j = 0; j < this._values[i].length; ++j) {
						value = callback.call(thisArg, value, this._values[i][j], this);
					}
				}
				return value;
			}
		},
		'find': {
			'enumerable': true,
			'value': function(callback, thisArg) {
				var i, j;
				for (i in this._values) {
					for (j = 0; j < this._values[i].length; ++j) {
						if(callback.call(thisArg, this._values[i][j], this)) {
							return this._values[i][j];
						}
					}
				}
			}
		},
		'union': {
			'enumerable': true,
			'value': function(set) {
				if(!(set instanceof Set)) {
					throw new TypeError('Expected arguments[0] to be [object Set], got ' + Object.prototype.toString.call(set));
				}
				var i, j, v = {};
				for(i in this._values) {
					for(j = 0; j < this._values[i].length; ++j) {
						if(!(v[i] instanceof Array)) {
							v[i] = [];
						}
						v[i].push(this._values[i][j]);
					}
				}
				for(i in set._values) {
					for(j = 0; j < set._values[i].length; ++j) {
						if(!(v[i] instanceof Array)) {
							v[i] = [];
						}
						v[i].push(set._values[i][j]);
					}
				}
				return Object.create(Set.prototype, {
					'_value': {
						'value': v
					}
				});
			}
		},
		'intersection': {
			'enumerable': true,
			'value': function(set) {
				if(!(set instanceof Set)) {
					throw new TypeError('Expected arguments[0] to be [object Set], got ' + Object.prototype.toString.call(set));
				}
				var i, j, v = {};
				for(i in this._values) {
					for(j = 0; j < this._values[i].length; ++j) {
						if(set.has(v[i][j])) {
							if (!(v[i] instanceof Array)) {
								v[i] = [];
							}
							v[i].push(this._values[i][j]);
						}
					}
				}
				return Object.create(Set.prototype, {
					'_value': {
						'value': v
					}
				});
			}
		},
		'subtract': {
			'enumerable': true,
			'value': function(set) {
				if(!(set instanceof Set)) {
					throw new TypeError('Expected arguments[0] to be [object Set], got ' + Object.prototype.toString.call(set));
				}
				var i, j, v = {};
				for(i in this._values) {
					for(j = 0; j < this._values[i].length; ++j) {
						if(!set.has(v[i][j])) {
							if (!(v[i] instanceof Array)) {
								v[i] = [];
							}
							v[i].push(this._values[i][j]);
						}
					}
				}
				return Object.create(Set.prototype, {
					'_value': {
						'value': v
					}
				});
			}
		},
		'subsetOf': {
			'enumerable': true,
			'value': function(set) {
				if(!(set instanceof Set)) {
					throw new TypeError('Expected arguments[0] to be [object Set], got ' + Object.prototype.toString.call(set));
				}
				var i, j;
				for(i in this._values) {
					for (j = 0; j < this._values[i].length; ++j) {
						if (!set.has(this._values[i][j])) {
							return false;
						}
					}
				}
				return true;
			}
		},
		'equals': {
			'enumerable': true,
			'value': function(set) {
				return this.subsetOf(set) && set.subsetOf(this);
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
				return Object.getOwnPropertyNames(this._values).length === 0;
			}
		}
	});
	return Set;
})();