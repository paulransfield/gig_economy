const WorkersController = require('../controllers/workers_controller');

module.exports = (app) => {
  app.get('/api', WorkersController.greeting);

  app.post('/api/workers', WorkersController.create);

  app.put('/api/workers/:id', WorkersController.edit);

  app.delete('/api/workers/:id', WorkersController.delete);

  app.get('/api/workers', WorkersController.index);

};
