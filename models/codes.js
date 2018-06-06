const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const config = require('../config/config');

const codeSchema = new mongoose.Schema({
    keyCode: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
        unique: true
    },
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30
    },
    teacher_id: {
        type: String,
        required: true,
    }
});

const Codes = mongoose.model('Code', codeSchema);

function validateCode(code) {
    const schema = {
        keyCode: Joi.string().min(2).max(30).required(),
        name: Joi.string().min(2).max(30).required()
    };
  
    return Joi.validate(code, schema);
}

exports.validate = validateCode;
exports.Codes = Codes;