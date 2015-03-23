(function () {
	"use strict";
	var Set = require('./Set'),
		Relation = require('./Relation'),
		Graph = module.exports = function () {
			if (!(this instanceof Graph)) {
				return new Graph;
			}
			this._nodes = new Set();
			this._edges = new Relation();
		};
	Graph.prototype = Object.create(Object.prototype, {
		'constructor': {
			'value': Graph
		},
		'name': {
			'value': 'Graph'
		},
		'addNode': {
			'enumerable': true,
			'value': function (value) {
				return this._nodes.add(value);
			}
		},
		'hasNode': {
			'enumerable': true,
			'value': function (value) {
				return this._nodes.has(value);
			}
		},
		'deleteNode': {
			'enumerable': true,
			'value': function (value) {
				var erm = 0;
				this._edges.leftOf(value).forEach(function (right) {
					erm += this._edges.delete(value, right);
				}, this);
				this._edges.rightOf(value).forEach(function (left) {
					erm += this._edges.delete(left, value);
				}, this);
				return [this._nodes.delete(value) + 0, erm];
			}
		},
		'addEdge': {
			'enumerable': true,
			'value': function (parent, child) {
				return [this._nodes.add(parent) + this._nodes.add(child), this._edges.add(parent, child) + 0];
			}
		},
		'hasEdge': {
			'enumerable': true,
			'value': function (parent, child) {
				return this._edges.has(parent, child);
			}
		},
		'deleteEdge': {
			'enumerable': true,
			'value': function (parent, child) {
				return this._edges.delete(parent, child);
			}
		},
		'clear': {
			'enumerable': true,
			'value': function () {
				this._nodes.clear();
				this._edges.clear();
				return this;
			}
		},
		'incomingEdges': {
			'enumerable': true,
			'value': function (node) {
				return this._edges.filter(function (value, parent, child) {
					return child === node;
				}, this);
			}
		},
		'outgoingEdges': {
			'enumerable': true,
			'value': function (node) {
				return this._edges.filter(function (value, parent) {
					return parent === node;
				}, this);
			}
		},
		'parentNodes': {
			'enumerable': true,
			'value': function (child) {
				return this._edges.leftOf(child);
			}
		},
		'childNodes': {
			'enumerable': true,
			'value': function (parent) {
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