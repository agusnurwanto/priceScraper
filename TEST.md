# TOC
   - [base class](#base-class)
     - [init](#base-class-init)
     - [setOptions](#base-class-setoptions)
     - [setOption](#base-class-setoption)
     - [setMode](#base-class-setmode)
     - [prepareData](#base-class-preparedata)
     - [prepareQuery](#base-class-preparequery)
     - [getCache](#base-class-getcache)
     - [get](#base-class-get)
<a name=""></a>
 
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

<a name="base-class-preparedata"></a>
## prepareData
should prepare data for scrape function.

```js
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
```

<a name="base-class-preparequery"></a>
## prepareQuery
should prepare query for request function.

```js
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

