/**
 * Define and set up an express server that provides a REST API to modify User object in MongoDB Database
 *
 * @author Nick Parisi
 */

'use strict'

var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var cors = require('cors')
//import user model so that mongoose schema gets defined and provided to mongoose instance
var user = require('./api/models/user')

const DATABASE_URL =
  'mongodb+srv://Sameed:Sodium_carbonate_123@taskman.cd6go.mongodb.net/smiling?retryWrites=true&w=majority'

//REST service
var app = express()
//use port from PORT environment variable or default to 3000
var port = process.env.PORT || 3000

//open a local mongoose connection with provided database URL
mongoose
  .connect(
    DATABASE_URL,
    { useNewUrlParser: true } //old parser will be deprecated soon
  )
  .then(() => {
    console.log('connected to dp')
  })

//add middleware to express server to parse urlencoded and json body requests, and attach them to req.body
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//enable cross origin resource sharing by adding middleware library
//this allows React front end to make HTTP requests
app.use(cors())

//import userRoutes function. Call with server obj to set up routes
var userRoutes = require('./api/routes/userRoutes')
userRoutes(app)

//begin listening for HTTP requests
app.listen(port)

console.log('REST service started on: ' + port)
