const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { Teacher, validate } = require('../models/teacher');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/me', auth, async (req, res) => {
    const teacher = await Teacher.findById(req.user._id).select('-password');
    res.send({user: teacher});
});
  
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    let teacher = await Teacher.find({ email: req.body.email }).limit(1);
    if (teacher.length > 0) return res.status(400).send('User already registered.');
  
    teacher = new Teacher(_.pick(req.body, ['firstname', 'lastname', 'email', 'password', 'school']));
    const salt = await bcrypt.genSalt(10);
    teacher.password = await bcrypt.hash(teacher.password, salt);
    await teacher.save();
  
    const token = teacher.generateAuthToken();
    res.header('x-auth-token', token).send({ user: _.pick(teacher, ['firstname', 'lastname', 'email', 'password', 'school']), token: token });
});
  
module.exports = router; 