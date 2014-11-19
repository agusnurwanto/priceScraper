var Base = require('../base');
var Promise = require('promise');
var numeral = require('numeral');
var _ = require('underscore');
numeral.defaultFormat('0,0');
var sriwijayaPrototype = {
	getAll: function () {
		return this._super()
			.then(function (results) {
				// console.log(results);
				var bodies = results.map(function (res) {
					// console.log(res.body);
					return JSON.parse(res.body)[0];
				})
				return Promise.resolve(bodies);
			})
			.catch(function (err) {
				return Promise.reject(err);
			})
	},
	calculateAdult: function (results) {
		var _100 = results[0];
		return numeral().unformat(_100.price.total);
	},
	calculateChild: function (results) {
		var _100 = results[0];
		return numeral().unformat(_100.price.total);
	},
	calculateInfant: function (results) {
		var _100 = results[0];
		var _101 = results[2];
		return numeral().unformat(_101.price.total) - numeral().unformat(_100.price.total);
	},
	calculateBasic: function (results) {
		var _100 = results[0];
		return numeral().unformat(_100.faredetail.adult.basicpax);
	}
};
var Sriwijaya = Base.extend(sriwijayaPrototype);
module.exports = Sriwijaya;