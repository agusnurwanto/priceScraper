var expect = require('chai').expect;
var Promise = require('promise');
var Base   = require('../../priceScraper');
describe('base class', function () {
	this.timeout(3000)
	describe('init', function () {
		it('should have property based on defaults', function (next) {
			var base = new Base();
			expect(base.scrape).to.exist;
			expect(base.dt).to.exist;
			expect(base.dt.ori).to.exist;
			expect(base.dt.dst).to.exist;
			expect(base.airline).to.exist;
			next();
 		});
		it('should have property based on options', function (next) {
			var url     = 'http://pluto.dev/price/flight';
			var options = {
				scrape : url,
				dt     : {ori: 'cgk', dst: 'sub'},
				airline: 'garuda'
			}
			var base = new Base(options);
			expect(base.scrape).to.eq(url);
			expect(base.dt.ori).to.eq('cgk');
			expect(base.dt.dst).to.eq('sub');
			expect(base.airline).to.eq('garuda');
			next();
 		});
		it('should accept options with type a function', function (next) {
			var scrapeFn = function(){return 'ok'; };
			var options  = {
				scrape : scrapeFn
			}
			var base = new Base(options);
			expect(base.scrape.toString()).to.eq(scrapeFn.toString());
			next();
 		});
 	});
	describe('setOptions', function () {
		it('should accepts object', function (next) {
			var base    = new Base;
			var url     = 'http://pluto.dev/price/flight';
			var options = {scrape : url, }
			base.setOptions(options);
			expect(base.scrape).to.eq(url);
			next();
 		});
		it('should accepts strings', function (next) {
			var base    = new Base;
			var url     = 'http://pluto.dev/price/garuda';
			var url2    = 'http://pluto.dev/price/airasia';
			var options = {scrape : url, }
			base.setOptions(options);
			expect(base.scrape).to.eq(url);
			base.setOptions('scrape', url2);
			expect(base.scrape).to.eq(url2);
			next();
 		});
 	});
	describe('setOption', function () {
		it('should accepts object', function (next) {
			var base    = new Base;
			var url     = 'http://pluto.dev/price/flight';
			var options = {scrape : url, }
			base.setOption(options);
			expect(base.scrape).to.eq(url);
			next();
 		});
		it('should accepts strings', function (next) {
			var base    = new Base;
			var url     = 'http://pluto.dev/price/garuda';
			var url2    = 'http://pluto.dev/price/airasia';
			var options = {scrape : url, }
			base.setOption(options);
			expect(base.scrape).to.eq(url);
			base.setOption('scrape', url2);
			expect(base.scrape).to.eq(url2);
			next();
 		});
 	});
	describe('setMode', function () {
		it('should set mode by default if undefined', function (next) {
			var base = new Base;
			base.setMode();
			expect(base.dt.adult).to.eq('1');
			expect(base.dt.child).to.eq('0');
			expect(base.dt.infant).to.eq('0');
			next();
 		});
		it('should set mode by default if passed weird thing -- object', function (next) {
			var base = new Base;
			base.setMode({});
			expect(base.dt.adult).to.eq('1');
			next();
 		});
		it('should set mode by default if passed weird thing -- string', function (next) {
			var base = new Base;
			base.setMode('asdadsa');
			expect(base.dt.adult).to.eq('1');
			next();
 		});
		it('should set mode by default if passed weird thing -- function', function (next) {
			var base = new Base;
			base.setMode(console.log);
			expect(base.dt.adult).to.eq('1');
			next();
 		});
 	});
	describe('prepareRequestData', function () {
		it('should prepare data for scrape function', function (next) {
			var url     = 'http://pluto.dev/price/flight';
			var options = {
				scrape : url,
				dt     : {ori: 'cgk', dst: 'sub'},
				airline: 'garuda'
			}
			var base = new Base(options);
			var data = base.prepareRequestData();
			expect(data.airline).to.eq('garuda');
			expect(data.action).to.eq('price');
			expect(data.query.ori).to.eq('cgk');
			expect(data.query.dst).to.eq('sub');
			next();
 		});
 	});
	describe('prepareRequestQuery', function () {
		it('should prepare query for request function', function (next) {
			var url     = 'http://pluto.dev/price/flight';
			var options = {
				scrape : url,
				dt     : {ori: 'cgk', dst: 'sub'},
				airline: 'garuda'
			}
			var base = new Base(options);
			var query = base.prepareRequestQuery();
			expect(query).to.contain('ori');
			expect(query).to.contain('cgk');
			expect(query).to.contain('dst');
			expect(query).to.contain('sub');
			next();
 		});
 	});
	describe('prepareDatabaseQuery', function () {
		var options = {
			airline: 'lion',
			dt     : {
				ori       : 'jog',
				dst       : 'pnk',
				flightCode: 'abc',
				classCode : 'xx',
			},
		};
		it('should return query for db', function (next) {
			var base = new Base(options);
			var query = base.prepareDatabaseQuery();
			expect(query.query.filtered.filter.and.length).to.eq(5);
			next();
 		});
		it('should return query for db with a transit', function (next) {
			options.dt.transit = 'pnk';
			var base = new Base(options);
			var query = base.prepareDatabaseQuery();
			expect(query.query.filtered.filter.and.length).to.eq(6);
			next();
 		});
		it('should return query for db with two transit', function (next) {
			options.dt.transit2 = 'pdg';
			var base = new Base(options);
			var query = base.prepareDatabaseQuery();
			expect(query.query.filtered.filter.and.length).to.eq(7);
			next();
 		});
		it('should return query for db with three transit', function (next) {
			options.dt.transit3 = 'bdo';
			var base = new Base(options);
			var query = base.prepareDatabaseQuery();
			expect(query.query.filtered.filter.and.length).to.eq(8);
			next();
 		});
 	});
	describe('getCache', function () {
		this.timeout(10000);
		it('should get cache price from db based on dt', function (next) {
			var options = {
				dt     : {
					ori: 'jog',
					dst: 'pnk',
					flightCode: 'abc',
					classCode: 'xx',
				},
				airline: 'lion'
			};
			var base = new Base(options);
			base.getCache()
				.then(function (res) {
					expect(res.adult).to.gt(0);
					next();
				})
				.catch(function (err) {
					next(err);
				});
 		});
 	});
	describe('saveCache', function () {
		this.timeout(5000);
		it('should save cache to database', function (next) {
			var options = {
				airline: 'lion',
				dt     : {
					ori       : 'jog',
					dst       : 'pnk',
					flightCode: 'abc',
					classCode : 'xx',
				},
			};
			var base = new Base(options);
			var price = {
				"adult" : 1000000,
				"child" : 1000000,
				"infant": 50000,
				"basic" : 1000000,
			}
			base.saveCache(price, function (err, res) {
				if (err)
					return next(err);
				try{res = JSON.parse(res); } catch(err){return next(err)}
				expect(res.created).to.exist;
				expect(res._index).to.eq(base.index);
				expect(res._type).to.eq(base.type);
				return next();
			});
 		});
 	});
	describe('generateId', function () {
		it('should generate id based on data', function (next) {
			var data = {
				origin     : 'cgk',
				destination: 'sub',
				airline    : 'lion',
				flight     : 'abc',
				class      : 'xx',
				prices     : {}
			};
			var base = new Base();
			var id = base.generateId(data);
			expect(id).to.eq('cgksublionabcxx')
			next();
 		});
 	});
	describe('get', function () {
		this.timeout(60000);
		// commented to move along faster
		/*it('should get price from scrape -- url', function (next) {
			var options = {
				scrape: 'http://pluto.dev/0/price/garuda',
				dt: {
					user     : 'IANTONI.JKTGI229T',
					dep_date : '27 10 2014',
					ori      : 'cgk',
					dst      : 'jog',
					dep_radio: 'c1',
					ret_radio: 'c1',
				},
				airline: 'garuda'
			}
			var base = new Base(options);
			base.get(100)
				.then(function (res) {
					var body = JSON.parse(res.body);
					expect(body.body).to.exist;
					next();
				})
				.catch(function (err) {
					next(err);
				})
 		});*/
		it('should get price from scrape -- function', function (next) {
			var scrapeFn = function (data) {
				return Promise.resolve({
					"success": true,
					"body": {"basic": 2616000, "tax": 266600, "total": 2882600 }
				});
			}
			var options = {
				scrape: scrapeFn,
				dt: {ori: 'cgk', dst: 'jog', },
				airline: 'garuda'
			}
			var base = new Base(options);
			base.get(100)
				.then(function (res) {
					var body = res.body;
					expect(body).to.exist;
					next();
				})
				.catch(function (err) {
					next(err);
				})
 		});
 	});
	describe('isCacheComplete', function () {
		it('should false if cache incomplete', function (next) {
			var cache = {'adult': 1000000 };
			var base = new Base();
			var success = base.isCacheComplete(cache);
			expect(success).to.not.ok;
			next();
 		});
		it('should true if cache complete', function (next) {
			var cache = {'adult': 1000000, 'child': 1000000, 'infant': 1000000, 'basic': 1000000, };
			var base = new Base();
			var success = base.isCacheComplete(cache);
			expect(success).to.ok;
			next();
 		});
 	});
	/*describe('Subsuite', function () {
		it('should extend parent to child method', function (next) {
			next();
 		});
 	});*/
});