var Base = require('../base');
var Promise = require('promise');
var _ = require('lodash');

function init(args) {
	this._super(args);
	this.dt.passengersNum = this.dt.passengersNum || 1;
	this.defaultModes = ['110'];
	var adult = ((+this.dt.passengersNum) - 1) || 1;
	this.defaultModes = ['' + adult + '10'];
}

function getAll() {
	return this._super()
		.then(function(results) {
			// console.log(results);
			var bodies = results.map(function(res) {
					return JSON.parse(res.body)[0];
				});
				// console.log(bodies,'bodies');
			return Promise.resolve(bodies);
		})
		.catch(function(err) {
			return Promise.reject(err);
		});
}

function calculateAdult(results) {
	return this.getPrice(results);
}

function calculateChild(results) {
	return this.getPrice(results, 'child');
}

function calculateInfant(results) {
	for (var i = 1; i <= 3; i++) {
		if (!this.dt['transit' + i])
			break;
	}
	var trip = this.dt.tripNum || i;
	return 225000 * trip;
}

function calculateBasic(results) {
	var _X10 = results[0];
	return +_X10.dep_price.adult_basic.satuan;
}
var citilinkPrototype = {
	init: init,
	getAll: getAll,
	getPrice: getPrice,
	calculateAdult: calculateAdult,
	calculateChild: calculateChild,
	calculateInfant: calculateInfant,
	calculateBasic: calculateBasic,
};
var Citilink = Base.extend(citilinkPrototype);

function getPrice(results, type) {
	type = type || 'adult';
	var _X10 = results[0].dep_price;
	var basic = +_X10[type + '_basic'].satuan;
	var generalTax = _.reduce(_X10.passenger_tax, function(result, num, key) {
		if (key === 'tax')
			return result;
		return result += (+num);
	}, 0);
	var paxNum = this.dt.passengersNum === 1 ? 2 : this.dt.passengersNum;
	return (generalTax / paxNum) + (1.1 * basic);
}
module.exports = Citilink;
