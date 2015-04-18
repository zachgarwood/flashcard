Flashcard
=========

Install
-------

0. Install [Node](https://nodejs.org/download/), [NPM](https://github.com/npm/npm#super-easy-install), and [MongoDB](http://docs.mongodb.org/manual/installation/)
1. Download and unzip repository: `wget https://github.com/zachgarwood/flashcard/archive/master.git && unzip master.zip`
2. Install packages: `cd flashcard-master && npm install`
3. Run migration: `node bin/migration.js up`
4. Start server: `node bin/flashcard.js`
5. Open browser and navigate to `localhost:8080`
