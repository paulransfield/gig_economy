const mongoose = require('mongoose');

before(done => {
  mongoose.connect('mongodb://localhost/gigeco_test', {useMongoClient: true});
  mongoose.connection
    .once('open', () => done())
    .on('error', error => {
      console.warn('Warning', error);
    });
});

beforeEach(done => {
  const workers = mongoose.connection.collections.workers;
  workers.drop()
    .then(() => workers.ensureIndex({ 'geometry.coordinates':'2dsphere' })) //persist coordinates from being dropped
    .then(() => done())
    .catch(() => done()); //for when database doesn't exist
});
