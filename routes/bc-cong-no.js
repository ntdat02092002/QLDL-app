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

router.get('/cong-no', basic.check(async(req, res, next) => {
    const key = req.query.search_bar;
    const querydate = req.query.month;

    const conn = await connection().catch(e => {});

    const sqltendaily = 'SELECT * FROM DAILY WHERE TenDaiLy = ?';
    const datatendaily = await query(conn, sqltendaily, key)
        .catch(e => res.send('Sorry! Something went wrong.'));
    

    if (datatendaily.length == 0){
        
        res.render('cong_no/cong_no.ejs',{userData: datatendaily});
    }
    
    var begindate;
    datatendaily.forEach(function(data){
        begindate = data.NgayTiepNhan;
        begindate = begindate.toISOString().substring(0, 10);
    })
    
    console.log('NgayTiepNhan: ',begindate);
    var querydate2 = querydate + '-31';
    console.log('end of querys month: ', querydate2);
    const endmonth='SELECT TongTien, SoTienTra FROM PHIEUXUATHANG, DAILY ' +
    'WHERE PHIEUXUATHANG.MaDaiLy = DAILY.MaDaiLy AND TenDaiLy = ? AND NgayLapPhieu >= ? AND NgayLapPhieu <= ?';
    const dataendmonth = await query(conn, endmonth, [key, begindate, querydate2])
        .catch(e => res.send('Sorry! Something went wrong.'));

    console.log('query of tien no cuoi thang: ', dataendmonth);
    
    let tmp = querydate.substr(5,7);
    let lastmonth;
    if (tmp == 1){
        lastmonth = querydate.substr(0,4) - 1;
        lastmonth = lastmonth + '-12-31'; 
    }
    else{
        tmp -= 1;
        lastmonth = querydate.substr(0,5) + tmp + '-31';
    }
    console.log('last month: ', lastmonth);
    
    const beginmonth = 'SELECT TongTien, SoTienTra FROM PHIEUXUATHANG, DAILY ' +
    'WHERE PHIEUXUATHANG.MaDaiLy = DAILY.MaDaiLy AND TenDaiLy = ? AND NgayLapPhieu >= ? AND NgayLapPhieu <= ?';
    const datebeginmonth = await query(conn, beginmonth, [key, begindate, lastmonth])
        .catch(e => res.send('Sorry! Something went wrong.'));


    console.log('query of no dau thang: ', datebeginmonth);

    const paymonth = 'SELECT TienThu FROM PHIEUTHUTIEN, DAILY ' +
    'WHERE PHIEUTHUTIEN.MaDaiLy = DAILY.MaDaiLy AND TenDaiLy = ? AND NgayLapPhieu >= ? AND NgayLapPhieu <= ?';
    const datapayendmonth = await query(conn, paymonth, [key, lastmonth, querydate2])
        .catch(e => res.send('Sorry! Something went wrong.'));
    
    const datapaybeginmonth = await query(conn, paymonth, [key, begindate, lastmonth])
        .catch(e => res.send('Sorry! Something went wrong.'));

    console.log('query of tien thu no cuoi: ', datapayendmonth);

    console.log('query of tien thu no dau: ', datapaybeginmonth);


    conn.end();

    var NoDau = 0;
    var NoCuoi = 0;
    var tienthucuoi = 0;
    var tienthudau = 0;

    dataendmonth.forEach(function(data){
        var money = data.TongTien - data.SoTienTra;
        NoCuoi += money;
    })
    
    datebeginmonth.forEach(function(data){
        var money = data.TongTien - data.SoTienTra;
        NoDau += money;
    })

    datapayendmonth.forEach(function(data){
        var money = data.TienThu;
        tienthucuoi += money;
    })

    datapaybeginmonth.forEach(function(data){
        var money = data.TienThu;
        tienthudau += money;
    })

    NoCuoi -= tienthucuoi + tienthudau;
    NoDau -= tienthudau;

    var NoPhatSinh = NoCuoi - NoDau;
    console.log('real NoPhatSinh (in case < 0): ', NoPhatSinh);
    if (NoPhatSinh < 0) {NoPhatSinh = 0;}

    console.log('TenDaiLy: ', key, 'NoDau: ', NoDau, 'NoCuoi: ', NoCuoi, 'NoPhatSinh: ', NoPhatSinh, 'tienthucuoi: ', tienthucuoi, 'tienthudau: ', tienthudau);
    

    res.render('cong_no/cong_no.ejs',{userData: datatendaily, TenDaiLy: key, NoDau: NoDau, NoCuoi: NoCuoi, NoPhatSinh: NoPhatSinh});
    
}))


module.exports = router;