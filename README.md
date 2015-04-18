Flashcard
=========

Install
-------

0. Install [Node](https://nodejs.org/download/), [NPM](https://github.com/npm/npm#super-easy-install), and [MongoDB](http://docs.mongodb.org/manual/installation/)
1. Download and unzip repository: `wget https://github.com/zachgarwood/flashcard/archive/master.zip && unzip master.zip`
2. Install packages: `cd flashcard-master && npm install`
3. Run migration: `node bin/migration.js up`
4. Start server: `node bin/flashcard.js`
5. Open browser and navigate to `localhost:8080`

Shortcomings
------------

1. There are no tests! I was learning React, Express, and MongoDB as I went, so unfortunately, Jasmine fell by the wayside.
2. The "authentication" is contrived and insecure. I considered making an entire user creation module, but that seemed beyond the scope of this exercise.
3. The project lacks organization. Most of the server-side code is crammed into `bin/flashcard.js` and all of the client-side code is shoved into `public/app.js`. These files would ideally be broken up into smaller modules.
4. There is no build stage. The JSX templates are interpretted on-the-fly, in-browser. The Javascript is not combined or minified. The client-side dependencies are not managed by a package manager.
5. The client-side code uses jQuery ajax calls to retrieve data. Ideally, I'd have something like Backbone's models and collections to encapuslate state and manage coordination with the server.
