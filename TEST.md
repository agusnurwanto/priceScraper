# TOC
   - [Airasia](#airasia)
     - [run](#airasia-run)
   - [base class](#base-class)
     - [init](#base-class-init)
     - [setOptions](#base-class-setoptions)
     - [setOption](#base-class-setoption)
     - [setMode](#base-class-setmode)
     - [prepareRequestData](#base-class-preparerequestdata)
     - [prepareRequestQuery](#base-class-preparerequestquery)
     - [prepareDatabaseQuery](#base-class-preparedatabasequery)
     - [preparePricesOutputFromDB](#base-class-preparepricesoutputfromdb)
     - [getCache](#base-class-getcache)
     - [preparePricesInputToDB](#base-class-preparepricesinputtodb)
     - [saveCache](#base-class-savecache)
     - [generateId](#base-class-generateid)
     - [get](#base-class-get)
     - [getAll](#base-class-getall)
     - [calculatePrices](#base-class-calculateprices)
     - [run](#base-class-run)
     - [isCacheComplete](#base-class-iscachecomplete)
   - [Citilink](#citilink)
     - [run](#citilink-run)
   - [Express](#express)
     - [run](#express-run)
   - [Garuda](#garuda)
     - [run](#garuda-run)
<a name=""></a>

<a name="airasia"></a>
# Airasia
<a name="airasia-run"></a>
## run
<a name="base-class"></a>
# base class
<a name="base-class-init"></a>
## init
should have property based on defaults.

```js
var base = new Base();
expect(base.scrape).to.exist;
expect(base.dt).to.exist;
expect(base.dt.ori).to.exist;
expect(base.dt.dst).to.exist;
expect(base.airline).to.exist;
next();
```

should have property based on options.

```js
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
```

should accept options with type a function.

```js
var scrapeFn = function(){return 'ok'; };
var options  = {
	scrape : scrapeFn
}
var base = new Base(options);
expect(base.scrape.toString()).to.eq(scrapeFn.toString());
next();
```

<a name="base-class-setoptions"></a>
## setOptions
should accepts object.

```js
var base    = new Base;
var url     = 'http://pluto.dev/price/flight';
var options = {scrape : url, }
base.setOptions(options);
expect(base.scrape).to.eq(url);
next();
```

should accepts strings.

```js
var base    = new Base;
var url     = 'http://pluto.dev/price/garuda';
var url2    = 'http://pluto.dev/price/airasia';
var options = {scrape : url, }
base.setOptions(options);
expect(base.scrape).to.eq(url);
base.setOptions('scrape', url2);
expect(base.scrape).to.eq(url2);
next();
```

<a name="base-class-setoption"></a>
## setOption
should accepts object.

```js
var base    = new Base;
var url     = 'http://pluto.dev/price/flight';
var options = {scrape : url, }
base.setOption(options);
expect(base.scrape).to.eq(url);
next();
```

should accepts strings.

```js
var base    = new Base;
var url     = 'http://pluto.dev/price/garuda';
var url2    = 'http://pluto.dev/price/airasia';
var options = {scrape : url, }
base.setOption(options);
expect(base.scrape).to.eq(url);
base.setOption('scrape', url2);
expect(base.scrape).to.eq(url2);
next();
```

<a name="base-class-setmode"></a>
## setMode
should set mode by default if undefined.

```js
var base = new Base;
base.setMode();
expect(base.dt.adult).to.eq('1');
expect(base.dt.child).to.eq('0');
expect(base.dt.infant).to.eq('0');
next();
```

should set mode by default if passed weird thing -- object.

```js
var base = new Base;
base.setMode({});
expect(base.dt.adult).to.eq('1');
next();
```

should set mode by default if passed weird thing -- string.

```js
var base = new Base;
base.setMode('asdadsa');
expect(base.dt.adult).to.eq('1');
next();
```

should set mode by default if passed weird thing -- function.

```js
var base = new Base;
base.setMode(console.log);
expect(base.dt.adult).to.eq('1');
next();
```

<a name="base-class-preparerequestdata"></a>
## prepareRequestData
should prepare data for scrape function.

```js
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
```

<a name="base-class-preparerequestquery"></a>
## prepareRequestQuery
should prepare query for request function.

```js
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
```

<a name="base-class-preparedatabasequery"></a>
## prepareDatabaseQuery
should return query for db.

```js
var base = new Base(options);
var query = base.prepareDatabaseQuery();
expect(query.query.filtered.filter.and.length).to.eq(5);
next();
```

should return query for db with a transit.

```js
options.dt.transit = 'pnk';
var base = new Base(options);
var query = base.prepareDatabaseQuery();
expect(query.query.filtered.filter.and.length).to.eq(6);
next();
```

should return query for db with two transit.

```js
options.dt.transit2 = 'pdg';
var base = new Base(options);
var query = base.prepareDatabaseQuery();
expect(query.query.filtered.filter.and.length).to.eq(7);
next();
```

should return query for db with three transit.

```js
options.dt.transit3 = 'bdo';
var base = new Base(options);
var query = base.prepareDatabaseQuery();
expect(query.query.filtered.filter.and.length).to.eq(8);
next();
```

<a name="base-class-preparepricesoutputfromdb"></a>
## preparePricesOutputFromDB
should prepare prices output from db.

```js
var base = new Base();
var prices = ''
next();
```

<a name="base-class-getcache"></a>
## getCache
should get cache price from db based on dt.

```js
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
```

<a name="base-class-preparepricesinputtodb"></a>
## preparePricesInputToDB
should prepare prices output from db.

```js
var base = new Base();
var prices = ''
next();
```

<a name="base-class-savecache"></a>
## saveCache
should save cache to database.

```js
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
	// console.log(res);
	try{res = JSON.parse(res); } catch(err){return next(err)}
	expect(res.created).to.exist;
	expect(res._index).to.eq(base.index);
	expect(res._type).to.eq(base.type);
	return next();
});
```

<a name="base-class-generateid"></a>
## generateId
should generate id based on data.

```js
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
```

<a name="base-class-get"></a>
## get
should get price from scrape -- function.

```js
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
```

<a name="base-class-getall"></a>
## getAll
<a name="base-class-calculateprices"></a>
## calculatePrices
should return prices formatted from results.

```js
var childPrototype = {
	calculateAdult: function (results) {
		var _100 = results[0];
		return _100.total
	},
	calculateChild: function (results) {
		var _100 = results[0];
		var _110 = results[1];
		return _110.total - _100.total;
	},
	calculateInfant: function (results) {
		var _100 = results[0];
		var _101 = results[2];
		return _101.total - _100.total;
	},
	calculateBasic: function (results) {
		var _100 = results[0];
		return _100.basic
	},
}
var ChildBase = Base.extend(childPrototype);
var child = new ChildBase;
var results = [ { basic: 2616000, tax: 266600, total: 2882600 },
	{ basic: 4578000, tax: 467800, total: 5045800 },
	{ basic: 2878000, tax: 297800, total: 3175800 } ];
var prices = child.calculatePrices(results);
expect(prices.adult).to.exist;
expect(prices.child).to.exist;
expect(prices.infant).to.exist;
expect(prices.basic).to.exist;
next();
```

<a name="base-class-run"></a>
## run
<a name="base-class-iscachecomplete"></a>
## isCacheComplete
should false if cache incomplete.

```js
var cache = {'adult': 1000000 };
var base = new Base();
var success = base.isCacheComplete(cache);
expect(success).to.not.ok;
next();
```

should true if cache complete.

```js
var cache = {'adult': 1000000, 'child': 1000000, 'infant': 1000000, 'basic': 1000000, };
var base = new Base();
var success = base.isCacheComplete(cache);
expect(success).to.ok;
next();
```

<a name="citilink"></a>
# Citilink
<a name="citilink-run"></a>
## run
should check db and then scrape and then save .

```js
var dt = {
	rute       : 'OW',
	ori        : 'SUB',
	dst        : 'CGK',
	adult      : '1',
	child      : '0',
	infant     : '0',
	dep_date   : '27+11+2014',
	id_maskapai: '9',
	user       : 'mitrabook',
	rute       : 'OW',
	dep_radio  : '1Fare6',
	_          : '1416361230832',
}
var urlAirbinder = 'http://128.199.251.75:4/price';
var urlPluto = 'http://pluto.dev/0/price/citilink';
var options = {
	scrape: urlAirbinder,
	dt: dt,
	airline: 'citilink'
};
var citilink = new Citilink(options);
citilink.run()
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
```

<a name="express"></a>
# Express
<a name="express-run"></a>
## run
should check db and then scrape and then save .

```js
var dt = {
	rute       : 'OW',
	ori        : 'JOG',
	dst        : 'PNK',
	adult      : '1',
	child      : '0',
	infant     : '0',
	dep_date   : '30+11+2014',
	id_maskapai: '9',
	user       : '35054',
	id_maskapai: '9',
	rute       : 'OW',
	dep_radio  : 'normal',
	_          : '1416361230832',
}
var urlAirbinder = 'http://128.199.251.75:8097/price';
var urlPluto = 'http://pluto.dev/0/price/express';
var options = {
	scrape: urlAirbinder,
	dt: dt,
	airline: 'express'
};
var express = new Express(options);
express.run()
	.then(function (prices) {
		// console.log(prices);
		expect(prices.adult).to.exist;
		expect(prices.child).to.exist;
		expect(prices.infant).to.exist;
		expect(prices.basic).to.exist;
		next()
	})
	.catch(function (err) {
		return next(err);
	});
```

<a name="garuda"></a>
# Garuda
<a name="garuda-run"></a>
## run
should check db and then scrape and then save .

```js
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
	scrape: urlPluto,
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
```

