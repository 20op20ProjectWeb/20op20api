const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const config = require('../config/config');

const teacherSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 30
    },
    lastname:{
        type: String,
        required: true,
        minlength: 1,
        maxlength: 30
    },
    school:{
        type: String,
        required: true,
        minlength: 2,
    },
    email:{
        type: String,
        unique: true,
        required: true,
        minlength: 5,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    }
});

teacherSchema.methods.generateAuthToken = function() { 
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.JWT_SECRET);
    return token;
}

const Teacher = mongoose.model('Teacher', teacherSchema);

function validateTeacher(teacher) {
    const schema = {
      firstname: Joi.string().min(1).max(30).required(),
      lastname: Joi.string().min(1).max(30).required(),
      school: Joi.string().min(2).required(),
      email: Joi.string().min(5).required().email(),
      password: Joi.string().required(),
    };
  
    return Joi.validate(teacher, schema);
}

exports.validate = validateTeacher;
exports.Teacher = Teacher;