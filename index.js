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
  -still need to sanitize inputs

*/

const getWord = (req, res) => {
  const { incompleteWord, excludedLetters, requiredLetters} = req.query;

  function requiredLettersRegex(letters) {
    const reducer = (accumulator, item) => {
      return accumulator + `(?=.*${item})`;
    }
  
    let regX = letters.split('')
      .reduce(reducer, '');
    
    return regX + '.+';
  }  

  let queryString = 'SELECT * FROM words WHERE word LIKE $1 AND word ~* $2 AND word ~* $3;'
  pool
    .query(queryString, [incompleteWord, `\\y[^ ${excludedLetters}]+\\y`, requiredLettersRegex(requiredLetters)])
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
