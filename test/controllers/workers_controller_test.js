const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');

const Worker = mongoose.model('worker');

describe('Workers controller', () => {
  it('Post to /api/workers creates a new worker', (done) => {
    Worker.count().then(count => { //coount workers for test comparison
      request(app) //using supertest library
        .post('/api/workers')
        .send( { email: 'test@test.com' } ) //sending along data to test required email schema
        .end(() => {
          Worker.count().then(newCount => { //compare count after test data sent to mongo
            assert(count + 1 === newCount);
            done();
          });
        });
    });
  });

  it('PUT to /api/workers/id edits an existing worker', (done) => {
    //step 1 create a worker - test changing driving from false to true
    const worker = new Worker({ email: 't1@t.com', driving: false });
    //step 2 save and edit the new worker 'driving flag'
    worker.save().then(() => {
      request(app)
        .put(`/api/workers/${worker._id}`) //es6 syntax equivalent to ('/api/workers/' + worker_id)
        .send({ working: true })
        .end(() => {
          // step 3 test to find worker in mongo where flag for worker_id is now true
          Worker.findOne({ email: 't1@t.com' })
            .then(worker => {
              assert(worker.working === true);
              done();
            });
        });
    });
  });

  it('DELETE to /api/workers/id deletes an existing worker', (done) => {
    //test logic create worker, delete worker, then test assert no worker can be found
    const worker = new Worker({ email: 'test2_delete@t.com' });

    //step 2 save and then delete the new worker
    worker.save().then(() => {
      request(app)
        .delete(`/api/workers/${worker._id}`)
        .end(() => {
          // step 3 test to find worker in mongo where flag for worker_id is now true
          Worker.findOne({ email: 'test2_delete@t.com' })
            .then(worker => {
              assert(worker === null);
              done();
            });
        });
    });
  });

  it('Get to /api/workers finds workers in a location', (done) => {
      const seattleWorker = new Worker({
        email: 'seattle@test.com',
        geometry: { type: 'Point', coordinates: [-122.4759902, 47.6147628] }
      });
      const miamiWorker = new Worker({
        email: 'miami@test.com',
        geometry: { type: 'Point', coordinates: [-80.2534507, 25.791581] }
      });

      Promise.all([seattleWorker.save(), miamiWorker.save()])
        .then(() => {
          request(app)
            .get('/api/workers?lng=-80&lat=25')
            .end((err, response) => {
              console.log(response.body[0].dis); //to display geoNear distance from query point
              assert(response.body.length === 1);
              assert(response.body[0].obj.email === 'miami@test.com');
              done();
            });
        });
    });
});
