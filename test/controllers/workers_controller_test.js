const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');

const Worker = mongoose.model('worker');

describe('Drivers controller', () => {
  it('Post to /api/drivers creates a new driver', (done) => {
    Driver.count().then(count => { //coount drivers for test comparison
      request(app) //using supertest library
        .post('/api/drivers')
        .send( { email: 'test@test.com' } ) //sending along data to test required email schema
        .end(() => {
          Driver.count().then(newCount => { //compare count after test data sent to mongo
            assert(count + 1 === newCount);
            done();
          });
        });
    });
  });

  it('PUT to /api/drivers/id edits an existing driver', (done) => {
    //step 1 create a driver - test changing driving from false to true
    const driver = new Driver({ email: 't1@t.com', driving: false });
    //step 2 save and edit the new driver 'driving flag'
    driver.save().then(() => {
      request(app)
        .put(`/api/drivers/${driver._id}`) //es6 syntax equivalent to ('/api/drivers/' + driver_id)
        .send({ driving: true })
        .end(() => {
          // step 3 test to find driver in mongo where flag for driver_id is now true
          Driver.findOne({ email: 't1@t.com' })
            .then(driver => {
              assert(driver.driving === true);
              done();
            });
        });
    });
  });

  it('DELETE to /api/drivers/id deletes an existing driver', (done) => {
    //test logic create driver, delete driver, then test assert no driver can be found
    const driver = new Driver({ email: 'test2_delete@t.com' });

    //step 2 save and then delete the new driver
    driver.save().then(() => {
      request(app)
        .delete(`/api/drivers/${driver._id}`)
        .end(() => {
          // step 3 test to find driver in mongo where flag for driver_id is now true
          Driver.findOne({ email: 'test2_delete@t.com' })
            .then(driver => {
              assert(driver === null);
              done();
            });
        });
    });
  });

  it('Get to /api/drivers finds drivers in a location', (done) => {
      const seattleDriver = new Driver({
        email: 'seattle@test.com',
        geometry: { type: 'Point', coordinates: [-122.4759902, 47.6147628] }
      });
      const miamiDriver = new Driver({
        email: 'miami@test.com',
        geometry: { type: 'Point', coordinates: [-80.2534507, 25.791581] }
      });

      Promise.all([seattleDriver.save(), miamiDriver.save()])
        .then(() => {
          request(app)
            .get('/api/drivers?lng=-80&lat=25')
            .end((err, response) => {
              console.log(response.body[0].dis); //to display geoNear distance from query point
              assert(response.body.length === 1);
              assert(response.body[0].obj.email === 'miami@test.com');
              done();
            });
        });
    });
});
