const Worker = require('../models/worker');

module.exports = {
  // each key value pair represents a request handler
  greeting(req, res) {
    res.send({ hi : "there" });
  },

  index(req, res, next) {
    //refer mongoose docs on geoNear and GeoJSON
    const lng = req.query.lng;
    const lat = req.query.lat;

    Worker.geoNear(
      { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] }, //parseFloat to convert string to decimal
      { spherical: true, maxDistance: 200000 }
    )
      .then(workers => res.send(workers))
      .catch(next);
  },

  create(req, res, next) {
    const workerProps = req.body;

    Worker.create(workerProps)
      .then(worker => res.send(worker))
      .catch(next);
  },

  edit(req, res, next) {
    const workerId = req.params.id;
    const workerProps = req.body;

    Worker.findByIdAndUpdate({ _id: workerId}, workerProps)
      .then(() => Worker.findById({ _id: workerId }))
      .then(() => res.send(worker))
      .catch(next);
  },

  delete(req, res, next) {
    const workerId = req.params.id;

    Worker.findByIdAndRemove({ _id:  workerId })
      .then(worker => res.status(204).send(worker))
      .catch(next);
  }
};
