const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const rootRoutes = require('./routes/index');
const xuathangRoutes = require('./routes/xuat-hang')
const regsRoutes = require('./routes/registrations');
const dangkiRoutes = require('./routes/dang-ki');
const nhaphangRoutes = require('./routes/nhap-hang');
const bccongnoRoutes = require('./routes/bc-cong-no');
const bcdoanhsoRoutes = require('./routes/bc-doanh-so');
const thutienRoutes = require('./routes/thu-tien');
const quydinhRoutes = require('./routes/quy-dinh');
const tracuuRoutes = require('./routes/tra-cuu');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', rootRoutes);
app.use('/registrations', regsRoutes);
app.use('/xuat-hang', xuathangRoutes);
app.use('/dang-ki', dangkiRoutes);
app.use('/nhap-hang', nhaphangRoutes);
app.use('/bc-cong-no', bccongnoRoutes);
app.use('/bc-doanh-so', bcdoanhsoRoutes);
app.use('/thu-tien', thutienRoutes);
app.use('/quy-dinh', quydinhRoutes);
app.use('/tra-cuu', tracuuRoutes);
app.use(express.static('public'));

module.exports = app;