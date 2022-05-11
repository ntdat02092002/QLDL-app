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
    const sql_1 = "SELECT MaDaiLy, TenDaiLy, TienNo, SoNoToiDa " +
                    "From DAILY JOIN LOAIDAILY ON DAILY.MaLoaiDaiLy = LOAIDAILY.MaLoaiDaiLy";
    const arrayOfDaily = await query(conn, sql_1)
        .catch(e => res.send('Sorry! Something went wrong.'));

    const sql_2 = "SELECT MaMatHang, TenMatHang, TenDVT, SoLuongTon, DonGiaNhap " +
                    "FROM MATHANG JOIN DVT ON MATHANG.MaDVT = DVT.MaDVT";
    const arrayOfMathang = await query(conn, sql_2)
        .catch(e => res.send('Sorry! Something went wrong.'));

    const sql_3 = "SELECT * FROM THAMSO WHERE TenThamSo = ?";
    const ThamSo = await query(conn, sql_3, ["TyLeXuat"])
        .catch(e => res.send('Sorry! Something went wrong.'));
    const TyLeXuat = ThamSo[0].GiaTri;

    res.render('xuat_hang/xuat-hang-test', {arrayOfDaily: arrayOfDaily, arrayOfMathang: arrayOfMathang, TyLeXuat: TyLeXuat});
}));

router.post('/submit', basic.check(async (req,res) => {
    const data = req.body;
    console.log(data);
    const conn = await connection().catch(e => res.send('Sorry! Something went wrong.'));
    const sql_1 = "INSERT INTO PHIEUXUATHANG (MaDaiLy, NgayLapPhieu, TongTien) VALUES ?";
    const value = [[parseInt(data.MaDaiLy), data.NgayLapPhieu, parseInt(data.TongTien)]];
    const result = await query(conn, sql_1, [value])
        .catch(e => res.send('Sorry! Something went wrong.'));
    const MaPhieuXuat = result.insertId;

    let arrayOfCT_PXH = [];
    data.MaMatHang.forEach((_, index) => {
        let MaMatHang = parseInt(data.MaMatHang[index]);
        let SoLuongXuat = parseInt(data.SoLuong[index]);
        let DonGiaXuat = parseInt(data.DonGia[index]);
        let ThanhTien = parseInt(data.ThanhTien[index]);
        arrayOfCT_PXH.push([MaPhieuXuat, MaMatHang, SoLuongXuat, DonGiaXuat, ThanhTien]);
    })
    console.log(arrayOfCT_PXH);
    const sql_2 = "INSERT INTO CT_PXH (MaPhieuXuat, MaMatHang, SoLuongXuat, DonGiaXuat, ThanhTien) VALUES ?";
    const result_2 = await query(conn, sql_2, [arrayOfCT_PXH])
        .catch(e => {res.send('Sorry! Something went wrong.'); console.log(e)});
    res.send("ok");

}));

module.exports = router;