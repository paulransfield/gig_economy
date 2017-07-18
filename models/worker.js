const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PointSchema = new Schema({
  type: {
    type: String,
    default: 'Point'
  },
  coordinates: {
    type: [Number],
    index: '2dsphere'
  }
});

const WorkerSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  working: {
    type: Boolean,
    default: false
  },
  geometry: PointSchema
});

const Worker = mongoose.model('worker', WorkerSchema);

module.exports = Worker;