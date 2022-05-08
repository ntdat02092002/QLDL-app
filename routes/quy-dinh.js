const express = require('express');

const con = require('../models/db-conncect')
const path = require('path');
const auth = require('http-auth');
const {check, validationResult} = require("express-validator");

const router = express.Router();

const basic = auth.basic({
    file: path.join(__dirname, '../users.htpasswd'),
});

router.get('/', basic.check((req, res) => {
    /*con.getConnection(function (err, connection) {
        const sql = "SELECT * From DAILY";
        connection.query(sql, function (err, registrations) {
            connection.release();
            if (err)
                res.send('Sorry! Something went wrong.');
            else
                res.render('registrations', { title: 'Listing registrations', registrations });
        });
    });*/
    res.send("chua co gi het~");
}));


module.exports = router;