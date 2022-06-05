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

    conn.end();
    res.render('xuat_hang/xuat-hang', {arrayOfDaily: arrayOfDaily, arrayOfMathang: arrayOfMathang, TyLeXuat: TyLeXuat});
}));

router.post('/submit', basic.check(async (req,res) => {
    const data = req.body;
    console.log(data);
    const conn = await connection().catch(e => res.send('Sorry! Something went wrong.'));
    const sql_1 = "INSERT INTO PHIEUXUATHANG (MaDaiLy, NgayLapPhieu, TongTien, SoTienTra) VALUES ?";
    const value = [[parseInt(data.MaDaiLy), data.NgayLapPhieu, parseInt(data.TongTien), parseInt(data.SoTienTra)]];
    const result = await query(conn, sql_1, [value])
        .catch(e => res.send('Sorry! Something went wrong.'));
    const MaPhieuXuat = result.insertId;

    let arrayOfCT_PXH = [];
    for (let i = 0; i <  data.MaMatHang.length; i++) {
        let MaMatHang = parseInt(data.MaMatHang[i]);
        let SoLuongXuat = parseInt(data.SoLuong[i]);
        let DonGiaXuat = parseInt(data.DonGia[i]);
        let ThanhTien = parseInt(data.ThanhTien[i]);
        arrayOfCT_PXH.push([MaPhieuXuat, MaMatHang, SoLuongXuat, DonGiaXuat, ThanhTien]);

        const sql_2 = "UPDATE MATHANG SET SoLuongTon = SoLuongTon - ? WHERE MaMatHang = ?";
        await query(conn, sql_2, [SoLuongXuat, MaMatHang])
            .catch(e => {res.send('Sorry! Something went wrong.'); console.log(e)});
    }

    const sql_3 = "INSERT INTO CT_PXH (MaPhieuXuat, MaMatHang, SoLuongXuat, DonGiaXuat, ThanhTien) VALUES ?";
    await query(conn, sql_3, [arrayOfCT_PXH])
        .catch(e => {res.send('Sorry! Something went wrong.'); console.log(e)});

    const sql_4 = "UPDATE DAILY SET TienNo = TienNo + ? WHERE MaDaiLy = ?";
    await query(conn, sql_4, [parseInt(data.ConLai), parseInt(data.MaDaiLy)])
        .catch(e => {res.send('Sorry! Something went wrong.'); console.log(e)});

    conn.end();
    res.render("xuat_hang/xuat-hang-submitted");
}));

module.exports = router;