var baseClass             = require('./base');
var scraper               = new (require('./scraper'));
var db                    = require('./db');
var _                     = require('underscore');
var Promise               = require('promise');
var querystring           = require('querystring');
var airlines              = {"airasia": 1, "citilink": 2, "garuda": 3, "lion": 4, "sriwijaya": 5, "xpress": 6};
var priceScraperPrototype = {
	init                : init,
	setOption           : setOption,
	setOptions          : setOptions,
	setMode             : setMode,
	prepareRequestData  : prepareRequestData,
	prepareRequestQuery : prepareRequestQuery,
	prepareDatabaseQuery: prepareDatabaseQuery,
	getCache            : getCache,
	saveCache           : saveCache,
	generateId          : generateId,
	get                 : get,
	isCacheComplete     : isCacheComplete,
	run                 : run,
}
_.mixin(require('underscore.deep'));
var priceScraper = baseClass.extend(priceScraperPrototype);
/**
 * [init description]
 * @param  {Object} args Custom options.
 */
function init(args) {
	this.db = db;
	this.setOptions(args);
	this.priceCode = airlines[this.airline] || 0;
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
			index: 'pluto',
			type: 'price'
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
function prepareRequestData () {
	var _dt  = {}
	var dt   = _.deepExtend(this.dt, _dt)
	var data = {airline: this.airline, action: this.type, query: dt }
	return data;
}
/**
 * preparing querystring for request function
 * @return {String} String formatted for parameter in request function
 */
function prepareRequestQuery () {
	var _dt  = {}
	var dt   = _.deepExtend(this.dt, _dt)
	var query = querystring.stringify(dt);
	return query;
}
/**
 * create query for retrieving data from db
 * @return {string} query for db
 */
function prepareDatabaseQuery () {
	var _this       = this;
	var _ori        = _this.dt.ori.toUpperCase();
	var _dst        = _this.dt.dst.toUpperCase();
	var _flightCode = _this.dt.flightCode;
	var _classCode  = _this.dt.classCode;
	var _airline    = _this.airline;
	var query = {"size":1, "query": {"filtered": {"filter": {"and" : [
		{ "term": { "origin": _ori } },
		{ "term": { "destination": _dst} },
		{ "term": { "flight": _flightCode } },
		{ "term": { "class": _classCode } },
		{ "term": { "airline": _airline} } ] } } } };
	if (_this.dt.transit)
		query.query.filtered.filter.and.push({"term": {"transit": _this.dt.transit}});
	if (_this.dt.transit2)
		query.query.filtered.filter.and.push({"term": {"transit2": _this.dt.transit2}});
	if (_this.dt.transit3)
		query.query.filtered.filter.and.push({"term": {"transit3": _this.dt.transit3}});
	return query;
}
/**
 * Get cache data from db
 * @return {Object} Data price for current dt
 */
function getCache () {
	var _this = this;
	return new Promise(function (resolve, reject) {
		var query = _this.prepareDatabaseQuery();
		_this.db.search(_this.index, _this.type, query, function (err, res) {
			if (err)
				return reject(err)
			try {res = JSON.parse(res)} catch(err) { return reject(err)}
			// console.log(JSON.stringify(res, null, 2));
			if (res.hits.total <= 0)
				return reject(new Error('No cache found'));
			var prices = res.hits.hits[0]._source.prices;
			if (!!prices && typeof prices === 'object')
				return resolve(prices);
			prices = {};
			var price = res.hits.hits[0]._source.price;
			if(!!price)
				prices.adult = price
			return resolve(prices);
		});
	})
	.catch(function (err) {
		return Promise.reject(err);
	});
}
/**
 * save price data to db
 * @param  {Object} price object containing price data
 */
function saveCache (prices, callback) {
	callback = (typeof callback === 'function') ? callback : function() {};
	var _this = this;
	var _prices = _.map(prices, function (value, key, object) {
		return value + _this.priceCode;
	});
	var data = {
		origin     : _this.dt.ori,
		destination: _this.dt.dst,
		airline    : _this.airline,
		flight     : _this.dt.flightCode || '',
		class      : _this.dt.classCode || '',
		prices     : _prices
	};
	data.id = _this.generateId(data);
	db.index(_this.index, _this.type, data, function (err, res) {
		return callback(err, res)
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
		var data = this.prepareRequestData();
		return this.scrape(data);
	} else {
		var query = this.prepareRequestQuery();
		var url = this.scrape + '?' + query;
		return scraper.get(url);
	}
}
function run () {
	var _this = this;
	return new Promise(function (resolve, reject) {
		_this.getCache()
			.then(function (cache) {
				if (!_this.isCacheComplete(cache))
					return resolve(cache);
				return reject();
			})
			.catch(function () {
				var prices = {};
				if (!(err instanceof Error))
					prices = err;
			})
	})
}
/**
 * internal function used when saving data to db
 * @param  {Object} data Save to db
 * @return {string}      id for db
 */
function generateId (data) {
	return data.origin + data.destination + data.airline + data.flight + data.class;
};
/**
 * check if cache qualified as complete
 * @param  {Object}  cache data from db
 * @return {Boolean}       whether cache incomplete or not
 */
function isCacheComplete (cache) {
	if (!cache)
		return false;
	var requirements = ['adult', 'child', 'infant', 'basic'];
	return _.every(requirements, function (requirement) {
		return !!cache[requirement] && cache[requirement] > 0;
	});
}
module.exports = priceScraper;