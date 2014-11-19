var expect = require('chai').expect;
var Scrapers = require('../index');
var Sriwijaya = Scrapers.sriwijaya;
describe('Sriwijaya', function () {
	this.timeout(30000);
	describe('run', function () {
		it('should check db and then scrape and then save ', function (next) {
			var dt = {
				rute       : 'OW',
				ori        : 'SUB',
				dst        : 'CGK',
				adult      : '1',
				child      : '0',
				infant     : '0',
				dep_date   : '27+11+2014',
				id_maskapai: '9',
				user       : 'DEPAG0101',
				rute       : 'OW',
				dep_radio  : 'SJ+267_E',
				dep_last_radio  : 'M0_C0_F0',
				_          : '1416361230832',
			}
			var urlAirbinder = 'http://128.199.251.75:9019/price';
			var urlPluto = 'http://pluto.dev/0/price/sriwijaya';
			var options = {
				scrape: urlAirbinder,
				dt: dt,
				airline: 'sriwijaya'
			};
			var sriwijaya = new Sriwijaya(options);
			sriwijaya.run()
				.then(function (prices) {
					console.log(prices);
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