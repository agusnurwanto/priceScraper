var baseClass = require('./base');
var scraper   = new (require('./scraper'));
var _         = require('underscore');
var querystring = require('querystring');
_.mixin(require('underscore.deep'));
var priceScraperPrototype = {
	init        : init,
	setOption   : setOption,
	setOptions  : setOptions,
	setMode     : setMode,
	prepareData : prepareData,
	prepareQuery: prepareQuery,
}
var priceScraper = baseClass.extend(priceScraperPrototype);
/**
 * [init description]
 * @param  {Object} args Custom options.
 */
function init(args) {
	this.setOptions(args);
}
/**
 * setting options, using one arguments: an object with key-value pair, 
 * or two arguments, with the first as key and second as value
 */
function setOptions() {
	if (arguments.length === 1) {
		var args = arguments[0];
		var defaults = {
		scrape: '', //if url will be used as request with query, if function will be executed with dt object
		dt: {ori: '', dst: '', flightCode: '', classCode: '' },
		airline: '',
			db: ''
		}
		var options = _.deepExtend(defaults, args);
		for (var key in defaults) {
			var value = options[key];
			this[key] = value;
		}
	} else {
		var key = arguments[0];
		var value = arguments[1];
		this[key] = value;
	}
	return this;
}
/**
 * alias for setOptions
 */
function setOption() {
	return setOptions.apply(this, arguments);
}
/**
 * setting mode before running scrape price
 * @param {string} mode Passengers count e.g: '100', '101', '110'
 */
function setMode(mode) {
	if(!mode || !mode.length || mode.length !== 3) {
		mode = '100';
	}
	var aMode      = mode.split('').filter(function (val) { return val == 0 || val == 1});
	this.dt.adult  = aMode[0];
	this.dt.child  = aMode[1];
	this.dt.infant = aMode[2];
	return this;
}
function prepareData () {
	var _dt  = {}
	var dt   = _.deepExtend(this.dt, _dt)
	var data = {airline: this.airline, action: 'price', query: dt }
	return data;
}
function prepareQuery () {
	var _dt  = {}
	var dt   = _.deepExtend(this.dt, _dt)
	var query = querystring.stringify(dt);
	return query
}
function get(mode) {
	this.setMode(mode);
	if (typeof this.scrape === 'function') {
		var data = this.prepareData();
		return this.scrape(data);
	} else {
		var query = this.prepareQuery();
		return scraper.get(this.scrape + '?' + query);
	}
}
 module.exports = priceScraper;