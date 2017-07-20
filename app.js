const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const Twitter = require('./app_twitter');
const app = express();

mongoose.Promise = global.Promise; //fix mongoose deprecation warnings
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect('mongodb://localhost/gigeco', {useMongoClient: true});
};

//middleware to transform incoming json request data into an object
app.use(bodyParser.json());
routes(app);

//middleware to handle errors
app.use((err, req, res, next) => {
  res.status(422).send({ error: err.message });
});

module.exports = app;
