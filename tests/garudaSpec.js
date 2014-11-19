var expect = require('chai').expect;
var Scrapers = require('../index');
var Garuda = Scrapers.garuda;
describe('Garuda', function () {
	this.timeout(60000);
	describe('run', function () {
		it('should check db and then scrape and then save ', function (next) {
			var dt = {
				'user'     : 'IANTONI.JKTGI229T',
				'dep_date' : '27 10 2014',
				'ret_date' : '30 10 2014',
				'ori'      : 'cgk',
				'dst'      : 'jog',
				'rute'     : 'ow',
				'dep_radio': 'c1',
				'ret_radio': 'c1',
				'adult'    : '1',
				'child'    : '0',
				'infant'   : '0',
			}
			var urlAirbinder = 'http://128.199.251.75:9098/price';
			var urlPluto = 'http://pluto.dev/0/price/garuda';
			var options = {
				scrape: urlAirbinder,
				dt: dt,
				airline: 'garuda'
			};
			var garuda = new Garuda(options);
			garuda.run()
				.then(function (prices) {
					// console.log(prices);
					expect(prices.adult).to.exist;
					expect(prices.child).to.exist;
					expect(prices.infant).to.exist;
					expect(prices.basic).to.exist;
					next();
				})
				.catch(function (err) {
					return next(err);
				});
 		});
 	});
});