const express = require('express');
const jadwal = express.Router();
const koneksi = require('../config/database');
const auth = require('../middleware/auth');
const moment = require('moment');

jadwal.post('/', auth, (req, res) => {

    let date_range = req.body.date_range;

    if (date_range.includes(" s/d ")) {
        const date = date_range.split(" s/d "); //split date

        const dday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        let start = moment(date[0]);
        let end = moment(date[1]);
        let day = dday.findIndex(day_index);

        var current = start.clone();

        while (current.day(day).isSameOrBefore(end)) {
            var d_date = moment(current.clone()).format('YYYY-MM-DD');
            let querySql = "INSERT INTO t_jadwal SET doctor_id = " + req.body.doctor_id + ", day = '" + req.body.day + "', time_start = '" + req.body.time_start + "', time_finish = '" + req.body.time_finish + "', quota = " + req.body.quota + ", status = " + req.body.status + ", date = '" + d_date + "'";
            koneksi.query(querySql);
            current.day(7 + day);
        }

        res.status(200).json({
            success: true,
            message: "Data save successfully"
        });
    } else {
        res.status(400).json({
            success: false,
            message: "No date range"
        });
    }

    function day_index(day_name) {
        if (day_name === req.body.day) {
            return day_name;
        }
    }
});

jadwal.get('/', auth, (req, res) => {
    const querySql = 'SELECT t1.id, t1.doctor_id, t2.nama_dokter, t1.day, t1.time_start, t1.time_finish, t1.quota, t1.status, t1.date FROM t_jadwal t1 JOIN m_dokter t2 ON t1.doctor_id = t2.pid WHERE t1.is_deleted = 0';

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

jadwal.get('/:id', auth, (req, res) => {
    const querySql = 'SELECT id, doctor_id, day, time_start, time_finish, quota, status, date FROM t_jadwal t1 JOIN m_dokter t2 ON t1.doctor_id = t2.pid where pid = ' + req.params.id;

    // jalankan query
    koneksi.query(querySql, (err, rows, field) => {
        // error handling
        if (err) throw err;

        if (!rows.length) {
            // jika data tidak ada
            res.status(404).json({
                success: false,
                data: 'Data Not Found'
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

module.exports = jadwal;