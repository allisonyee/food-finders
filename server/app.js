const cors = require('cors');
const express = require('express');
const secrets = require('./secrets');
const yelp = require('yelp-fusion');

/*
 * API:
 * GET /api/businesses/:id
 *   Get the business information for a business. ID can be either the Yelp
 *   business ID, or the Yelp business alias. The business alias is the
 *   identifier at the end of Yelp business URLs.
 */
function newApp() {
  const app = express();
  app.use(cors());
  const yelpClient = yelp.client(secrets.yelpAPIKey);

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
    res.json([
      {
        id: 'id',
        tags: ['chinese', 'asian', 'brunch'],
      },
    ]);
  });

  app.get('/api/bookmarks/:id', async function(req, res) {
  });

  app.post('/api/bookmarks/:id', async function(req, res) {
  });

  return app;
}

async function main() {
  const app = newApp();

  const port = process.env.PORT || 8888;
  console.log(`Listening on ${port}`);
  app.listen(port);
}

main();
