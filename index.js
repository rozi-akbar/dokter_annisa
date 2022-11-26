const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const dokterRoute = require('./routes/dokter');
const jadwalRoute = require('./routes/jadwal');
const loginRoute = require('./routes/login');

// body parser json 
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

// routes conf
app.use('/dokter', dokterRoute);
app.use('/jadwal', jadwalRoute);
app.use('/login', loginRoute);

app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: "Url Not Found"
    });
})

// listen port
app.listen(port, () => {
    console.log(`cli-nodejs-api listening at http://localhost:${port}`)
});