require('dotenv').config();
const mysql = require('mysql');

const con = mysql.createPool({
    connectionLimit : 10, // default = 10
    connectTimeout  : 60 * 60 * 1000,
    acquireTimeout  : 60 * 60 * 1000,
    timeout         : 60 * 60 * 1000,
    host: process.env.HOST,
    //host: 'sql10.freemysqlhosting.net',
    port: process.env.DB_PORT,
    //port: 3306,
    //user: process.env.USER,
    user: 'sql10486696',
    password: process.env.PASSWORD,
    //password: 'rXdE5Gy1Ts',
    database: process.env.DATABASE
    //database: 'sql10486696'
});

module.exports = con;