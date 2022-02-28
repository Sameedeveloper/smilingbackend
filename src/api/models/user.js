'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UserSchema = new Schema({
  firstName: {
    type: String,
    //required: true,
  },
  secondName: {
    type: String,
    //required: true,
  },
  email: {
    type: String,
    // required: true,
  },
  gender: {
    type: String,
    // required: true,
  },
  professionId: {
    type: String,
    // required: true,
  },
  ShoeSizeId: {
    type: String,
    // required: true,
  },
  BraSizeId: {
    type: String,
    // required: true,
  },
  CastingTypeId: {
    type: String,
    // required: true,
  },
  HairColorId: {
    type: String,
    // required: true,
  },
  HairLengthId: {
    type: String,
    // required: true,
  },
  HeightId: {
    type: String,
    // required: true,
  },
  WaistSizeId: {
    type: String,
    // required: true,
  },
  WeightId: {
    type: String,
    // required: true,
  },
  birthDate: {
    type: Date,
    // required: true,
  },
})

//when this module is imported, add UserSchema to mongoose instance
module.exports = mongoose.model('User', UserSchema)
