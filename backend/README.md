# BotForge Backend

This project uses NodeJS, Express and Mongoose as the foundations for the backend.

## Installation

```bash
npm install
```

## Setting up the environment variables

There are a couple environment variables that need to be setup in order to properly run the application. Here is an example of a working configuration:

```
PORT=3000
DB_URL=mongodb://localhost/botforge
SECRET=botforge-secret-sauce
JWT_SECRET=tech-interview-jwt-secret-sauce
```

## Usage

To start the development server, run:

```bash
npm start
```

If `PORT` is set in the environment variables, this will start the development server at `http://localhost:PORT`.
If it isn't set, it will start at `http://localhost:8000` by default.

## Seeding the database

To seed the database, configure `DB_URL` to a valid MongoDB URL in the environment variables and run the following command:

```bash
npm run seed
```
