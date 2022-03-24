'use strict';

require('dotenv').config();
const { Pool } = require('pg');

const connectionString =
  `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
const pool = new Pool({
  connectionString: connectionString,
  // connectionString: process.env.DATABASE_URL,
  // connectionString: process.env.HEROKU_POSTGRESQL_BRONZE_URL,

  ssl: false, // needs enabled for local
  // ssl: {
  //   rejectUnauthorized: false
  // }
});

module.exports = { pool };