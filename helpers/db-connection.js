// connect
const mysql = require('mysql');
const config = require("./db-config")

module.exports = async () => new Promise(
    (resolve, reject) => {
        const connection = mysql.createConnection(config);
        connection.connect(error => {
            if (error) {
                reject(error);
                return;
            }
            resolve(connection);
        })
    });