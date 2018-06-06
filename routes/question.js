const auth = require('../middleware/auth');
const _ = require('lodash');
const { Question, validate } = require('../models/question');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    // const { error } = validate(req.body);
    // if (error) return res.status(400).send(error.details[0].message);
  
    // let code = await Codes.find({ keyCode: req.body.keyCode }).limit(1);
    // if (code.length > 0) return res.status(400).send('code with that key already exists.');

    question = new Question({
        keyCode: req.body.code && req.body.code.keyCode ? req.body.code.keyCode : "",
        teacher_id: req.body.code && req.body.code.teacher_id ? req.body.code.teacher_id : "",
        question: req.body.question,
        answer: req.body.answer
    });
    await question.save();
  
    res.send(_.pick(question, ['_id', 'answer']));
});

router.get('/:keyCode/:nr', auth, async (req, res) => {
    let questions = await Question.find({ keyCode: req.params.keyCode, teacher_id: req.user._id, question: req.params.nr });
    if (questions.length < 1) return res.status(400).send('No codes found.');

    questions = questions.map((v) => _.pick(v, ['question', 'answer']));

    let group = _.groupBy(questions, 'answer');
    let results = [];
    

    _.values(group).forEach((element) => {
        results.push({name: element[0].answer, value: element.length});
    });

    res.send(results);
});

module.exports = router; 