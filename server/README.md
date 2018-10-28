# Food Finders Backend

This directory contains the code for running the Food Finders backend. The
backend exposes a simple REST API for interacting with `businesses` and
`bookmarks`.

## Setup

### Database

The backend depends on a Postgres database.

1. Start the database locally through Docker with
```
docker run -d --name food_finders_db -e POSTGRES_DB=food_finders -e POSTGRES_USER=food_finder -e POSTGRES_PASSWORD=food_finder_pw -p 5432:5432 postgres
```

2. Setup the database schema and mock data with
```
node ./scripts/setup_database.js --seed
```

#### Debugging the Database

- Check on its status with `docker ps`.

- Get its logs with `docker logs food_finders_db`.

- Get a shell in the database with `docker exec -it food_finders_db psql food_finders -U food_finder`.

- Kill it with `docker rm -f food_finders_db`.

### Configuration

The server reads its configuration from `secrets.js`.

Create your own copy of `secrets.js` by copying the example from
`./secrets.js.example`. This file contains secrets so don't commit it!

#### Configuration Fields
- `yelpAPIKey`: The API key used to interact with the Yelp API. This should be
  generated through their development console.
- `postgresHost`: The hostname of the Postgres database. This will be
  `localhost` if running via Docker.
- `postgresPassword`: The password needed to connect to the Postgres database.
  This will be `food_finder_pw` if running via Docker.

## API
### GET /api/businesses/:id
Get the business information for a business. ID can be either the Yelp business
ID, or the Yelp business alias. The business alias is the identifier at the end
of Yelp business URLs.

### GET /api/bookmarks
#### Parameters
- `user`: *Required* The user for whom to fetch bookmarks.
Get all the bookmarks for a user.

### POST /api/bookmark
Save a bookmark.

#### Parameters
- `user`: *Required* The user for whom to save the bookmark.
- `tags`: *Optional* A list of tags to associated with the bookmark.
- `business`: *Required* The business to associate with the bookmark.
    - `id`: *Required* The Yelp alias of the business.

#### Example
```
curl -X POST -H "Content-Type: application/json" -d '{"user":"kevin", "bookmark":{"business":{"id":"noma"},"tags":["fancy"]}}' localhost:8888/api/bookmark
{"status":"success"}
```
