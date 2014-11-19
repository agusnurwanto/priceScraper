var Base = require('../priceScraper');
var Promise = require('promise');
var airasiaPrototype = {
	getAll: function () {
		return this._super()
			.then(function (results) {
				// console.log(results);
				var bodies = results.map(function (res) {
					return JSON.parse(res.body)[0];
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
		return +_100.totalIDR;
	},
	calculateChild: function (results) {
		var _100 = results[0];
		var _110 = results[1];
		return _110.totalIDR - _100.totalIDR;
	},
	calculateInfant: function (results) {
		var _100 = results[0];
		var _101 = results[2];
		return _101.totalIDR - _100.totalIDR;
	},
	calculateBasic: function (results) {
		var _100 = results[0];
		return +_100.depart.fare.adults.replace('1 x ', '');
	}
};
var Garuda = Base.extend(airasiaPrototype);
module.exports = Garuda;