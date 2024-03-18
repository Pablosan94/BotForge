import { defineConfig } from 'cypress';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import Bot from './data/models/Bot.js';
import User from './data/models/User.js';
dotenv.config();

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on, config) {
      on('task', {
        async clearDB() {
          try {
            await mongoose.connect(
              process.env.DB_URL ?? 'mongodb://localhost/botforge'
            );
            console.log(`Connected to the database!`);
          } catch (error) {
            console.log('Could not connect to the database.');
          }

          await mongoose.connection.db.dropCollection('users');
          console.log('Dropped users collection');
          await mongoose.connection.db.dropCollection('bots');
          console.log('Dropped bots collection');

          await mongoose.disconnect();

          return null;
        },
      });

      on('task', {
        async seedDB() {
          try {
            await mongoose.connect(
              process.env.DB_URL ?? 'mongodb://localhost/botforge'
            );
            console.log(`Connected to the database!`);
          } catch (error) {
            console.log('Could not connect to the database.');
          }

          const { bots, users } = JSON.parse(
            fs.readFileSync(path.resolve('data', 'seed.json'))
          );

          console.log('CREATING BOTS');
          for (const bot of bots) {
            console.log(`Adding "${bot.name}" bot to the "bots" collection.`);
            await Bot.create(bot);
          }

          console.log('CREATING USERS');
          for (const user of users) {
            console.log(
              `Adding "${user.username}" bot to the "users" collection.`
            );
            await User.create(user);
          }

          await mongoose.disconnect();

          return null;
        },
      });
      // implement node event listeners here
    },
  },
});
