var ElasticSearchClient = require('elasticsearchclient');
var elasticSearchClient = new ElasticSearchClient({
    host: 'folbek.me',
    port: 9200
});
module.exports = elasticSearchClient;