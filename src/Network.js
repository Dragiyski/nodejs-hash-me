(function() {
	"use strict";
	var Map = require('./Map'),
		Connection = require('./Connection'),
		Network = module.exports = function() {
			if(!(this instanceof Network)) {
				return new Network;
			}
			Object.defineProperties(this, {
				'_nodes': {
					'value': new Map()
				},
				'_edges': {
					'value': new Connection()
				}
			});
		};
	Network.prototype = Object.create(Object.prototype, {
		'constructor': {
			'value': Network
		},
		'name': {
			'value': 'Network'
		},
		'setNode': {
			'enumerable': true,
			'value': function(node, value) {
				return this._nodes.set(node, value);
			}
		},
		'getNode': {
			'enumerable': true,
			'value': function(node) {
				return this._nodes.get(node)
			}
		},
		'hasNode': {
			'enumerable': true,
			'value': function(node) {
				return this._nodes.has(node);
			}
		},
		'deleteNode': {
			'enumerable': true,
			'value': function(node) {
				var erm = 0;
				this._edges.leftOf(node).forEach(function(right) {
					erm += this._edges.delete(node, right);
				});
				this._edges.rightOf(node).forEach(function(left) {
					erm += this._edges.delete(left, node);
				});
				return [this._nodes.delete(node) + 0, erm];
			}
		},
		'setEdge': {
			'enumerable': true,
			'value': function(parent, child, value) {
				var nad = 0;
				if(!this.hasNode(parent)) {
					nad += this.setNode(parent);
				}
				if(!this.hasNode(child)) {
					nad += this.setNode(child);
				}
				return [nad, this._edges.set(parent, child, value) + 0];
			}
		},
		'getEdge': {
			'enumerable': true,
			'value': function(parent, child) {
				return this._edges.get(parent, child);
			}
		},
		'hasEdge': {
			'enumerable': true,
			'value': function(parent, child) {
				return this._edges.has(parent, child);
			}
		},
		'deleteEdge': {
			'enumerable': true,
			'value': function(parent, child) {
				return this._edges.delete(parent, child);
			}
		},
		'incomingEdges': {
			'enumerable': true,
			'value': function(node) {
				return this._edges.filter(function(value, parent, child) {
					return child === node;
				}, this);
			}
		},
		'outgoingEdges': {
			'enumerable': true,
			'value': function(node) {
				return this._edges.filter(function(value, parent) {
					return parent === node;
				}, this);
			}
		},
		'parentNodes': {
			'enumerable': true,
			'value': function(child) {
				return this._edges.leftOf(child);
			}
		},
		'childNodes': {
			'enumerable': true,
			'value': function(parent) {
				return this._edges.rightOf(parent);
			}
		},
		'isEmpty': {
			'enumerable': true,
			'value': function() {
				return this._nodes.isEmpty();
			}
		}
	});
})();