var request = require('request').defaults({jar: true});
var fs = require('fs');
var Promise = require('promise');
var Class = require('./base');
var _ = require('underscore');
_.mixin(require('underscore.deep'));
var debug = require('debug')('scraper:base');
var scraperPrototype = {
	get           : get,
	post          : post,
	setUA         : setUA,
	setCookie     : setCookie,
};
var Scraper = Class.extend(scraperPrototype);

function init () {
	this._jar = request.jar();
	this.headers            = {'User-Agent': "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36"};
	this.headersPost        = {
								'Accept': '*/*',
								//~ 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
								'Accept-Language': 'en-US,en;q=0.5',
								'Connection': 'keep-alive',
								'Content-Type': 'application/x-www-form-urlencoded'
							};
	this.errorCount    = 0;
	this.errorCountMax = 3;
	this.captureCount = 0;
};

function  get(url, options, method) {
	var method = method || 'get';
	debug('[' + method.toUpperCase() + '] '+url);
	var _this = this;
	var rq = request.defaults({jar: true});
	var _options = filterKey(options);
	method = method.toLowerCase();
	if (!!_this.cookies) {
		_this.setCookie(_this.cookies)
		debug('Using cookies '+ _this.cookies);
		debug('Using cookie jar '+ _this._jar.getCookieString(_this.url.uri));
	}
	if (!!_this.ua)
		_this.setUA(_this.ua);
	debug('Using User-agent '+ _this.ua);
	var defaultOptions = {
		url               : url,
		headers           : _this.headers,
		jar               : _this._jar,
		rejectUnauthorized: false,
		followAllRedirects: true,
		followRedirect    : function (res) {
			debug('Redirected: [' + res.statusCode + '] ' + res.request.path + ' >>> ' + res.headers.location);
			return true;
		}
	};
	if (method === 'post')
		defaultOptions.headers = _.deepExtend(defaultOptions.headers, _this.headersPost);
	options = _.deepExtend(defaultOptions, options);
	if (_options._gzip === true)
		options.gzip = true;
	// debug('\n'+JSON.stringify(options, null, 2));
	return new Promise(function (fulfill, reject) {
		rq[method](options, function(err, res, body){
			if (err) 
				return reject(err);
			if (res.statusCode !== 200) {
				if ( !_options._ignoreError){
					err = new Error("Unexpected status code: " + res.statusCode);
					err.res = res;
					return reject(err);
				} else {
					debug('Ignoring unexprected status code: ' + res.statusCode +  '. written to error.html');
					fs.writeFile(__dirname + '/error.html', res.body);
				}
			} else if (body === undefined || body === null) {
				err = new Error("Body empty.");
				err.res = res;
				return reject(err);
			}
			if(_this.capture){
				var filename = __dirname + '/capture/' + _this.airline + ':' + _this.action + _this.captureCount + '.html';
				fs.writeFile(filename, res.body);
				debug('Capturing to: ' + filename)
				_this.captureCount++;
			}
			if (_options._redirect) {
				res.redirects = this.redirects;
			}
			if (_options._image)
				return fulfill(body);
			if (_options._parse) {
				if (_options._parse.toLowerCase() === 'xml') {
					var text = body.replace("\ufeff", "");
					parseXML(text, function(err, body){
					if (err)
						return reject(err);
					res.body = body;
						return fulfill(res);
					});
				}
			} else {
				if (_options._delay) {
					var delay = parseInt(_options._delay, 10) === _options._delay? _options._delay : _this.delay || 1000;
					debug('waiting for delay: ' + delay + 'ms, before continuing.')
					setTimeout(function() {
						return fulfill(res); 
					}, delay);
					return;
				} else {
					return fulfill(res);
				}
			}
		});
	});
};
function post(url, option) {
	return this.get(url, option, 'post');
};

function setUA (ua) {
	return this.headers['User-Agent'] = ua;
}
function setCookie (cookie) {
	if (!!cookie){
		var cookies = request.cookie(cookie);
		this.headers.Cookie = cookie;
		this._jar.setCookie(cookies, this.url.uri);
	}
    return this;
}
module.exports = Scraper;

function filterKey(a){
	//setting up empty object for ouput
	var _a = {};
	if (typeof a !== "object" || a === null)
		return _a;
	Object.keys(a)
		//get all key
		//filter key by '_'
	.filter(
		function(key){
			return key[0] === '_'
		})
		//loop the keys
	.forEach(function(key){
		//copy to _a
		_a[key] = a[key];
		//delete origin key pair
		delete a[key]
	});
	return _a;
}