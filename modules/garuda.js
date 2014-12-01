var Base            = require('../base');
var debug           = require('debug')('raabbajam:priceScraper:garuda');
var Promise         = require('promise');
function init(args) {
	this._super(args);
	// this.parallel = true;
}
function getAll() {
	return this._super()
		.then(function (results) {
			var bodies = results.map(function (res) {
				return JSON.parse(res.body);
			})
			// console.log(bodies,'bodies');
			return Promise.resolve(bodies);
		})
		.catch(function (err) {
			return Promise.reject(err);
		})
}
function calculateAdult(results) {
	var _111 = results[0].details;
	return _111.adult.singlePax;
}
function calculateChild(results) {
	var _111 = results[0].details;
	return _111.child.singlePax;
}
function calculateInfant(results) {
	var _111 = results[0].details;
	return _111.infant.singlePax;
}
function calculateBasic(results) {
	var _111 = results[0].details;
	return _111.adult.basic;
}
var garudaPrototype = {
	init           : init,
	getAll         : getAll,
	calculateAdult : calculateAdult,
	calculateChild : calculateChild,
	calculateInfant: calculateInfant,
	calculateBasic : calculateBasic
};
var Garuda = Base.extend(garudaPrototype);
module.exports = Garuda;