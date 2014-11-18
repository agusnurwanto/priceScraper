var expect = require('chai').expect;
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
	describe('prepareData', function () {
		it('should prepare data for scrape function', function (next) {
			var url     = 'http://pluto.dev/price/flight';
			var options = {
				scrape : url,
				dt     : {ori: 'cgk', dst: 'sub'},
				airline: 'garuda'
			}
			var base = new Base(options);
			var data = base.prepareData();
			expect(data.airline).to.eq('garuda');
			expect(data.action).to.eq('price');
			expect(data.query.ori).to.eq('cgk');
			expect(data.query.dst).to.eq('sub');
			next();
 		});
 	});
	describe('prepareQuery', function () {
		it('should prepare query for request function', function (next) {
			var url     = 'http://pluto.dev/price/flight';
			var options = {
				scrape : url,
				dt     : {ori: 'cgk', dst: 'sub'},
				airline: 'garuda'
			}
			var base = new Base(options);
			var query = base.prepareQuery();
			expect(query).to.contain('ori');
			expect(query).to.contain('cgk');
			expect(query).to.contain('dst');
			expect(query).to.contain('sub');
			next();
 		});
 	}); 	
	describe('getCache', function () {
		this.timeout(10000)
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
	/*describe('Subsuite', function () {
		it('should extend parent to child method', function (next) {
			next();
 		});
 	});*/
});