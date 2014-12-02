var Base = require('../base');
var Promise = require('promise');
var numeral = require('numeral');
var _ = require('lodash');
numeral.defaultFormat('0,0');
function init (args) {
	this._super(args);
	this.defaultModes = ['100', '101'];
}
function getAll() {
	return this._super()
		.then(function (results) {
			// console.log(results);
			var bodies = results.map(function (res) {
				// console.log(res.body);
				return JSON.parse(res.body)[0].price;
			})
			// console.log(bodies,'bodies');
			var _prices = []
			_.each(bodies, function (value, key, object) {
				var price = {}
				_.each(value, function (_value, _key, _object) {
					 var num = numeral().unformat(_value);
					 price[_key] = num;
				})
				_prices[key] = price;
			})
			return Promise.resolve(_prices);
		})
		.catch(function (err) {
			return Promise.reject(err);
		})
};
function calculateAdult(results) {
	var _100 = results[0];
	return +_100.total;
};
function calculateChild(results) {
	var _100 = results[0];
	return +_100.total;
};
function calculateInfant(results) {
	var _100 = results[0];
	var _101 = results[1];
	return _101.total - _100.total;
};
function calculateBasic(results) {
	var _100 = results[0];
	return +_100.published_fare;
};
var lionPrototype = {
	getAll: getAll,
	calculateAdult: calculateAdult,
	calculateChild: calculateChild,
	calculateInfant: calculateInfant,
	calculateBasic: calculateBasic,
};
var Lion = Base.extend(lionPrototype);
module.exports = Lion;