const { urlencoded } = require('body-parser');
const bodyParser = require('body-parser');
const express = require('express');
var cors = require('cors');
const path = require("path");

const emailRoutes = require('./routes/emails');

const app = express();

app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader(
    'Access-Control-Allow-Headers',
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Content-Disposition",
    );
    res.setHeader('Access-Control-Allow-Methods', "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});

app.use(bodyParser.json());
app.use(urlencoded({extended: false}));


//for deployment in heroku.
app.use("/", express.static(path.join(__dirname, "../dist/emailApp")));

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "../dist/emailApp/index.html"));
});

app.use('/api/emails', emailRoutes);

module.exports = app;

