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
  - Running `docker-compose up` creates the container, creates the volume to persist the data in the host system, and copies/runs the [init.sql](./postgres/init.sql) file in the container to initialize the database
    - This init.sql file will only run during the inital configuration of the databse, therefore if the [data](./postgres/data/) folder is not empty, the init.sql file will not run
    - If you want to run the init.sql file in a clean container, first remove the `./postgres/data` folder, then run `docker-compose up` again
- Container commands (these commands assume you have docker, docker-compose installed on your machine and that your user is part of the docker group):

````bash
# runs the container in the foreground
docker-compose up

# runs the container in the background
docker-compose up -d

# stops the container if running in the background
docker stop postgres_db

# connect to the container
source .env
psql postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}```

### NestJS App

```bash
# development
$ npm run start
````

## Test

```bash
# unit tests
$ npm run test
```
