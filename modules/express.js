/*jshint -W079 */
var Base    = require('../base');
var Promise = require('promise');
var _       = require('lodash');
function init(args) {
	this._super(args);
	this.dt.passengersNum = this.dt.passengersNum || 1;
	this.defaultModes = [ '' + this.dt.passengersNum + '01'];
	// this.parallel = true;
}
function  getAll() {
	return this._super()
	.then(function (results) {
		var bodies = results.map(function (res) {
			return JSON.parse(res.body);
		});
		return Promise.resolve(bodies);
	})
	.catch(function (err) {
		return Promise.reject(err);
	})
}
function calculateAdult(results) {
	var _X01 = results[0].departure;
	return _X01.adultTotalFare / this.dt.passengersNum;
}
// function calculateChild(results) {
// 	var _X01  = results[0].departure;
// 	return _X01.adultTotalFare / this.dt.passengersNum;
// }
function calculateInfant(results) {
	var _X01  = results[0].departure;
	return _X01.infantTotalFare;
}
function calculateBasic(results) {
	var _X01  = results[0].departure;
	return _X01.adultFare / this.dt.passengersNum;
}
var expressPrototype = {
	init            : init,
	getAll          : getAll,
	calculateAdult   : calculateAdult,
	calculateChild   : calculateAdult,
	calculateInfant  : calculateInfant,
	calculateBasic   : calculateBasic,
};
var Express    = Base.extend(expressPrototype);
module.exports = Express;
