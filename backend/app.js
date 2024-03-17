require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const botRoutes = require('./routes/bot');

const PORT = process.env.PORT ?? 8000;
const DB_URL = process.env.DB_URL ?? 'mongodb://localhost/botforge';

const app = new express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/auth', authRoutes);
app.use('/bot', botRoutes);

app.get('/test', (req, res) => {
  res.send('Hello!');
});

app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`);

  try {
    await mongoose.connect(DB_URL);
    console.log(`Connected to the database on ${DB_URL}`);
  } catch (err) {
    console.log('Could not connect to the database.');
  }
});
