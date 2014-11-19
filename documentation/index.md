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



### prepareRequestData() 

preparing data for scrape function arguments

**Returns**: `Object`, Data formatted for parameter in scraper function


### prepareRequestQuery() 

preparing querystring for request function

**Returns**: `String`, String formatted for parameter in request function


### prepareDatabaseQuery() 

create query for retrieving data from db

**Returns**: `string`, query for db


### getCache() 

Get cache data from db

**Returns**: `Object`, Data price for current dt


### saveCache(price) 

save price data to db

**Parameters**

**price**: `Object`, object containing price data



### get(mode) 

get price by scraping it as defined in scrape option

**Parameters**

**mode**: `string`, Passengers count e.g.(100,110,101)

**Returns**: `Object`, Object Promise


### getAll() 

get scrape data all modes

**Returns**: `Object`, Array of object containing data price


### calculatePrices(results) 

return formatted prices from results

**Parameters**

**results**: `object`, Results from getAll

**Returns**: `Object`, Formatted prices to be outputted


### generateId(data) 

internal function used when saving data to db

**Parameters**

**data**: `Object`, Save to db

**Returns**: `string`, id for db


### isCacheComplete(cache) 

check if cache qualified as complete

**Parameters**

**cache**: `Object`, data from db

**Returns**: `Boolean`, whether cache incomplete or not



* * *










