/*jshint -W079 */
var Base    = require('../base');
var Promise = require('promise');
var _       = require('lodash');
function init(args) {
	this._super(args);
	this.defaultModes = ['101'];
	this.addons = ['calculateBaggage'];
	// this.parallel = true;
}
function  getAll() {
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
}
function calculateAdult(results) {
	var _101  = results[0];
	var basic = +_101.depart.fare.adults.replace('1 x ', '');
	var taxes = _.values(_101.depart.taxesAndFees);
	var tax   = taxes.reduce(function(all, _tax) {
		return +_tax + all;
	}, 0);
	return basic + tax;
}
function calculateChild(results) {
	var _101  = results[0];
	var basic = +_101.depart.fare.adults.replace('1 x ', '');
	var taxes = _.values(_101.depart.taxesAndFees);
	var tax   = taxes.reduce(function(all, _tax) {
		return +_tax + all;
	}, 0);
	return basic + tax;
}
function calculateInfant(results) {
	var _101 = results[0];
	return +_101.depart.fare.infants.replace('1 x ', '');
}
function calculateBasic(results) {
	var _101 = results[0];
	return +_101.depart.fare.adults.replace('1 x ', '');
}
function calculateBaggage(results) {
	var _101 = results[0];
	var baggages = _101.depart.addOns.baggage;
	var total = 0
	baggages.forEach(function (baggage) {
		var ssrs = baggage.availableSsrs;
		total += _.min(ssrs, function (ssr) {
			return !!ssr.price && ssr.price || {};
		}).price || 0;
	});
	return total;
}
var airasiaPrototype = {
	init            : init,
	getAll          : getAll,
	calculateAdult   : calculateAdult,
	calculateChild   : calculateChild,
	calculateInfant  : calculateInfant,
	calculateBasic   : calculateBasic,
	calculateBaggage : calculateBaggage,
};
var Airasia    = Base.extend(airasiaPrototype);
module.exports = Airasia;
