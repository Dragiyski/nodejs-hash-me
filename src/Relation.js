(function() {
	"use strict";
	var Map = require('./Map'),
		Set = require('./Set'),
		Relation = module.exports = function() {
			if(!(this instanceof Relation)) {
				return new Relation;
			}
			this._left = new Map();
			this._right = new Map();
	};
	Relation.prototype = Object.create(Set.prototype, {
		'constructor': {
			'value': Relation
		},
		'name': {
			'value': 'Relation'
		},
		'length': {
			'enumerable': true,
			'get': function() {
				return this.reduce(function(previous) {
					return previous + 1;
				}, 0, this);
			}
		},
		'add': {
			'enumerable': true,
			'value': function(left, right) {
				var ls = this._left.get(left), rs = this._right.get(right);
				if(!(ls instanceof Set)) {
					this._left.set(left, ls = new Set());
				}
				if(!(rs instanceof Set)) {
					this._right.set(right, rs = new Set());
				}
				var lres = ls.add(right);
				var rres = rs.add(left);
				return lres || rres;
			}
		},
		'has': {
			'enumerable': true,
			'value': function (left, right) {
				var s = this._left.get(left);
				if(s instanceof Set) {
					return s.has(right);
				}
				return false;
			}
		},
		'delete': {
			'enumerable': true,
			'value': function (left, right) {
				var ls = this._left.get(left), rs = this._right.get(right);
				if((ls instanceof Set) && (rs instanceof Set)) {
					ls.delete(right);
					rs.delete(left);
					return true;
				}
				return false;
			}
		},
		'clear': {
			'enumerable': true,
			'value': function () {
				this._left.clear();
				this._right.clear();
				return this;
			}
		},
		'leftOf': {
			'enumerable': true,
			'value': function (right) {
				var s = this._right.get(right), v = {}, i;
				if(!(s instanceof Set)) {
					return new Set();
				}
				for(i in s._values) {
					v[i] = s._values[i].slice(0);
				}
				var o = Object.create(Set.prototype);
				o._values = v;
				return o;
			}
		},
		'rightOf': {
			'enumerable': true,
			'value': function (left) {
				var s = this._left.get(left), v = {}, i;
				if(!(s instanceof Set)) {
					return new Set();
				}
				for(i in s._values) {
					v[i] = s._values[i].slice(0);
				}
				var o = Object.create(Set.prototype);
				o._values = v;
				return o;
			}
		},
		'forEach': {
			'enumerable': true,
			'value': function(cb, thisArg) {
				if(typeof(cb) !== 'function') {
					throw new TypeError(Object.prototype.toString.call(cb) + ' is not a function');
				}
				this._left.forEach(function(s, l) {
					s.forEach(function(r) {
						cb.call(thisArg, l, r, this);
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
					return s.every(function(r) {
						return cb.call(thisArg, l, r, this);
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
					return s.some(function(r) {
						return cb.call(thisArg, l, r, this);
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
				var n = new Relation();
				this.forEach(function(l, r) {
					if(cb.call(thisArg, l, r, this)) {
						r.add(l, r);
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
				this.forEach(function(l, r) {
					value = cb.call(thisArg, value, l, r, this);
				}, this);
				return value;
			}
		},
		'find': {
			'enumerable': true,
			'value': function(cb, thisArg) {
				if(typeof(cb) !== 'function') {
					throw new TypeError(Object.prototype.toString.call(cb) + ' is not a function');
				}
				var result;
				return this.some(function(l, r) {
					if(cb.call(thisArg, l, r, this)) {
						result = [l, r];
						return true;
					}
					return false;
				}, this);
			}
		},
		'union': {
			'enumerable': true,
			'value': function(relation) {
				if(!(relation instanceof Relation)) {
					throw new TypeError('Expected arguments[0] to be [object Relation], got ' + Object.prototype.toString.call(relation));
				}
				var r = new Relation();
				this.forEach(function(l, r) {
					r.add(l, r);
				});
				relation.forEach(function(l, r) {
					r.add(l, r);
				});
				return r;
			}
		},
		'intersection': {
			'enumerable': true,
			'value': function(relation) {
				if(!(relation instanceof Relation)) {
					throw new TypeError('Expected arguments[0] to be [object Relation], got ' + Object.prototype.toString.call(relation));
				}
				return this.filter(function(l, r) {
					return relation.has(l, r);
				});

			}
		},
		'subtract': {
			'enumerable': true,
			'value': function(relation) {
				if(!(relation instanceof Relation)) {
					throw new TypeError('Expected arguments[0] to be [object Relation], got ' + Object.prototype.toString.call(relation));
				}
				return this.filter(function(l, r) {
					return !relation.has(l, r);
				});
			}
		},
		'subsetOf': {
			'enumerable': true,
			'value': function(relation) {
				if(!(relation instanceof Relation)) {
					return false;
				}
				return this.every(function(l, r) {
					return relation.has(l, r);
				});
			}
		},
		'equals': {
			'enumerable': true,
			'value': function(relation) {
				return this.subsetOf(relation) && relation.subsetOf(relation);
			}
		},
		'values': {
			'enumerable': true,
			'value': function() {
				var r = [];
				this.forEach(function(l, r) {
					r.push([l, r]);
				});
				return r;
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