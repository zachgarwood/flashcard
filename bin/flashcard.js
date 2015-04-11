const path = require('path');
const express = require('express');
const mongodb = require('mongodb');
const dbUrl = 'mongodb://localhost:27017/flashcard';
const webRoot = path.join(path.dirname(__dirname), 'public');

var app = express();
var mongoClient = mongodb.MongoClient;

app.use(express.static(webRoot));
app.get('/questions', function(request, response) {
  console.log('questions');
  mongoClient.connect(dbUrl, function(error, db) {
    if (error) {
      return console.dir(error);
    }
    var questions = db.collection('questions');
    questions.find().toArray(function(error, items) {
      response.send(items);
      db.close();
    });
  });
});
app.get('/guesses', function(request, response) {
  console.log('guesses');
  response.send(require('./guesses.json'));
});

var server = app.listen(8080);
console.log('listening');
mongoClient.connect(dbUrl, function(error, db) {
  if (error) {
    return console.dir({'error': error});
  }
  db.collection('questions').drop();
  db.collection('questions')
    .insert(require('./questions.json'), {w:1}, function(error, results) {
      console.log('adding questions');
      db.close()
    });
});
