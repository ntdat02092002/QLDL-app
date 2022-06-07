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


//phieu thu
router.get('/', basic.check(async (req, res) => {  
    const conn = await connection().catch(e => {});
    const sql_1 = "SELECT MaDaiLy, TenDaiLy, TienNo, DiaChi, Email " +
                    "From DAILY JOIN LOAIDAILY ON DAILY.MaLoaiDaiLy = LOAIDAILY.MaLoaiDaiLy";
    const arrayOfDaily = await query(conn, sql_1)
        .catch(e => res.send('Sorry! Something went wrong.'));

    conn.end();
    
    res.render('thu_tien/phieu_thu/phieu-thu.pug',{arrayOfDaily:arrayOfDaily});
}));
router.post('/phieu-thu', basic.check(async (req, res) => {
    const data = req.body;
    console.log(data);
    const conn = await connection().catch(e => res.send('Sorry! Something went wrong.'));
    const sql_1 = "INSERT INTO PHIEUTHUTIEN (MaDaiLy, NgayLapPhieu, TienThu) VALUES ?";
    const value = [[parseInt(data.MaDaiLy), data.NgayLapPhieu, parseInt(data.TienThu)]];
    const result = await query(conn, sql_1, [value])
        .catch(e => res.send('Sorry! Something went wrong.'));
    const MaPhieuThu = result.insertId;


    const sql_2 = "UPDATE DAILY SET TienNo = TienNo - ? WHERE MaDaiLy = ?";
    await query(conn, sql_2, [parseInt(data.TienThu), parseInt(data.MaDaiLy)])
        .catch(e => {res.send('Sorry! Something went wrong.'); console.log(e)});

    conn.end();
    res.render("thu_tien/phieu_thu/phieu-thu-submitted.pug");
}));


module.exports = router;