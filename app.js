const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const rootRoutes = require('./routes/index');
const regsRoutes = require('./routes/registrations');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', rootRoutes);
app.use('/registrations', regsRoutes);
app.use(express.static('public'));

module.exports = app;