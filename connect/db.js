const mysql = require('mysql');

let msqlConnectoion = mysql.createPool({
    host: process.env.URL,
    user: "root",
    password: process.env.PASSWORD,
    database: 'sandbox_community'
});




module.exports = msqlConnectoion;