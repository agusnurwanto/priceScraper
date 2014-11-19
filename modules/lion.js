var Base = require('../base');
var Promise = require('promise');
var lionPrototype = {
	getAll: function () {
		return this._super()
			.then(function (results) {
				// console.log(results);
				var bodies = results.map(function (res) {
					console.log(res.body);
					return JSON.parse(res.body)[0].price;
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
		return +_100.total;
	},
	calculateChild: function (results) {
		var _100 = results[0];
		return +_100.total;
	},
	calculateInfant: function (results) {
		var _100 = results[0];
		var _101 = results[2];
		return _101.total - _100.total;
	},
	calculateBasic: function (results) {
		var _100 = results[0];
		return +_100.published_fare;
	}
};
var Lion = Base.extend(lionPrototype);
module.exports = Lion;