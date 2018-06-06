const auth = require('../middleware/auth');
const _ = require('lodash');
const { Codes, validate } = require('../models/codes');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', auth, async (req, res) => {
    let codes = await Codes.find({ teacher_id: req.user._id }).select('-teacher_id');
    res.send({ codes: codes});
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    let code = await Codes.find({ keyCode: req.body.keyCode }).limit(1);
    if (code.length > 0) return res.status(400).send('code with that key already exists.');
  
    code = new Codes({
        keyCode: req.body.keyCode,
        name: req.body.name,
        teacher_id: req.user._id
    });
    await code.save();
  
    res.send(_.pick(code, ['_id', 'keyCode', 'name']));
});

router.get('/:keyCode', auth, async (req, res) => {
    let code = await Codes.findOne({ keyCode: req.params.keyCode });
    if (!code) return res.status(400).send('Invalid KeyCode');

    res.send(code);
});

router.delete('/:id', auth, async (req, res) => {
    const code = await Codes.findByIdAndRemove(req.params.id);
  
    if (!code) return res.status(404).send('Code with the given ID was not found.');
  
    res.send(code);
  });

module.exports = router; 