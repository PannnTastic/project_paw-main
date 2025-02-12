const mysql = require('mysql');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

const connectDB = async () => {
    return new Promise((resolve, reject) => {
        db.connect((err) => {
            if (err) reject(err);
            console.log('Connected to MySQL database');
            resolve();
        });
    });
};

db.connect((err) => {
    if (!err) {
        console.log('Connected to MySQL database');
    } else {
        console.log('Failed to connect to MySQL database ' + err);
    }
});

module.exports = {db, connectDB};