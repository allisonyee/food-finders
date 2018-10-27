const cors = require('cors');
const express = require('express');
const secrets = require('./secrets');
const yelp = require('yelp-fusion');
const PostgresClient = require('pg').Client;

async function newApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

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

  const requiredBookmarkFields = [];
  const requiredBusinessFields = ['id'];
  app.post('/api/bookmark', async function(req, res) {
    const user = req.body.user;
    if (!user) {
      res.status(500);
      res.json({ error: 'a user is required' });
      return;
    }

    const bookmark = req.body.bookmark;
    if (!bookmark) {
      res.status(500);
      res.json({ error: '`bookmark` is required' });
      return;
    }
    if (!assertFields(res, 'bookmark', bookmark, requiredBookmarkFields)) {
      return
    }

    const business = bookmark.business;
    if (!business) {
      res.status(500);
      res.json({ error: '`business` is required' });
      return;
    }
    if (!assertFields(res, 'business', business, requiredBusinessFields)) {
      return
    }

    try {
      await pgClient.query({
        text: `INSERT INTO bookmarks (id, business_id, owner_id, tags)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (id)
                DO
                  UPDATE
                    SET tags = EXCLUDED.tags`,
        values: [
          `${user}-${business.id}`,
          business.id,
          user,
          bookmark.tags || [],
        ],
      });
    } catch (err) {
      res.status(500);
      res.json({ error: `failed to save bookmark: ${err.toString()}` });
      return;
    }

    try {
      await pgClient.query({
        text: `INSERT INTO businesses (id)
                VALUES ($1)
                ON CONFLICT (id) DO
                  UPDATE
                    SET id = EXCLUDED.id`,
        values: [
          business.id,
        ],
      });
    } catch (err) {
      res.status(500);
      res.json({ error: `failed to save business: ${err.toString()}` });
      return;
    }

    res.status(200);
    res.json({ status: 'success' });
  });

  return app;
}

function assertFields(res, objectName, object, fields) {
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    if (! (field in object)) {
      res.status(500);
      res.json({ error: `\`${objectName}.${field}\` is required` });
      return false;
    }
  }
  return true;
}

async function main() {
  const app = await newApp();

  const port = process.env.PORT || 8888;
  console.log(`Listening on ${port}`);
  app.listen(port);
}

main();
