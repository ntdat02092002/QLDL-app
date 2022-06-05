const express = require('express');

const connection = require('../helpers/db-connection');
const query = require('../helpers/db-query');
const path = require('path');
const auth = require('http-auth');
const {check, validationResult} = require("express-validator");

const router = express.Router();

const basic = auth.basic({
    file: path.join(__dirname, '../users.htpasswd'),
});

router.get('/', basic.check(async(req, res, next) => {
    const conn = await connection().catch(e => {});
    const sqlDaily='SELECT MaDaiLy, TenDaiLy, MaLoaiDaiLy, MaQuan, TienNo, Email FROM DAILY';
    const dataDaiLy = await query(conn, sqlDaily)
        .catch(e => res.send('Sorry! Something went wrong.'));

    conn.end();
    res.render('tra_cuu/tra_cuu.ejs', {userData: dataDaiLy});
}));



router.get('/tra_cuu_ten', basic.check(async(req, res) => {
    const key = req.query.search_bar;
    const conn = await connection().catch(e => {});
    const sqltenDaily= 'SELECT MaDaiLy, TenDaiLy, MaLoaiDaiLy, MaQuan, TienNo, Email FROM DAILY WHERE TenDaiLy = ?'; 
    const dataDaiLyCanTim = await query(conn, sqltenDaily, key)
        .catch(e => res.send('Sorry! Something went wrong.'));
    conn.end();
    res.render('tra_cuu/ket_qua.ejs', {userData: dataDaiLyCanTim});
}));







module.exports = router;