require('dotenv').config();
const mysql = require('mysql');

const con = mysql.createPool({
    connectionLimit : 10, // default = 10
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USER,
    //user: 'root',
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

module.exports = con;