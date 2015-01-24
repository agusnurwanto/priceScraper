var ElasticSearchClient = require('elasticsearchclient');
var elasticSearchClient = new ElasticSearchClient({
    host: 'folbek.me',
    port: 9200
});
if (process.env.CONFIG === 'local')
    config.host = 'localhost';
if (!!process.env.SCRAPE_HOST)
    config.host = process.env.SCRAPE_HOST;
module.exports = elasticSearchClient;
