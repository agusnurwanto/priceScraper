var Base = require('../base');
var Promise = require('promise');
var _ = require('lodash');
function init (args) {
	this._super(args);
	this.defaultModes = ['110'];
}
function getAll() {
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
	var _110 = results[0].dep_price;
	var basic = +_110.adult_basic.satuan;
	var generalTax = _.reduce(_110.passenger_tax, function (result, num, key) {
		if (key === 'tax')
			return result;
		console.log('num',num);
		return result += +num;
	}, 0);
	console.log('generalTax',generalTax);
	return generalTax / 2 + 1.1 * basic;
}
function calculateChild (results) {
	var _110 = results[0].dep_price;
	var basic = +_110.child_basic.satuan;
	var generalTax = _.reduce(_110.passenger_tax, function (result, num, key) {
		if (key === 'tax')
			return result;
		return result += +num;
	}, 0);
	return generalTax / 2 + 1.1 * basic;
}
function calculateInfant (results) {
	for(var i = 1; i <=3; i++){
		if(!this.dt['transit' + i])
			break;
	}
	var trip = this.dt.tripNum || i;
	return 225000 * trip;
}
function calculateBasic (results) {
	var _110 = results[0];
	return +_110.dep_price.adult_basic.satuan;
}
var citilinkPrototype = {
	init           : init,
	getAll         : getAll,
	calculateAdult : calculateAdult,
	calculateChild : calculateChild,
	calculateInfant: calculateInfant,
	calculateBasic : calculateBasic
};
var Citilink = Base.extend(citilinkPrototype);
module.exports = Citilink;