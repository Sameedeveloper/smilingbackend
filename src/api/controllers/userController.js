/**
 * Module that defines functions for processing HTTP requests to REST service and performing some operations on User object(s)
 *
 */
'use strict'

var config = require('../../config')
var User = require('../models/user')

/**
 * Return a list of all Users in database as a JSON response
 *
 * @param {Request} req
 * @param {Response} res
 */
function getAllUsers(req, res) {
  User.find({}, function (err, users) {
    if (err) {
      return res.send(err)
    }
    res.json(users)
  })
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
function createUser(req, res) {
  var newUser = new User(req.body)
  newUser.save(function (err, user) {
    if (err) {
      return res.send(err)
    }
    //if succesfully registered this user, create JSON web token for future modifications
    // var token = jwt.sign({ id: user._id }, config.tokenkey);

    // res.json({
    //  userId: user._id,
    //   authToken: token
    // });
  })
}

/**
 * Retrieve a user from userId parameter encoded in URL. Return user as JSON response.
 *
 * @param {Request} req
 * @param {Response} res
 */
function getUser(req, res) {
  User.findById(req.query.modelId, function (err, user) {
    if (err) {
      return res.send(err)
    }
    res.json(user)
  })
}

function getUserFirstName(req, res) {
  User.find({ firstName: req.query.firstName }, function (err, user) {
    if (err) {
      return res.send(err)
    }
    res.json(user)
  })
}
/**
 * Update a user, with userId parameter encoded in URL, by replacing it with user defined in JSON request body. Return updated user as JSON response.
 *
 * @param {Request} req
 * @param {Response} res
 */
function updateUser(req, res) {
  //verify that end user has permission to update this user by checking JSON web token
  var verified = verifyUser(req, res)

  if (verified) {
    //check to see if subscription level to be updated to is a valid subscription level (it is in User.subscription enum),
    //respond with error message if it is not.
    if (req.body.subscription) {
      var subscriptionEnum = User.schema.path('subscription').enumValues
      if (!Object.values(subscriptionEnum).includes(req.body.subscription)) {
        return res.json({ message: 'Invalid subscription level!' })
      }
    }

    User.findOneAndUpdate(
      { _id: req.params.userId },
      req.body,
      { new: true }, //so we return updated user instead of original user
      function (err, user) {
        if (err) {
          return res.send(err)
        }
        res.json(user)
      }
    )
  }
}

/**
 * Delete a user with given userId from database.
 *
 * @param {Request} req
 * @param {Response} res
 */
function deleteUser(req, res) {
  //verify that end user has permission to delete this user by checking JSON web token
  var verified = verifyUser(req, res)

  if (verified) {
    User.remove({ _id: req.params.userId }, function (err, user) {
      if (err) {
        return res.send(user)
      }
      res.json({ message: 'User successfully deleted' })
    })
  }
}

/**
 * Verify that the end user has permission to perform this action. This is done by decoding the JSON web token in the x-access-token header. Web token decodes into
 * userId of user that was created when web token was issued. If decoded web token matches the userId requested to perform operations on, verification is succesful
 *
 * @param {Request} req
 * @param {Response} res
 * @returns boolean that represents verification status
 */
function verifyUser(req, res) {
  var token = req.headers['x-access-token']
  if (!token) {
    res.json({ message: 'No authentication token provided!' })
    return false
  } else {
    //verify token, make sure it is the right token for modifying this user by checking if it is equivalent to user id
    var verified = false
    jwt.verify(token, config.tokenkey, function (err, decodedToken) {
      if (err) {
        res.json({ message: 'Failed to authenticate token!' })
        return false
      }

      if (decodedToken.id === req.params.userId) {
        verified = true
      } else {
        res.json({ message: 'Authentication token does not match uesr!' })
      }
    })

    return verified
  }
}

//make controller functions accessible to importing module
module.exports.getAllUsers = getAllUsers
module.exports.createUser = createUser
module.exports.getUser = getUser
module.exports.getUserFirstName = getUserFirstName
module.exports.updateUser = updateUser
module.exports.deleteUser = deleteUser
