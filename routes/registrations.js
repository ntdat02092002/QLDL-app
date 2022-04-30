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
    con.getConnection(function (err, connection) {
        const sql = "SELECT * From DAILY";
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

router.get('/create', basic.check((req, res) => {
    res.render('form', { title: 'Registration form'});
}));

router.post('/create',
    [
        check('TenDaiLy')
            .isLength({ min: 1 })
            .withMessage('Please enter TenDL'),
        check('Email')
            .isLength({ min: 1 })
            .withMessage('Please enter Email'),
    ],
    basic.check((req, res) => {
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            const data = req.body;
            console.log(data)

            // save data into db
            const sql = "INSERT INTO DAILY (TenDaiLy, DienThoai, DiaChi, Email) VALUES ?";
            const values = [
                [data.TenDaiLy, data.DienThoai, data.DiaChi, data.Email]
            ];
            console.log("ok ready to insert")
            con.getConnection(function (err, connection) {
                connection.query(sql, [values], function (err, result) {
                    connection.release();
                    if (err) throw err;
                    console.log("Number of records inserted: " + result.affectedRows);
                });
            });

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

//route for delete daily
router.get('/delete/:id', basic.check((req, res) => {
    const id = req.params.id;
    con.getConnection(function (err, connection) {
        const sql = "DELETE FROM DAILY WHERE MaDaiLy = ?";
        connection.query(sql, id, function (err) {
            connection.release();
            if (err)
                res.send('Sorry! Something went wrong.');
            else
                res.redirect("/registrations");
        });
    });
}));

//route for update daily
router.get('/edit/:id', basic.check((req, res) => {
    const id = req.params.id;

    con.getConnection(function (err, connection) {
        const sql = "SELECT * From DAILY WHERE MaDaiLy = ?"
        connection.query(sql, id, function (err, rows) {
            connection.release();
            if (err)
                res.send('Sorry! Something went wrong.');
            if (rows.length <= 0)
                res.send('Sorry! Something went wrong.');
            else
                res.render('form', {
                    title: 'Update form',
                    action: '/registrations/edit/' + id,
                    data: rows[0],
                });
        });
    });
}));

router.post('/edit/:id',
    [
        check('TenDaiLy')
            .isLength({ min: 1 })
            .withMessage('Please enter TenDL'),
        check('Email')
            .isLength({ min: 1 })
            .withMessage('Please enter Email'),
    ],
    basic.check((req, res) => {
        const id = req.params.id;
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            const data = req.body;

            // update data
            const sql = "UPDATE DAILY SET TenDaiLy = ?, DienThoai = ?, DiaChi= ?, Email = ? WHERE MaDaiLy = ?";
            console.log("ok ready to update")
            con.getConnection(function (err, connection) {
                connection.query(sql, [data.TenDaiLy, data.DienThoai, data.DiaChi, data.Email, id], function (err, result) {
                    connection.release();
                    if (err) throw err;
                    console.log("Number of records updated: " + result.affectedRows);
                });
            });

            countNumber ++;
            res.render('form-submitted', {
                title: 'Update success',
            });
        } else {
            res.render('form', {
                title: 'Update form',
                errors: errors.array(),
                action: '/registrations/edit/' + id,
                data: req.body,
            });
        }
    })
);

module.exports = router;