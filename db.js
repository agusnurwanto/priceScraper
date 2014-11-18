var ElasticSearchClient = require('elasticsearchclient');
var elasticSearchClient = new ElasticSearchClient({
    host: 'localhost',
    port: 9200
});
module.exports = elasticSearchClient;