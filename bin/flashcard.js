const path = require('path');
const webRoot = path.join(path.dirname(__dirname), 'public');
const express = require('express');
const persistence = require('../lib/persistence.js');

var app = express();
app.use(express.static(webRoot));
app.get('/questions', function(request, response) {
  console.log('questions');
  persistence.client.connect(persistence.url, function(error, db) {
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
app.listen(8080);
