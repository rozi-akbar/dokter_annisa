const express = require('express');
const jadwal = express.Router();
const koneksi = require('../config/database');

jadwal.post('/', (req, res) => {

    let date_range = req.body.date_range;

    if (date_range.includes(" s/d ")) {
        const date = date_range.split(" s/d "); //split date
        const date1 = new Date(date[0]);
        const date2 = new Date(date[1]);

        for (var i = date1; i <= date2; i.setDate(i.getDate() + 1)) {
            var d_date = new Date(i).toISOString().slice(0, 10);

            let querySql = "INSERT INTO t_jadwal SET doctor_id = "+req.body.doctor_id+", day = '"+req.body.day+"', time_start = '"+req.body.time_start+"', time_finish = '"+req.body.time_finish+"', quota = "+req.body.quota+", status = "+req.body.status+", date = '"+d_date+"'";
            koneksi.query(querySql);
        }
        res.status(200).json({
            success: true,
            message: "Data save successfully"    
        });
    }
    res.status(400).json({
        success: false,
        message: "No date range"
    });
});

jadwal.get('/', (req, res) => {
    const querySql = 'SELECT id, doctor_id, day, time_start, time_finish, quota, status, date FROM t_jadwal WHERE is_deleted = 0';

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

jadwal.get('/:id', (req, res) => {
    const querySql = 'SELECT id, doctor_id, day, time_start, time_finish, quota, status, date FROM t_jadwal where pid = ' + req.params.id;

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

module.exports = jadwal;