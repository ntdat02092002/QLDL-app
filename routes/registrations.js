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
    con.getConnection(function (err, connection) {
        const sql = "SELECT * From DAILY"
        connection.query(sql, function (err, registrations) {
            connection.release();
            if (err)
                res.send('Sorry! Something went wrong.');
            else
                res.render('registrations', { title: 'Listing registrations', registrations });
        });
    });
}));

//route for create new daily
let countNumber = 1;

router.get('/create', basic.check((req, res) => {
    res.render('form', { title: 'Registration form' });
}));

router.post('/create',
    [
        check('name')
            .isLength({ min: 1 })
            .withMessage('Please enter a name'),
        check('email')
            .isLength({ min: 1 })
            .withMessage('Please enter an email'),
    ],
    basic.check((req, res) => {
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            const data = req.body;
            console.log(data)

            // save data into db
            const sql = "INSERT INTO DAILY (MaDaiLy, TenDaiLy, DienThoai, DiaChi, Email) VALUES ?"
            const values = [
                ["DL00" + countNumber, data.name, data.phoneNumber, data.address, data.email]
            ];
            console.log("ok ready to insert")
            con.getConnection(function (err, connection) {
                connection.query(sql, [values], function (err, result) {
                    connection.release();
                    if (err) throw err;
                    console.log("Number of records inserted: " + result.affectedRows);
                });
            });

            countNumber ++;
            res.render('form-submitted', {
                title: 'Registration success',
            });
        } else {
            res.render('form', {
                title: 'Registration form',
                errors: errors.array(),
                data: req.body,
            });
        }
    })
);

module.exports = router;