const express = require('express');

const con = require('../models/db-conncect')
const path = require('path');
const auth = require('http-auth');
const {check, validationResult} = require("express-validator");

const router = express.Router();

const basic = auth.basic({
    file: path.join(__dirname, '../users.htpasswd'),
});

//route show all daily
router.get('/', basic.check((req, res) => {
    res.render('xuat_hang/xuat-hang-test');
}));

module.exports = router;