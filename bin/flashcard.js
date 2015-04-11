const path = require('path');
const webRoot = path.join(path.dirname(__dirname), 'public');
const express = require('express');
const bodyParser = require('body-parser');
const persistence = require('../lib/persistence.js');

var app = express();
app.use(express.static(webRoot));
app.use(bodyParser());
app.get('/questions', function(request, response) {
  console.log('get questions');
  persistence.client.connect(persistence.url, function(error, db) {
    if (error) {
      return console.dir(error);
    }
    db.collection('questions')
      .find().toArray(function(error, items) {
        if (error) {
          return console.dir(error);
        }
        response.send(items);
        db.close();
      });
  });
});
app.get('/guesses', function(request, response) {
  console.log('get guesses');
  persistence.client.connect(persistence.url, function(error, db) {
    if (error) {
      return console.dir(error);
    }
    db.collection('guesses')
      .find().toArray(function(error, items) {
        if (error) {
          return console.dir(error);
        }
        response.send(items);
        db.close();
      })
  });
});
app.post('/guesses', function(request, response) {
  console.log('post guesses');
  persistence.client.connect(persistence.url, function(error, db) {
    if (error) {
      return console.dir(error);
    }
    db.collection('guesses')
      .insert(request.body);
    response.status(200).end();
    db.close();
  });
});
app.listen(8080);
console.log('listening');
