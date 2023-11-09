## Description

Back End for Inlaze test

## Installation

```bash
$ npm install
```

## Running the app

### PostgreSQL Docker Container

- Take a look at the file [docker-compose.yml](./docker-compose.yml), which describes de PostgreSQL container

  - You will need to create the `.env` file with the corresponding environment variables

    ```bash
    JWT_SECRET=

    POSTGRES_USER=
    POSTGRES_PASSWORD=
    POSTGRES_HOST=
    POSTGRES_PORT=
    POSTGRES_DB=
    ```

  - Data from from the container is persisted in the [data](./postgres/data/) folder; if you want a fresh postgres db, delete this folder
  - Table creation is taken care of by TypeORM when the application is run
  - You can seed the db with some initial values by running [init.sh](./postgres/init.sh); the passowrd is whatever you set it to in the `.env` file

- Container commands (these commands assume you have docker, docker-compose installed on your machine and that your user is part of the docker group):

```bash
# runs the container in the foreground
docker-compose up

# runs the container in the background
docker-compose up -d

# stops the container if running in the background
docker stop postgres_db

# delete the persisted db settings/data when you want a fresh db
sudo rm -rf ./postgres/data

# connect to the container
source .env
psql postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}
```

### NestJS App

```bash
# build
$ npm run build

# run
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test
```
