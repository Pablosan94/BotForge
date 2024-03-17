# BotForge

This repository consists of a Full-Stack application that handles Bot personality management.

It is composed by three main parts, each using a different stack:

- Database used is a containerized MongoDB image using Docker
- Backend is implemented through several technologies such as NodeJS, Express & Mongoose
- Frontend is implemented in React and bundled by Vite

## MongoDB Docker Container

This repository contains a Dockerfile to create a MongoDB container with the latest database and expose its default port.

### Prerequisites

- Docker installed on your system. You can download and install Docker from [here](https://www.docker.com/get-started).

### Usage

1. Clone this repository to your local machine.

2. Build the Docker image using the provided Dockerfile:

   ```bash
   docker build -t mongodb .
   ```

3. Once the image is built successfully, you can run the MongoDB container using the following command:

   ```bash
   docker run -d -p 27017:27017 --name botforge_mongodb mongodb
   ```

   - `-d` flag runs the container in detached mode.
   - `-p 27017:27017` maps port 27017 on the host to port 27017 in the container.
   - `--name mongodb` assigns the name "mongodb" to the container.

### Connecting to MongoDB

Once the MongoDB container is running, you can connect to it using your preferred MongoDB client or shell. Use the following connection string:

```bash
mongodb://localhost:27017
```

## BotForge Backend

This project uses NodeJS, Express and Mongoose as the foundations for the backend.

### Installation

```bash
npm install
```

### Setting up the environment variables

There are a couple environment variables that need to be setup in order to properly run the application. Here is an example of a working configuration:

```
PORT=3000
DB_URL=mongodb://localhost/botforge
SECRET=botforge-secret-sauce
JWT_SECRET=tech-interview-jwt-secret-sauce
```

### Usage

To start the development server, run:

```bash
npm start
```

If `PORT` is set in the environment variables, this will start the development server at `http://localhost:PORT`.
If it isn't set, it will start at `http://localhost:8000` by default.

### Seeding the database

To seed the database, configure `DB_URL` to a valid MongoDB URL in the environment variables and run the following command:

```bash
npm run seed
```

### API Endpoints

More information about the available endpoints can be found here in the [API documentation](https://documenter.getpostman.com/view/3864986/2sA2xnyA6Y).

## BotForge Frontend

This project uses Vite as the build tool and React as the frontend library.

### Installation

```bash
npm install
```

### Setting up the environment variables

There's an importnat environment variable that needs to be setup in order to properly run the application. Here is an example of a working configuration:

```
API_URL=localhost:3000
```

### Usage

To start the development server, run:

```bash
npm run dev
```

This will start the development server at http://localhost:5173.
