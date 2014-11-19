var expect = require('chai').expect;
var Scrapers = require('../index');
var Airasia = Scrapers.airasia;
describe('Airasia', function () {
	this.timeout(30000);
	describe('run', function () {
		it('should check db and then scrape and then save ', function (next) {
			var dt = {
				rute       : 'OW',
				ori        : 'CGK',
				dst        : 'SUB',
				adult      : '1',
				child      : '0',
				infant     : '0',
				dep_date   : '30+11+2014',
				id_maskapai: '9',
				user       : 'apwqz',
				id_maskapai: '9',
				rute       : 'OW',
				dep_radio  : '1_1',
				_          : '1416361230832',
			}
			var urlAirbinder = 'http://128.199.251.75:99/price';
			var urlPluto = 'http://pluto.dev/0/price/airasia';
			var options = {
				scrape: urlAirbinder,
				dt: dt,
				airline: 'airasia'
			};
			var airasia = new Airasia(options);
			airasia.run()
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