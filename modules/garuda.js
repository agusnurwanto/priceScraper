var Base = require('../base');
var Promise = require('promise');
var garudaPrototype = {
	init: function (args) {
		this._super(args);
		// this.parallel = true;
	},
	getAll: function () {
		return this._super()
			.then(function (results) {
				var bodies = results.map(function (res) {
					return JSON.parse(res.body);
				})
				// console.log(bodies,'bodies');
				return Promise.resolve(bodies);
			})
			.catch(function (err) {
				return Promise.reject(err);
			})
	},
	calculateAdult: function (results) {
		var _100 = results[0];
		return _100.total
	},
	calculateChild: function (results) {
		var _100 = results[0];
		var _110 = results[1];
		return _110.total - _100.total;
	},
	calculateInfant: function (results) {
		var _100 = results[0];
		var _101 = results[2];
		return _101.total - _100.total;
	},
	calculateBasic: function (results) {
		var _100 = results[0];
		return _100.basic
	}
};
var Garuda = Base.extend(garudaPrototype);
module.exports = Garuda;