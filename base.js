var baseClass             = require('./libs/base');
var scraper               = new (require('./libs/scraper'))();
var db                    = require('./libs/db');
var _                     = require('underscore');
var Promise               = require('promise');
var querystring           = require('querystring');
var debug                 = require('debug')('raabbajam:priceScraper:base');
var airlines              = {"airasia": 1, "citilink": 2, "garuda": 3, "lion": 4, "sriwijaya": 5, "xpress": 6};
_.mixin(require('underscore.deep'));
/**
 * [init description]
 * @param  {Object} args Custom options.
 */
function init(args) {
	this.setOptions(args);
	this.priceCode = airlines[this.airline] || 0;
}
/**
 * setting options, using one arguments: an object with key-value pair,
 * or two arguments, with the first as key and second as value
 */
function setOptions() {
	var key, value;
	if (arguments.length === 1) {
		var args = arguments[0];
		var defaults = {
			scrape  : '', //if url will be used as request with query, if function will be executed with dt object
			dt      : {ori: '', dst: '', flightCode: '', classCode: '' },
			airline : '',
			index   : 'pluto',
			type    : 'price',
			parallel: false,
			db      : db,
		};
		var options = _.deepExtend(defaults, args);
		for (key in defaults) {
			value = options[key];
			this[key] = value;
			if (typeof this[key] === 'string')
				this[key] = this[key].toLowerCase();
		}
	} else {
		key = arguments[0];
		value = arguments[1];
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
	var aMode      = mode.split('').filter(function (val) { return val == "0" || val == "1";});
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
	var _dt  = {};
	var dt   = _.deepExtend(this.dt, _dt);
	var data = {airline: this.airline, action: this.type, query: dt };
	return data;
}
/**
 * preparing querystring for request function
 * @return {String} String formatted for parameter in request function
 */
function prepareRequestQuery () {
	var _dt   = {pricescraper: true};
	var dt    = _.deepExtend(this.dt, _dt);
	var query = querystring.stringify(dt);
	query     = query.replace(/%2B/g, '+');
	return query;
}
/**
 * create query for retrieving data from db
 * @return {string} query for db
 */
function prepareDatabaseQuery () {
	var _this       = this;
	var _ori        = _this.dt.ori.toLowerCase();
	var _dst        = _this.dt.dst.toLowerCase();
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
function preparePricesOutputFromDB (prices) {
	var _this = this;
	return _.object(
		_.map(prices, function (value, key, object) {
			return [key, value - _this.priceCode];
		})
	);
}
/**
 * Get cache data from db
 * @return {Object} Data price for current dt
 */
function getCache () {
	var _this = this;
	return new Promise(function (resolve, reject) {
		var query = _this.prepareDatabaseQuery();
		var data = {
			origin     : _this.dt.ori,
			destination: _this.dt.dst,
			airline    : _this.airline,
			flight     : _this.dt.flightCode || '',
			class      : _this.dt.classCode || '',
			transit1   : _this.dt.transit1,
			transit2   : _this.dt.transit2,
			transit3   : _this.dt.transit3,
			cek_instant:_this.dt.cek_instant,
			cek_instant_id:_this.dt.cek_instant_id,
		};
		var id = _this.generateId(data);
		debug('id',id);
		_this.db.get(_this.index, _this.type, id, function (err, res) {
			if (err)
				return reject(err);
			try {res = JSON.parse(res);} catch(error) { return reject(error);}
			// debug(JSON.stringify(res, null, 2));
			if (!res.found)
				return reject(new Error('No cache found'));
			var prices = res._source.prices;
			debug(JSON.stringify(res));
			if (!!prices && typeof prices === 'object')
				return resolve(prices);
			prices = {};
			var price = res._source.price;
			if(!!price)
				prices.adult = price;
			prices = _this.preparePricesOutputFromDB(prices);
			return resolve(prices);
		});
	})
	.catch(function (err) {
		return Promise.reject(err);
	});
}
function preparePricesInputToDB (prices) {
	var _this = this;
	return _.object(
		_.map(prices, function (value, key, object) {
			return [key, value + _this.priceCode];
		})
	);
}
/**
 * save price data to db
 * @param  {Object} price object containing price data
 */
function saveCache (prices, callback) {
	callback = (typeof callback === 'function') ? callback : function() {};
	if (!this.isCacheComplete(prices)) {
		var message = 'Not saved. Requirements not met: ' + JSON.stringify(prices, null, 2);
		debug(message);
		return callback(new Error(message));
	}
	var _this = this;
	var _prices = _this.preparePricesInputToDB(prices);
	var data = {
		origin     : _this.dt.ori,
		destination: _this.dt.dst,
		airline    : _this.airline,
		flight     : _this.dt.flightCode || '',
		class      : _this.dt.classCode || '',
		prices     : _prices,
		price      : _prices.adult,
	};
	for (var i = 1; i <= 3; i++){
		if(!!_this.dt['transit' + i]){
			data['transit' + i] = _this.dt['transit' + i];
		} else {
			break;
		}
	}
	data.id = _this.generateId(data);
	debug(data);
	db.index(_this.index, _this.type, data, function (err, res) {
		debug('savecache', res, data);
		return callback(err, res);
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
		debug(url);
		return scraper.get(url);
	}
}
/**
 * get scrape data all modes sequence
 * @return {Object} Array of object containing data price
 */
function getAll (modes) {
	if(!!this.parallel)
		return this.getAllParallel();
	var _this = this;
	var results = [];
	modes = modes || _this.defaultModes || ['100', '110', '101'];
	if (!(modes instanceof Array))
		modes = [modes];
	var steps = modes.reduce(function (sequence, mode) {
		return sequence.then(function () {
			return _this.get(mode)
				.then(function (res) {
					results.push(res);
				});
		});
	}, Promise.resolve());
	return new Promise(function (resolve, reject) {
		steps
			.then(function () {
				// debug(results,'results');
				return resolve(results);
			})
			.catch(function (err) {
				debug('Error. Sent incomplete results:',results);
				return resolve(results);
			});
	});
}
/**
 * get scrape data all modes paraller
 * @return {Object} Array of object containing data price
 */
function getAllParallel () {
	var _this = this;
	var modes = ['100', '110', '101'];
	var steps = [];
	modes.forEach(function (mode) {
		var step = _this.get(mode);
		steps.push(step);
	});
	return Promise.all(steps);
}
/**
 * return formatted prices from results
 * @param  {object} results Results from getAll
 * @return {Object}         Formatted prices to be outputted
 */
function calculatePrices (results) {
	var prices = {
		adult : this.calculateAdult(results),
		child : this.calculateChild(results),
		infant: this.calculateInfant(results),
		basic : this.calculateBasic(results),
	};
	return prices;
}
function run () {
	var _this = this;
	return new Promise(function (resolve, reject) {
		if(!_this.dt || !!_this.dt.pricescraper || !!_this.dt.priceScraper){
			console.log('_this.dt.priceScraper is true so it wont spawn again');
			return resolve(true);
		}
		_this.getCache()
			.then(function (cache) {
				debug('cache found', cache);
				if (!_this.isCacheComplete(cache))
					return reject(new Error('Cache not complete.'));
				return resolve(cache);
			}, function (err) {
				debug('no cache');
				return _this.getAll()
					.then(function (results) {
						debug('got results getAll', JSON.stringify(results, null, 2));
						var expectedLength = _this.defaultModes && _this.defaultModes.length || 3;
						if (results.length !== expectedLength)
							return reject(new Error('Results not complete.'));
						var prices = _this.calculatePrices(results);
						return _this.saveCache(prices, function (err, res) {
							if (err){
								console.log('Error on saveCache');
								return reject(err);
							}
							return resolve(prices);
						});
					})
					.catch(function (err) {
						debug(err.stack);
						return reject(err);
					});
			});
	});
}
/**
 * internal function used when saving data to db
 * @param  {Object} data Save to db
 * @return {string}      id for db
 */
function generateId (data) {
	var id = data.origin + '_' + data.destination + '_' + data.airline + '_' + data.flight + '_' + data.class;
	if (data.transit1)
		id +=  '_' + data.transit1;
	if (data.transit2)
		id +=  '_' + data.transit2;
	if (data.transit3)
		id +=  '_' + data.transit3;
	debug(id);
	return id.toLowerCase();
}
/**
 * check if cache qualified as complete
 * @param  {Object}  cache data from db
 * @return {Boolean}       whether cache incomplete or not
 */
function isCacheComplete (cache) {
	if (!cache)
		return false;
	var requirements = ['adult', 'child', 'infant', 'basic'];
	var complete = _.every(requirements, function (requirement) {
		return !!cache[requirement] && cache[requirement] > 0;
	});
	if (!complete || cache.child > cache.adult || cache.infant > cache.adult)
		return false;
	return true;
}

var priceScraperPrototype = {
	init                     : init,
	setOption                : setOption,
	setOptions               : setOptions,
	setMode                  : setMode,
	prepareRequestData       : prepareRequestData,
	prepareRequestQuery      : prepareRequestQuery,
	prepareDatabaseQuery     : prepareDatabaseQuery,
	preparePricesOutputFromDB: preparePricesOutputFromDB,
	getCache                 : getCache,
	preparePricesInputToDB   : preparePricesInputToDB,
	saveCache                : saveCache,
	generateId               : generateId,
	get                      : get,
	getAll                   : getAll,
	getAllParallel           : getAllParallel,
	isCacheComplete          : isCacheComplete,
	calculatePrices          : calculatePrices,
	run                      : run,
};
var priceScraper = baseClass.extend(priceScraperPrototype);
module.exports = priceScraper;