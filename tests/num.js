var numeral = require('numeral');
var _ = require('underscore');
var prices = [
	{ published_fare: '1,134,200', total_taxes: '87,000', total: '1,221,200' },
	{ published_fare: '2,268,400', total_taxes: '174,000', total: '2,442,400' },
	{ published_fare: '1,247,500', total_taxes: '107,000', total: '1,354,500' } ];
var _100 = numeral().unformat(prices[0].total);
var _110 = numeral().unformat(prices[1].total);
var _101 = numeral().unformat(prices[2].total);
console.log(_100, _110, _101);

var _prices = []
_.each(prices, function (value, key, object) {
	var price = {}
	_.each(value, function (_value, _key, _object) {
		 var num = numeral().unformat(_value);
		 price[_key] = num;
	})
	_prices[key] = price;
})
console.log(_prices);