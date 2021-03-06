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
  console.log('in getWord')
  const { incompleteWord, excludedLetters, requiredLetters } = req.body;
  let queryString = 'SELECT * FROM words WHERE word LIKE $1 AND word ~* $2 AND word ~* $3;'
  const pQS = new ParameterQueryString(incompleteWord, excludedLetters, requiredLetters);
  pool
    .query(queryString, pQS.getParamQueries())
    .then(results => {
      res.status(200).json(results.rows);
    })
    .catch(err => console.error(err.stack))
}

app.route('/')
  .post(getWord);

app.listen(process.env.PORT || 8080, () => {
  console.log('Server Listening');
})

class ParameterQueryString {
  constructor(incompleteWord, excludedLetters, requiredLetters) {
    this.incompleteWord = this.incompleteWordRegex(incompleteWord),
    this.excludedLetters = this.excludedLettersRegex(excludedLetters),
    this.requiredLetters = this.requiredLettersRegex(requiredLetters),

    this.queries = [ this.incompleteWord, this.excludedLetters, this.requiredLetters ]
  }

  incompleteWordRegex(arr) {
    let lowerCaseArr = arr.map(letter => letter.toLowerCase())
    return lowerCaseArr.join('');
  }

  excludedLettersRegex(arr) {
    let lowerCaseArr = arr.map(letter => letter.toLowerCase())
    let letters = lowerCaseArr.join('');
    return `\\y[^ ${letters}]+\\y`;
  }

  requiredLettersRegex(arr) {
    let lowerCaseArr = arr.map(letter => letter.toLowerCase())
    const reducer = (accumulator, item) => {
      return accumulator + `(?=.*${item})`;
    }
  
    let regX = lowerCaseArr.reduce(reducer, '');
    
    return regX + '.+';
  }

  getParamQueries() {
    console.log('this.queries: ', this.queries);
    return this.queries;
  }
}
