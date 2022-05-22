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

router.get('/', basic.check((req, res) => {

    res.render('quy_dinh/quy-dinh');
}));

router.get('/tham-so', basic.check(async (req, res) => {
    const conn = await connection().catch(e => {});
    const sql = "SELECT * FROM THAMSO"
    const DbResponse = await query(conn, sql)
        .catch(e => res.send('Sorry! Something went wrong.'));

    const TyLeXuat = DbResponse.filter(data => data.TenThamSo === "TyLeXuat")[0].GiaTri;
    const DaiLyToiDaMoiQuan = DbResponse.filter(data => data.TenThamSo === "DaiLyToiDaMoiQuan")[0].GiaTri;
    const ThuVuotNo = DbResponse.filter(data => data.TenThamSo === "ThuVuotNo")[0].GiaTri;

    conn.end();
    res.render('quy_dinh/tham_so/tham-so', {TyLeXuat: TyLeXuat, DaiLyToiDaMoiQuan: DaiLyToiDaMoiQuan, ThuVuotNo:ThuVuotNo});
}));

router.post('/tham-so', basic.check(async (req, res) => {
    const data = req.body;

    const TyLeXuat = parseInt(data.TyLeXuat);
    const DaiLyToiDaMoiQuan = parseInt(data.DaiLyToiDaMoiQuan);
    const ThuVuotNo = parseInt(data.ThuVuotNo);

    const arrayOfGiaTri = [TyLeXuat, DaiLyToiDaMoiQuan, ThuVuotNo];
    const arrayOfTenThamSo = ['TyLeXuat', 'DaiLyToiDaMoiQuan', 'ThuVuotNo'];

    const conn = await connection().catch(e => {});
    for(let i = 0; i < arrayOfGiaTri.length; i++){
        let sql = "UPDATE THAMSO SET GiaTri = ? WHERE TenThamSo = ?";
        await query(conn, sql, [arrayOfGiaTri[i], arrayOfTenThamSo[i]])
            .catch(e => res.send('Sorry! Something went wrong.'));
    }
    conn.end();

    res.render("quy_dinh/tham_so/tham-so-submitted");
}));

router.get('/loai-dai-ly', basic.check(async (req, res) => {
    const conn = await connection().catch(e => {});
    const sql = "SELECT * FROM LOAIDAILY"
    const DbResponse = await query(conn, sql)
        .catch(e => res.send('Sorry! Something went wrong.'));
    conn.end();
    res.render('quy_dinh/loai_dai_ly/danh-sach', {ArrayOfLoaiDaiLy: DbResponse});
}));

router.get('/loai-dai-ly/edit/:id', basic.check(async (req, res) => {
    const id = req.params.id;

    const conn = await connection().catch(e => {});
    const sql = "SELECT * FROM LOAIDAILY WHERE MaLoaiDaiLy = ?"
    const DbResponse = await query(conn, sql, id)
        .catch(e => res.send('Sorry! Something went wrong.'));
    conn.end();
    if (DbResponse.length <= 0)
        res.send('Sorry! Something went wrong.');
    else
        res.render('quy_dinh/loai_dai_ly/form', {
            data: DbResponse[0],
            title: "Chỉnh sửa loại đại lý",
            action: '/quy-dinh/loai-dai-ly/edit/' + id,
        });
}));

router.post('/loai-dai-ly/edit/:id', basic.check(async (req, res) => {
    const data = req.body;
    const id = req.params.id;

    const conn = await connection().catch(e => {});
    const sql = "UPDATE LOAIDAILY SET TenLoaiDaiLy = ?, SoNoToiDa = ? WHERE MaLoaiDaiLy = ? "
    await query(conn, sql, [data.TenLoaiDaiLy, parseInt(data.SoNoToiDa), id])
        .catch(e => res.send('Sorry! Something went wrong.'));
    conn.end();
    res.redirect('/quy-dinh/loai-dai-ly');
}));

router.get('/loai-dai-ly/create', basic.check(async (req, res) => {
    res.render('quy_dinh/loai_dai_ly/form', {
        title: "Thêm loại đại lý mới",
    });
}));

router.post('/loai-dai-ly/create', basic.check(async (req, res) => {
    const data = req.body;

    const conn = await connection().catch(e => {});
    const sql = "INSERT INTO LOAIDAILY (TenLoaiDaiLy, SoNoToiDa) VALUES ?"
    const value = [
        [data.TenLoaiDaiLy, parseInt(data.SoNoToiDa)]
    ];
    await query(conn, sql, [value])
        .catch(e => res.send('Sorry! Something went wrong.'));
    conn.end();
    res.redirect('/quy-dinh/loai-dai-ly');
}));

router.get('/loai-dai-ly/delete/:id', basic.check(async (req, res) => {
    const id = req.params.id;

    const conn = await connection().catch(e => {});
    const sql = "DELETE FROM LOAIDAILY WHERE MaLoaiDaiLy = ?"
    await query(conn, sql, id)
        .catch(e => res.send('Sorry! Something went wrong.'));
    conn.end();
    res.redirect('/quy-dinh/loai-dai-ly');
}));

module.exports = router;