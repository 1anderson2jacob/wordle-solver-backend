'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { pool } = require('./config');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

/* 
  - getWord gets a query like 'ho_e' and returns an array of
    all possible words like ['home', 'hole', 'hone', etc..]

  - we need getWord to get a query like 'ho_e' and also a list of 
    eliminated letters like 'malr' and return ['hone', etc..]

  - on top of that, we need to first sanitize inputs
*/
const getWord = (req, res) => {
  console.log(req.query);
  let queryString = 'SELECT * FROM words WHERE word LIKE $1;'
  pool
    .query(queryString, [req.query.incompleteWord])
    .then(results => {
      res.status(200).json(results.rows);
    })
    .catch(err => console.error(err.stack))
}

app.route('/')
  .get(getWord);

app.listen(process.env.PORT || 3000, () => {
  console.log('Server Listening');
})
