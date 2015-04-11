const mongodb = require('mongodb');
module.exports.client = mongodb.MongoClient;
module.exports.url = 'mongodb://localhost:27017/flashcard';
