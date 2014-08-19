(function() {
	"use strict";
	var Map = require('./Map'),
		Connection = module.exports = function() {
			if(!(this instanceof Connection)) {
				return new Connection;
			}
			Object.defineProperties(this, {
				'_left': {
					'value': new Map()
				},
				'_right': {
					'value': new Map()
				}
			});
		};
	Connection.prototype = Object.create(Map.prototype, {
		'constructor': {
			'value': Connection
		},
		'name': {
			'value': 'Connection'
		},
		'length': {
			'enumerable': true,
			'get': function() {
				return this.reduce(function(previous) {
					return previous + 1;
				}, 0, this);
			}
		},
		'set': {
			'enumerable': true,
			'value': function(left, right, value) {
				var ls = this._left.get(left), rs = this._right.get(right);
				if(!(ls instanceof Map)) {
					this._left.set(left, ls = new Map());
				}
				if(!(rs instanceof Map)) {
					this._right.set(right, rs = new Map());
				}
				var lres = ls.set(right, value);
				var rres = rs.set(left, value);
				return lres || rres;
			}
		},
		'get': {
			'enumerable': true,
			'value': function(left, right) {
				var m = this._left.get(left);
				if(m instanceof Map) {
					return m.get(right);
				}
			}
		},
		'has': {
			'enumerable': true,
			'value': function (left, right) {
				var s = this._left.get(left);
				if(s instanceof Map) {
					return s.has(right);
				}
				return false;
			}
		},
		'delete': {
			'enumerable': true,
			'value': function (left, right) {
				var ls = this._left.get(left), rs = this._right.get(right);
				if((ls instanceof Map) && (rs instanceof Map)) {
					ls.delete(right);
					rs.delete(left);
					return true;
				}
				return false;
			}
		},
		'leftOf': {
			'enumerable': true,
			'value': function (right) {
				var s = this._right.get(right), k = {}, v = {}, i;
				if(!(s instanceof Map)) {
					return new Map();
				}
				for(i in s._keys) {
					k[i] = s._keys[i].slice(0);
				}
				for(i in s._values) {
					v[i] = s._values[i].slice(0);
				}
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
		'rightOf': {
			'enumerable': true,
			'value': function (left) {
				var s = this._left.get(left), k = {}, v = {}, i;
				if(!(s instanceof Map)) {
					return new Map();
				}
				for(i in s._keys) {
					k[i] = s._keys[i].slice(0);
				}
				for(i in s._values) {
					v[i] = s._values[i].slice(0);
				}
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
		'forEach': {
			'enumerable': true,
			'value': function(cb, thisArg) {
				if(typeof(cb) !== 'function') {
					throw new TypeError(Object.prototype.toString.call(cb) + ' is not a function');
				}
				this._left.forEach(function(s, l) {
					s.forEach(function(v, r) {
						cb.call(thisArg, v, l, r, this);
					}, this);
				}, this);
				return this;
			}
		},
		'every': {
			'enumerable': true,
			'value': function(cb, thisArg) {
				if(typeof(cb) !== 'function') {
					throw new TypeError(Object.prototype.toString.call(cb) + ' is not a function');
				}
				return this._left.every(function(s, l) {
					return s.every(function(v, r) {
						return cb.call(thisArg, v, l, r, this);
					}, this);
				}, this);
			}
		},
		'some': {
			'enumerable': true,
			'value': function(cb, thisArg) {
				if(typeof(cb) !== 'function') {
					throw new TypeError(Object.prototype.toString.call(cb) + ' is not a function');
				}
				return this._left.some(function(s, l) {
					return s.some(function(v, r) {
						return cb.call(thisArg, v, l, r, this);
					}, this);
				}, this);
			}
		},
		'filter': {
			'enumerable': true,
			'value': function(cb, thisArg) {
				if(typeof(cb) !== 'function') {
					throw new TypeError(Object.prototype.toString.call(cb) + ' is not a function');
				}
				var n = new Connection();
				this.forEach(function(v, l, r) {
					if(cb.call(thisArg, v, l, r, this)) {
						n.set(l, r, v);
					}
				}, this);
				return n;
			}
		},
		'reduce': {
			'enumerable': true,
			'value': function(cb, value, thisArg) {
				if(typeof(cb) !== 'function') {
					throw new TypeError(Object.prototype.toString.call(cb) + ' is not a function');
				}
				this.forEach(function(v, l, r) {
					value = cb.call(thisArg, value, v, l, r, this);
				}, this);
				return value;
			}
		},
		'find': {
			'enumerable': true,
			'value': function (cb, thisArg) {
				if(typeof(cb) !== 'function') {
					throw new TypeError(Object.prototype.toString.call(cb) + ' is not a function');
				}
				var result;
				this.some(function(v, l, r) {
					if(cb.call(thisArg, v, l, r, this)) {
						result = v;
						return true;
					}
					return false;
				}, this);
				return result;
			}
		},
		'findKey': {
			'enumerable': true,
			'value': function (cb, thisArg) {
				if(typeof(cb) !== 'function') {
					throw new TypeError(Object.prototype.toString.call(cb) + ' is not a function');
				}
				var result;
				this.some(function(v, l, r) {
					if(cb.call(thisArg, v, l, r, this)) {
						result = [l, r];
						return true;
					}
					return false;
				}, this);
				return result;
			}
		},
		'merge': {
			'enumerable': true,
			'value': function() {
				var n = new Connection(), i;
				this.forEach(function(v, l, r) {
					n.set(l, r, v);
				});
				for(i = 0; i < arguments.length; ++i) {
					if(!(arguments[i] instanceof Connection)) {
						throw new TypeError('Expected arguments[0] to be [object Relation], got ' + Object.prototype.toString.call(arguments[i]));
					}
					arguments[i].forEach(function(v, l, r) {
						n.set(l, r, v);
					});
				}
				return n;
			}
		},
		'keys': {
			'enumerable': true,
			'value': function() {
				var n = [];
				this.forEach(function(v, l, r) {
					n.push([l, r]);
				});
				return n;
			}
		},
		'values': {
			'enumerable': true,
			'value': function() {
				var n = [];
				this.forEach(function(v, l, r) {
					n.push(v);
				});
				return n;
			}
		},
		'isEmpty': {
			'enumerable': true,
			'value': function() {
				return this._left.isEmpty() && this._right.isEmpty();
			}
		}
	});
})();