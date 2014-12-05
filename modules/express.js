/*jshint -W079 */
var Base    = require('../base');
var Promise = require('promise');
var _       = require('lodash');
function init(args) {
	this._super(args);
	this.defaultModes = ['101'];
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
	var _101  = results[0].departure;
	return _101.adultTotalFare;
}
function calculateChild(results) {
	var _101  = results[0].departure;
	return _101.adultTotalFare;
}
function calculateInfant(results) {
	var _101  = results[0].departure;
	return _101.infantTotalFare;
}
function calculateBasic(results) {
	var _101  = results[0].departure;
	return _101.adultFare;
}
var expressPrototype = {
	init            : init,
	getAll          : getAll,
	calculateAdult   : calculateAdult,
	calculateChild   : calculateChild,
	calculateInfant  : calculateInfant,
	calculateBasic   : calculateBasic,
};
var Express    = Base.extend(expressPrototype);
module.exports = Express;
