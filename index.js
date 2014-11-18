var baseClass = require('./base');
var scraper   = new (require('./scraper'));
var db = require('./db');
var _         = require('underscore');
var Promise = require('promise');
var querystring = require('querystring');
_.mixin(require('underscore.deep'));
var priceScraperPrototype = {
	init        : init,
	setOption   : setOption,
	setOptions  : setOptions,
	setMode     : setMode,
	prepareData : prepareData,
	prepareQuery: prepareQuery,
	getCache: getCache,
	get: get,
}
var priceScraper = baseClass.extend(priceScraperPrototype);
/**
 * [init description]
 * @param  {Object} args Custom options.
 */
function init(args) {
	this.db = db;
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
			airline: ''
		}
		var options = _.deepExtend(defaults, args);
		for (var key in defaults) {
			var value = options[key];
			this[key] = value;
			if (typeof this[key] === 'string')
				this[key] = this[key].toLowerCase();
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
/**
 * preparing data for scrape function arguments
 * @return {Object} Data formatted for parameter in scraper function
 */
function prepareData () {
	var _dt  = {}
	var dt   = _.deepExtend(this.dt, _dt)
	var data = {airline: this.airline, action: 'price', query: dt }
	return data;
}
/**
 * preparing querystring for request function
 * @return {String} String formatted for parameter in request function
 */
function prepareQuery () {
	var _dt  = {}
	var dt   = _.deepExtend(this.dt, _dt)
	var query = querystring.stringify(dt);
	return query;
}
/**
 * Get cache data from db
 * @return {Object} Data price for current dt
 */
function getCache () {
	var _this = this;
	return new Promise(function (resolve, reject) {	
		var _ori = _this.dt.ori.toUpperCase();
		var _dst = _this.dt.dst.toUpperCase();
		var _flightCode = _this.dt.flightCode;
		var _classCode = _this.dt.classCode;
		var _airline = _this.airline;
		var query = {"size":1, "query": {"filtered": {"filter": {"and" : [
			{ "term": { "origin": _ori } }, 
			{ "term": { "destination": _dst} }, 
			{ "term": { "flight": _flightCode } }, 
			{ "term": { "class": _classCode } }, 
			{ "term": { "airline": _airline} } ] } } } };
		_this.db.search('pluto', 'price', query, function (err, res) {
			if (err)
				return reject(err)
			try {res = JSON.parse(res)} catch(err) { return reject(err)}
			// console.log(JSON.stringify(res, null, 2));
			if (res.hits.total <= 0)
				return reject(new Error('No cache found'));
			var price = res.hits.hits[0]._source.price;
			if (typeof price === 'object')
				return resolve(price);
			return resolve({adult: price });
		});
	})
	.catch(function (err) {
		return Promise.reject(err);
	});
}
/**
 * get price by scraping it as defined in scrape option
 * @param  {string} mode Passengers count e.g.(100,110,101)
 * @return {Object}      Object Promise
 */
function get(mode) {
	this.setMode(mode);
	if (typeof this.scrape === 'function') {
		var data = this.prepareData();
		return this.scrape(data);
	} else {
		var query = this.prepareQuery();
		var url = this.scrape + '?' + query;
		return scraper.get(url);
	}
}
module.exports = priceScraper;