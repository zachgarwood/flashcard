const persistence = require('../lib/persistence');
const direction = process.argv[2];

persistence.client.connect(persistence.url, function(error, db) {
  if (error) {
    return console.dir(error);
  }
  var questions = db.collection('questions');
  if (direction == 'up') {
    console.log('adding questions');
    questions
      .insert(require('../data/questions.json'), function(error, results) {
        db.close();
      });
    console.log('adding user');
    var defaultUser =
      {email: 'user@email.com', passphrase: '12345', authToken: 'token'}; 
    var users = db.collection('users');
    users.insert(defaultUser, function(error, results) {
      db.close();
    });
  } else if (direction == 'down') {
    console.log('removing questions');
    questions.drop();
    db.collection('guesses').drop();
    db.collection('users').drop();
    db.close();
  } else {
    console.log('choose a migration directon: "up" or "down"');
    db.close();
    process.exit(1);
  }
  console.log('migration complete');
});
