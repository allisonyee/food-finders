const cors = require('cors');
const express = require('express');
const secrets = require('./secrets');
const yelp = require('yelp-fusion');
const PostgresClient = require('pg').Client;

async function newApp() {
  const app = express();
  app.use(cors());

  const yelpClient = yelp.client(secrets.yelpAPIKey);

  const pgClient = new PostgresClient({
    user: 'food_finder',
    host: secrets.postgresHost,
    database: 'food_finders',
    password: secrets.postgresPassword,
    port: 5432,
  });
  console.log('Connecting to Postgres...');
  await pgClient.connect();

  app.get('/api/businesses/:id', async function(req, res) {
    const businessID = req.params.id;
    try {
      const business = await yelpClient.business(businessID);
      res.json(business.jsonBody);
    } catch (err) {
      res.status(500);
      if (err.response) {
        res.json(err.response)
      } else {
        res.json({ error: err.toString() });
      }
    }
  });

  app.get('/api/bookmarks', async function(req, res) {
    const user = req.query.user;
    if (!user) {
      res.status(500);
      res.json({ error: 'a user is required' });
      return;
    }

    try {
      const bookmarks = (await pgClient.query({
        text: 'SELECT * FROM bookmarks WHERE owner_id = $1',
        values: [user]
      })).rows;

      const businesses = (await pgClient.query({
        text: 'SELECT * FROM businesses WHERE id = ANY($1)',
        values: [bookmarks.map(bm => bm.business_id)],
      })).rows;
      const businessesMap = {};
      businesses.forEach((business) => {
        businessesMap[business.id] = business
      });

      // Add the extra information from the business query.
      for (let i = 0; i < bookmarks.length; i++) {
        bookmarks[i].business = businessesMap[bookmarks[i].business_id];
      }

      res.json({ results: bookmarks });
    } catch (err) {
      res.status(500);
      res.json({ error: err.toString() });
    }
  });

  app.get('/api/bookmarks/:id', async function(req, res) {
  });

  app.post('/api/bookmarks/:id', async function(req, res) {
  });

  return app;
}

async function main() {
  const app = await newApp();

  const port = process.env.PORT || 8888;
  console.log(`Listening on ${port}`);
  app.listen(port);
}

main();
