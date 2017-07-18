const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const app = express();
const TwitterPackage = require('twitter');
const twitterConfig = require('./config.json');

mongoose.Promise = global.Promise; //fix mongoose deprecation warnings
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect('mongodb://localhost/gigeco', {useMongoClient: true});
};

// import twitter configuration files
const twitterSecrets = {
  consumer_key: twitterConfig.consumer_key,
  consumer_secret: twitterConfig.consumer_secret,
  access_token_key: twitterConfig.access_token_key,
  access_token_secret: twitterConfig.access_token_secret
};

const Twitter = new TwitterPackage(twitterSecrets);

Twitter.post('statuses/update', {status: 'Kia ora ano!'},  function(error, tweet, response){
  if(error){
    console.log(error);
  }
  console.log(tweet);  // Tweet body.
  console.log(response);  // Raw response object.
});

//middleware to transform incoming json request data into an object
app.use(bodyParser.json());
routes(app);

//middleware to handle errors
app.use((err, req, res, next) => {
  res.status(422).send({ error: err.message });
});

module.exports = app;
