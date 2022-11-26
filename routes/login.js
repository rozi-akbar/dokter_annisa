const express = require('express');
const login = express.Router();
const koneksi = require('../config/database');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

login.post('/', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    const querySql = 'SELECT * FROM users WHERE username = "' + username + '" AND password = "' + password + '";';

    // jalankan query
    koneksi.query(querySql, (err, rows, field) => {
        // error handling
        if (err) {
            throw err;
        } else if (!rows.length) {
            res.status(404).json({
                success: true,
                message: 'Data not found'
            });
        } else {
            // jika request berhasil
            const token = jwt.sign({
                username: username,
                name: rows[0].name
            }, 'the_secret', {
                expiresIn: '1d'
            });
            res.status(200).json({
                success: true,
                data: {username, token}
            });
        }
    });
});

module.exports = login;