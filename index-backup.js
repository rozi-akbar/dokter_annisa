const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const port = 3000;
const koneksi = require('./config/database');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.post('/jadwal', (req, res) => {

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

app.get('/jadwal', (req, res) => {
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

app.get('/jadwal/:id', (req, res) => {
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

app.post('/dokter', (req, res) => {
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

app.get('/dokter', (req, res) => {
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

app.get('/dokter/:id', (req, res) => {
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

app.put('/dokter/:id', function (req, res) {
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

app.listen(port, () => {
    console.log(`cli-nodejs-api listening at http://localhost:${port}`)
});