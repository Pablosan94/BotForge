# MongoDB Docker Container

This repository contains a Dockerfile to create a MongoDB container with the latest database and expose its default port.

## Prerequisites
- Docker installed on your system. You can download and install Docker from [here](https://www.docker.com/get-started).

## Usage
1. Clone this repository to your local machine.

2. Build the Docker image using the provided Dockerfile:

    ```bash
    docker build -t mongodb .
    ```

3. Once the image is built successfully, you can run the MongoDB container using the following command:

    ```bash
    docker run -d -p 27017:27017 --name turing_challenge_mongodb mongodb
    ```

   - `-d` flag runs the container in detached mode.
   - `-p 27017:27017` maps port 27017 on the host to port 27017 in the container.
   - `--name mongodb` assigns the name "mongodb" to the container.

## Connecting to MongoDB
Once the MongoDB container is running, you can connect to it using your preferred MongoDB client or shell. Use the following connection string:

```bash
mongodb://localhost:27017
```
