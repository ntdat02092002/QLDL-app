const express = require('express');

//const con = require('../models/db-conncect')
const connection = require('../helpers/db-connection');
const query = require('../helpers/db-query');
const path = require('path');
const auth = require('http-auth');
const {check, validationResult} = require("express-validator");

const router = express.Router();

const basic = auth.basic({
    file: path.join(__dirname, '../users.htpasswd'),
});

router.get('/', basic.check(async (req, res) => {
    const conn = await connection().catch(e => {});
    const sql = "SELECT * From DAILY";
    const results = await query(conn, sql)
        .catch(e => res.send('Sorry! Something went wrong.'));
    res.render('xuat_hang/xuat-hang-test', {arrayOfDaily: results});
}));

module.exports = router;