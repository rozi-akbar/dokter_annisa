const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const dokterRoute = require('./routes/dokter');
const jadwalRoute = require('./routes/jadwal');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use('/dokter', dokterRoute);
app.use('/jadwal', jadwalRoute);

app.listen(port, () => {
    console.log(`cli-nodejs-api listening at http://localhost:${port}`)
});