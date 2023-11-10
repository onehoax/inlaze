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

- This is a RESFtul API with CRUD operations for "users" and "roles"
- It was implemented with Swagger and the front end can be reached at: [http://localhost:3000/api](http://localhost:3000/api)
- The "POST" and "GET" endpoints don't require authentication
- The "PATCH", and "DELETE" endpoints need authentication
  - You can go to the `"/auth/login"` endpoint to get a JWT token with a valid `email` and `password`
  - You can then use this JWT token to get authenticated and access the endpoints that need it
    - **_Click on `"Authenticate"` at the top right of the Swagger front end and enter your JWT_**; you can also click on the `"lock"` icon for each individual endpoint
- Some starting values:
  - Roles:
    ```json
    {
      "name": "admin"
    },
    {
      "name": "general"
    }
    ```
  - Users:
    ```json
    {
      "full_name": "Michael Gibbs",
      "email": "mike@email.com",
      "password": "mikepass",
      "phone": "12346",
      "role": {
        "id": 1
      }
    },
    {
      "full_name": "Lauren Fletcher",
      "email": "lauren@email.com",
      "password": "laurenpass",
      "phone": "12346",
      "role": {
        "id": 2
      }
    },
    {
      "full_name": "Peter McClean",
      "email": "p@email.com",
      "password": "peterpass",
      "phone": "12346",
      "role": {
        "id": 2
      }
    },
    {
      "full_name": "Monica Sterling",
      "email": "ster@email.com",
      "password": "monipass",
      "phone": "12346",
      "role": {
        "id": null
      }
    }
    ```
- You can find the JSON definition of the API schema at [http://localhost:3000/api-json](http://localhost:3000/api-json) or at the root folder of the project as [swagger-spec.json](./swagger-spec.json)
  - The corresponding postman collection: [Inlaze.postman_collection.json](./Inlaze.postman_collection.json)
    - You need to create a new `environment` and add the following variable
      ```
      baseUrl = http://localhost:3000
      ```
    - Then choose the newyly created `environment` to be able to access the variable and test the endpoints
