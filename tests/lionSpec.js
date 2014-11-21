var expect = require('chai').expect;
var Scrapers = require('../index');
var Lion = Scrapers.lion;
describe('Lion', function () {
	this.timeout(60000);
	describe('run', function () {
		it('should check db and then scrape and then save ', function (next) {
			var dt = {
				rute       : 'OW',
				ori        : 'SUB',
				dst        : 'CGK',
				adult      : '1',
				child      : '0',
				infant     : '0',
				dep_date   : '27+Nov+2014',
				id_maskapai: '9',
				user       : 'ndebomitra',
				rute       : 'OW',
				dep_radio  : 'M0_C0_F0_S5',
				dep_last_radio  : 'M0_C0_F0',
				_          : '1416361230832',
				priceScraper: false,
			}
			var urlAirbinder = 'http://128.199.251.75:2/price';
			var urlPluto = 'http://pluto.dev/0/price/lion';
			var options = {
				scrape: urlAirbinder,
				dt: dt,
				airline: 'lion'
			};
			var lion = new Lion(options);
			lion.run()
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