const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config/database');
const teacher = require('./routes/teacher');
const codes = require('./routes/codes')
const auth = require('./routes/auth');
const question = require('./routes/question');
const app = express();
const port = Number(process.env.PORT || 3000);

mongoose.connect(config.database)
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,x-auth-token');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use('/api/teacher', teacher);
app.use('/api/codes', codes);
app.use('/api/auth', auth);
app.use('/api/question', question);

app.listen(port, () => {
    console.log(`server started on port ${port}`);
});