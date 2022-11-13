const express = require('express');
const morgan = require('morgan');
const path = require('path');
const router = require('./routes.js');
const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use('/', router);
app.get('/loaderio-433fa26a1311f39c09efd5689f8948f3.txt', (req, res) => {
  res.send('loaderio-433fa26a1311f39c09efd5689f8948f3')
})

const port = 3001;
app.listen(port, console.log(`Listening on port: ${port}`));