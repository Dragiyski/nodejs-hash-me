module.exports = (function() {
	"use strict";
	var Map = require('./Map'), Set = require('./Set');

	function Relation() {
		Object.defineProperties(this, {
			'_left': {
				'value': new Map()
			},
			'_right': {
				'value': new Map()
			}
		});
	}

	Relation.prototype = Object.create(Object.prototype, {
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
				ls.add(right);
				rs.add(left);
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
				return Object.create(Set.prototype, {
					'_values': {
						'value': v
					}
				});
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
				return Object.create(Set.prototype, {
					'_values': {
						'value': v
					}
				});
			}
		},
		'forEach': {
			'enumerable': true,
			'value': function(cb, thisArg) {
				this._left.forEach(function(s, l) {
					l.forEach(function(r) {
						cb.call(thisArg, l, r, this);
					}, this);
				}, this);
			}
		},
		'every': {
			'enumerable': true,
			'value': function(cb, thisArg) {
				return this._left.every(function(s, l) {
					return l.every(function(r) {
						return cb.call(thisArg, l, r, this);
					}, this);
				}, this);
			}
		},
		'some': {
			'enumerable': true,
			'value': function(cb, thisArg) {
				return this._left.some(function(s, l) {
					return l.some(function(r) {
						return cb.call(thisArg, l, r, this);
					}, this);
				}, this);
			}
		},
		'filter': {
			'enumerable': true,
			'value': function(cb, thisArg) {
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
				this.forEach(function(l, r) {
					value = cb.call(thisArg, value, l, r, this);
				}, this);
				return value;
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
		'isEmpty': {
			'enumerable': true,
			'value': function() {
				return this._left.isEmpty() && this._right.isEmpty();
			}
		}
	});
	return Relation;
})();