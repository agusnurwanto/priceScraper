var Base = require('../base');
var Promise = require('promise');
var numeral = require('numeral');
var _ = require('underscore');
numeral.defaultFormat('0,0');
var lionPrototype = {
	getAll: function () {
		return this._super()
			.then(function (results) {
				// console.log(results);
				var bodies = results.map(function (res) {
					console.log(res.body);
					var prices = JSON.parse(res.body)[0].price;
					var _prices = []
					_.each(prices, function (value, key, object) {
						var price = {}
						_.each(value, function (_value, _key, _object) {
							 var num = numeral().unformat(_value);
							 price[_key] = num;
						})
						_prices[key] = price;
					})
					return _prices;
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
		return numeral().unformat(_100.total);
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