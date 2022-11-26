const express = require('express');
const dokter = express.Router();
const koneksi = require('../config/database');
const auth = require('../middleware/auth');

dokter.post('/', (req, res) => {
    let data = {
        kode_dokter: req.body.kode_dokter,
        nama_dokter: req.body.nama_dokter
    };

    let querySql = "INSERT INTO m_dokter SET ?";

    koneksi.query(querySql, data, (err, rows, field) => {
        if (err) throw err;
        res.status(200).json({
            success: true,
            data: data,
            description: rows
        });
    });
});

dokter.get('/', auth,(req, res) => {
    const querySql = 'SELECT * FROM m_dokter where is_deleted = 0';

    // jalankan query
    koneksi.query(querySql, (err, rows, field) => {
        // error handling
        if (err) throw err;

        // jika request berhasil
        res.status(200).json({
            success: true,
            data: rows
        });
    });
});

dokter.get('/:id', auth, (req, res) => {
    const querySql = 'SELECT * FROM m_dokter where pid = ' + req.params.id;

    // jalankan query
    koneksi.query(querySql, (err, rows, field) => {
        // error handling
        if (err) throw err;

        if (!rows.length) {
            // jika data tidak ada
            res.status(404).json({
                success: false,
                data: 'No Data'
            });
        } else {
            // jika request berhasil
            res.status(200).json({
                success: true,
                data: rows
            });
        }
    });
});

dokter.put('/:id', auth, function (req, res) {
    let data = {
        kode_dokter: req.body.kode_dokter,
        nama_dokter: req.body.nama_dokter
    };
    const querySql = 'UPDATE m_dokter SET ? WHERE pid = ' + req.params.id;

    koneksi.query(querySql, data, (err, rows, field) => {
        if (err) throw err;

        res.status(200).json({
            success: true,
            data: data,
            description: rows
        });
    });
});

dokter.delete('/:id', auth, function (req, res) {
    const querySql = 'DELETE FROM m_dokter WHERE pid = ' + req.params.id;

    koneksi.query(querySql, data, (err, rows, field) => {
        if (err) throw err;

        res.status(200).json({
            success: true,
            message: "Success delete data"
        });
    });
});

module.exports = dokter;