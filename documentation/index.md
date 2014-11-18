# Global





* * *

### init(args) 

[init description]

**Parameters**

**args**: `Object`, Custom options.



### setOptions() 

setting options, using one arguments: an object with key-value pair, 
or two arguments, with the first as key and second as value



### setOption() 

alias for setOptions



### setMode(mode) 

setting mode before running scrape price

**Parameters**

**mode**: `string`, Passengers count e.g: '100', '101', '110'



### prepareData() 

preparing data for scrape function arguments

**Returns**: `Object`, Data formatted for parameter in scraper function


### prepareQuery() 

preparing querystring for request function

**Returns**: `String`, String formatted for parameter in request function


### getCache() 

Get cache data from db

**Returns**: `Object`, Data price for current dt


### get(mode) 

get price by scraping it as defined in scrape option

**Parameters**

**mode**: `string`, Passengers count e.g.(100,110,101)

**Returns**: `Object`, Object Promise



* * *










