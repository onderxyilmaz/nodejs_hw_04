const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const contactsRouter = require('./routes/contacts');
const { connectToDatabase } = require('./db/connection');

const app = express();

// Connect to database
connectToDatabase();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/contacts', contactsRouter);

// Not found route handler
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Not found',
  });
});

// Error handler
app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({
    status,
    message,
  });
});

module.exports = app;