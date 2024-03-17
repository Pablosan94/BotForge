require('dotenv').config();
const mongoose = require('mongoose');
const Bot = require('../models/Bot');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const { bots, users } = JSON.parse(
  fs.readFileSync(path.resolve('data', 'seed.json'))
);

const DB_URL = process.env.DB_URL ?? 'mongodb://localhost/botforge';

const seed = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log(`Connected to the database on ${DB_URL}`);
    console.log('Seeding the database with some data...');
  } catch (err) {
    console.log('Could not connect to the database.');
  }

  console.log('CREATING BOTS');
  for (const bot of bots) {
    console.log(`Adding "${bot.name}" bot to the "bots" collection.`);
    await Bot.create(bot);
  }

  console.log('CREATING USERS');
  for (const user of users) {
    console.log(`Adding "${user.username}" bot to the "users" collection.`);
    await User.create(user);
  }

  await mongoose.disconnect();
};

seed();
