require('dotenv').config();
const mysql = require('mysql');

const con = mysql.createPool({
    connectionLimit : 10, // default = 10
    connectTimeout  : 60 * 60 * 1000,
    acquireTimeout  : 60 * 60 * 1000,
    timeout         : 60 * 60 * 1000,
    host: process.env.HOST,
    port: process.env.PORT,
    //user: process.env.USER,
    user: 'sql10486696',
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

module.exports = con;