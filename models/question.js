const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const questionSchema = new mongoose.Schema({
    question: {
        type: Number,
        required: true,
        minlength: 1,
    },
    answer: {
        type: String,
        required: true,
    },
    keyCode: {
        type: String,
    },
    teacher_id: {
        type: String
    }
});

const Question = mongoose.model('Question', questionSchema);

function validateQuestion(question) {
    const schema = {
        question: Joi.number().min(1).required(),
        answer: Joi.string().required()
    };
  
    return Joi.validate(question, schema);
}

exports.validate = validateQuestion;
exports.Question = Question;