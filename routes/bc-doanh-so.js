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


router.get('/', basic.check(async (req, res) => {

    
    res.render('doanh_so/doanh_so.ejs');
}));
router.get('/doanh-so', basic.check(async(req, res) => {
    const key = req.query.search_bar;
    const querydate = req.query.month;
    console.log('query date: ' + querydate);

    const conn = await connection().catch(e => {});

    const sqltendaily = 'SELECT * FROM DAILY WHERE TenDaiLy = ?';
    const datatendaily = await query(conn, sqltendaily, key)
        .catch(e => res.send('Sorry! Something went wrong.'));
    

    if (datatendaily.length == 0){
        
        res.render('doanh_so/doanh_so_kq.ejs',{userData: datatendaily});
    }
    
    var begindate;
    datatendaily.forEach(function(data){
        begindate = data.NgayTiepNhan;
        begindate = begindate.toISOString().substring(0, 10);
    })
    
    console.log('NgayTiepNhan: ',begindate);
    var querydate2 = querydate + '-31';
    console.log('end of querys month: ', querydate2);

    const endmonth='SELECT TienThu FROM PHIEUTHUTIEN, DAILY ' +
    'WHERE PHIEUTHUTIEN.MaDaiLy = DAILY.MaDaiLy AND TenDaiLy = ? AND NgayLapPhieu >= ? AND NgayLapPhieu <= ?';
    const dataendmonth = await query(conn, endmonth, [key, begindate, querydate2])
        .catch(e => res.send('Sorry! Something went wrong.'));

    console.log('query of tien no cuoi thang: ', dataendmonth);

    const endmonth_2='SELECT TienThu FROM PHIEUTHUTIEN, DAILY ' +
    'WHERE PHIEUTHUTIEN.MaDaiLy = DAILY.MaDaiLy AND NgayLapPhieu >= ? AND NgayLapPhieu <= ?';
    const dataendmonth_2 = await query(conn, endmonth_2, [begindate, querydate2])
        .catch(e => res.send('Sorry! Something went wrong.'));

    console.log('query of tien thu cuoi thang: ', dataendmonth_2);
    
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
    
    const beginmonth = 'SELECT TienThu FROM PHIEUTHUTIEN, DAILY ' +
    'WHERE PHIEUTHUTIEN.MaDaiLy = DAILY.MaDaiLy AND TenDaiLy = ? AND NgayLapPhieu >= ? AND NgayLapPhieu <= ?';
    const datebeginmonth = await query(conn, beginmonth, [key, begindate, lastmonth])
        .catch(e => res.send('Sorry! Something went wrong.'));


    console.log('query of no dau thang: ', datebeginmonth);

    const beginmonth_2 = 'SELECT TienThu FROM PHIEUTHUTIEN, DAILY ' +
    'WHERE PHIEUTHUTIEN.MaDaiLy = DAILY.MaDaiLy AND NgayLapPhieu >= ? AND NgayLapPhieu <= ?';
    const datebeginmonth_2 = await query(conn, beginmonth_2, [begindate, lastmonth])
        .catch(e => res.send('Sorry! Something went wrong.'));


    console.log('query of thu dau thang: ', datebeginmonth_2);

    const paymonth = 'SELECT TienThu FROM PHIEUTHUTIEN, DAILY ' +
    'WHERE PHIEUTHUTIEN.MaDaiLy = DAILY.MaDaiLy AND TenDaiLy = ? AND NgayLapPhieu >= ? AND NgayLapPhieu <= ?';
    const datapayendmonth = await query(conn, paymonth, [key, lastmonth, querydate2])
        .catch(e => res.send('Sorry! Something went wrong.'));
    
    const datapaybeginmonth = await query(conn, paymonth, [key, begindate, lastmonth])
        .catch(e => res.send('Sorry! Something went wrong.'));

    console.log('query of tien thu cuoi: ', datapayendmonth);

    console.log('query of tien thu dau: ', datapaybeginmonth);

    const paymonth_2 = 'SELECT TienThu FROM PHIEUTHUTIEN, DAILY ' +
    'WHERE PHIEUTHUTIEN.MaDaiLy = DAILY.MaDaiLy AND NgayLapPhieu >= ? AND NgayLapPhieu <= ?';
    const datapayendmonth_2 = await query(conn, paymonth_2, [lastmonth, querydate2])
        .catch(e => res.send('Sorry! Something went wrong.'));
    
    const datapaybeginmonth_2 = await query(conn, paymonth_2, [ begindate, lastmonth])
        .catch(e => res.send('Sorry! Something went wrong.'));

    console.log('query of doanh thu cuoi: ', datapayendmonth_2);

    console.log('query of doanh thu dau: ', datapaybeginmonth_2);


    var TongTriGia = 0;
    var SoPhieuThu = 0;
    var TyLe = 0;
    var TongDoanhThu = 0;

    dataendmonth.forEach(function(data){
        var money = data.TienThu;
        TongTriGia += money;
        SoPhieuThu += 1;
    })
    
    datebeginmonth.forEach(function(data){
        var money = data.TienThu;
        TongTriGia += money;
        SoPhieuThu += 1;
    })

    dataendmonth_2.forEach(function(data){
        var money = data.TienThu;
        TongDoanhThu += money; 
    })
    
    datebeginmonth_2.forEach(function(data){
        var money = data.TienThu;
        TongDoanhThu += money;
    })

    TyLe = TongTriGia / TongDoanhThu * 100;
    var TyLe_2=TyLe.toFixed(3)
    var querymonth = querydate.substr(5,7);
    var queryyear = querydate.substr(0,4);
    res.render('doanh_so/doanh_so_kq.ejs',{userData: datatendaily, TenDaiLy: key, SoPhieuThu: SoPhieuThu, TongTriGia: TongTriGia, TyLe: TyLe_2,TongDoanhThu: TongDoanhThu, querymonth: querymonth, queryyear: queryyear});
    
}))

module.exports = router;