/*jshint -W079 */
var Base    = require('../base');
var Promise = require('promise');
var _       = require('lodash');
function init(args) {
	this._super(args);
	this.dt.passengersNum = this.dt.passengersNum || 1;
	this.defaultModes = [ '' + this.dt.passengersNum + '00'];
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
	var _100  = results[0];
	var basic = +_100.depart.fare.adults.replace(/\d+ x /, '');
	var taxes = _.values(_100.depart.taxesAndFees);
	var tax   = taxes.reduce(function(all, _tax) {
		return +_tax + all;
	}, 0);
	// return basic + (tax / this.dt.passengersNum);
	return +_100.totalIDR / this.dt.passengersNum;
}
// function calculateChild(results) {
// 	var _100  = results[0];
// 	var basic = +_100.depart.fare.adults.replace(/\d+ x /, '');
// 	var taxes = _.values(_100.depart.taxesAndFees);
// 	var tax   = taxes.reduce(function(all, _tax) {
// 		return +_tax + all;
// 	}, 0);
// 	return basic + (tax / this.dt.passengersNum);
// }
function calculateInfant(results) {
	if (!!this.dt) {
		for(var i = 1; i <=3; i++){
			if(!this.dt['transit' + i])
				break;
		}
	}
	var trip = !!this.dt && this.dt.tripNum || i;
	return 150000 * trip;
}
function calculateBasic(results) {
	var _100 = results[0];
	return +_100.depart.fare.adults.replace(/\d+ x /, '');
}
function calculateBaggage(results) {
	var _100 = results[0];
	var baggages = _100.depart.addOns.baggage;
	var price = 0;
	try{
		price = baggages[0].availableSsrs[0].price;
	}catch(e){
		console.log(e);
	}
	return price;
}
var airasiaPrototype = {
	init            : init,
	getAll          : getAll,
	calculateAdult   : calculateAdult,
	calculateChild   : calculateAdult,
	calculateInfant  : calculateInfant,
	calculateBasic   : calculateBasic,
	calculateBaggage : calculateBaggage,
};
var Airasia    = Base.extend(airasiaPrototype);
module.exports = Airasia;
