var Base = require('../base');
var Promise = require('promise');
var numeral = require('numeral');
var _ = require('lodash');
numeral.defaultFormat('0,0');
function init (args) {
	this._super(args);
	this.defaultModes = ['101'];
	this.taxes = [ 'basixpax', 'pajaxpax', 'iwjrpax', 'surchargeFreepax', 'extraCoverpax', ];
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
	var _111 = results[0].faredetail.adult;
	var basic = numeral().unformat(_111.basicpax);
	var tax = this.taxes.reduce(function (total, tax) {
		return total + (numeral().unformat(_111[tax]) || 0);
	}, 0)
	return basic + tax;
}
function calculateChild (results) {
	var _111 = results[0].faredetail.adult;
	var basic = numeral().unformat(_111.basicpax);
	var tax = this.taxes.reduce(function (total, tax) {
		return total + (numeral().unformat(_111[tax]) || 0);
	}, 0)
	return basic + tax;
}
function calculateInfant (results) {
	var _111 = results[0].faredetail.infants;
	var basic = numeral().unformat(_111.basicpax);
	var tax = this.taxes.reduce(function (total, tax) {
		return total + (numeral().unformat(_111[tax]) || 0);
	}, 0)
	return basic + tax;
}
function calculateBasic (results) {
	var _111 = results[0];
	return numeral().unformat(_111.faredetail.adult.basicpax);
}
var sriwijayaPrototype = {
	init           : init,
	getAll         : getAll,
	calculateAdult : calculateAdult,
	calculateChild : calculateChild,
	calculateInfant: calculateInfant,
	calculateBasic : calculateBasic
};
var Sriwijaya = Base.extend(sriwijayaPrototype);
module.exports = Sriwijaya;