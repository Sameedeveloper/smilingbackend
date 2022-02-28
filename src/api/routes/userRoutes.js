'use strict'

module.exports = function (app) {
  var userController = require('../controllers/userController')

  //define each route and what controller function is called in response to HTTP methods
  app
    .route('/api/models/all')
    .get(userController.getAllUsers)
    .post(userController.createUser)

  app
    .route('/api/models/')
    .get(userController.getUser)
    .put(userController.updateUser)
    .delete(userController.deleteUser)

  app
    .route('/api/models/searchbyfirstname/')
    .get(userController.getUserFirstName)
}
