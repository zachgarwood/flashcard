const express = require('express');
const questions = require('../questions.json');
const guesses = require('../guesses.json');

var app = express();

app.use(express.static('public'));

app.get('/questions', function(request, response) {
  response.send(questions);
});
app.get('/guesses', function(request, response) {
  response.send(guesses);
});

var server = app.listen(8080);
