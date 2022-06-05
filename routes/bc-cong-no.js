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

router.get('/', basic.check((req, res, next) => {
    res.render('cong_no/search.ejs');
}));

router.get('/cong-no', basic.check(async(req, res,) => {
    const key = req.query.search_bar;
    const querydate = req.query.month;

    const conn = await connection().catch(e => {});

    const sqltienno = 'SELECT * FROM DAILY WHERE TenDaiLy = ?';
    const datatienno = await query(conn, sqltienno, key)
        .catch(e => res.send('Sorry! Something went wrong.'));

    if (datatienno.length == 0){
        
        return res.render('cong_no/cong_no.ejs',{userData: datatienno});
    }

    const begindate = datatienno.NgayTiepNhan;
    
    const endmonth='SELECT * FROM PHIEUXUATHANG, DAILY ' +
    'WHERE PHIEUXUATHANG.MaDaiLy = DAILY.MaDaiLy AND TenDaiLy = ? AND NgayLapPhieu >= ? AND NgayLapPhieu <= ?';
    const dataendmonth = await query(conn, endmonth, [key, begindate, querydate])
        .catch(e => res.send('Sorry! Something went wrong.'));

    let tmp = querydate.substr(5,7);
    tmp -= tmp;
    const lastmonth = querydate.substr(0,5) + tmp;

    const beginmonth = 'SELECT * FROM PHIEUXUATHANG, DAILY ' +
    'WHERE PHIEUXUATHANG.MaDaiLy = DAILY.MaDaiLy AND TenDaiLy = ? AND NgayLapPhieu >= ? AND NgayLapPhieu <= ?';
    const datebeginmonth = await query(conn, beginmonth, [key, begindate, lastmonth])
        .catch(e => res.send('Sorry! Something went wrong.'));

    const paymonth = 'SELECT * FROM PHIEUTHUTIEN, DAILY ' +
    'WHERE PHIEUTHUTIEN.MaDaiLy = DAILY.MaDaiLy AND TenDaiLy = ? AND MONTH(NgayLapPhieu) = ? AND YEAR(NgayLapPhieu) = ?';
    const datapaymonth = await query(conn, paymonth, [key, querydate.substr(5,7), querydate.substr(0,4)])
        .catch(e => res.send('Sorry! Something went wrong.'));

    let NoDau = 0;
    let NoCuoi = 0;
    let tienthu = 0;

    dataendmonth.forEach(function(data){
        let money = data.TongTien;
        NoCuoi += money;
    })
    datebeginmonth.forEach(function(data){
        let money = data.TongTien;
        NoDau += money;
    })

    const NoPhatSinh = NoCuoi - NoDau;
    conn.end();


    
}))


module.exports = router;