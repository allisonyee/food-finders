const secrets = require('../secrets');
const PostgresClient = require('pg').Client;

async function main() {
  let shouldSeed = false;
  if (process.argv.length > 2) {
    switch (process.argv[2]) {
      case '--seed':
        shouldSeed = true;
        break;
      default:
        usage();
    }
  }

  const pgClient = new PostgresClient({
    user: 'food_finder',
    host: secrets.postgresHost,
    database: 'food_finders',
    password: secrets.postgresPassword,
    port: 5432,
  });
  console.log('Connecting to Postgres...');
  await pgClient.connect();

  console.log('Creating tables...');
  await createTables(pgClient);

  if (shouldSeed) {
    console.log();
    console.log('Seeding mock data...');
    await seedDatabase(pgClient);
  }

  await pgClient.end();
  console.log('Done!');
}

async function createTables(pgClient) {
  console.log('Creating businesses table...');
  await pgClient.query(`CREATE TABLE businesses (
    id TEXT UNIQUE PRIMARY KEY,
    data TEXT
  )`);

  console.log('Creating bookmarks table...');
  await pgClient.query(`CREATE TABLE bookmarks (
    id TEXT UNIQUE PRIMARY KEY,
    owner_id TEXT,
    business_id TEXT,
    tags TEXT[]
  )`);

  console.log('Creating users table...');
  await pgClient.query(`CREATE TABLE users (
    id TEXT UNIQUE PRIMARY KEY
  )`);
}

const mockBusinesses = [
  {
    id: 'nopa-san-francisco',
    data: `{
      "coordinates": {
        "latitude": 37.77483,
        "longitude": -122.43746
      },
      "image_url": "https://s3-media3.fl.yelpcdn.com/bphoto/M8lkaDkG8GChJ1qvXhtLNw/o.jpg",
      "location": {
        "display_address": ["560 Divisadero St", "San Francisco, CA 94117"]
      },
      "name": "Nopa",
      "url": "https://www.yelp.com/biz/nopa-san-francisco?adjust_creative=ggmevi68gKoy7JWJ741WEQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_lookup&utm_source=ggmevi68gKoy7JWJ741WEQ"
    }`,
  },
];

const mockBookmarks = [
  {
    id: 'kevin-nopa-san-francisco',
    owner_id: 'kevin',
    business_id: 'nopa-san-francisco',
    tags: ['brunch', 'new american'],
  },
];

const mockUsers = [
  {
    id: 'kevin',
  },
];

async function seedDatabase(pgClient) {
  console.log('Seeding businesses...');
  for (let i = 0; i < mockBusinesses.length; i++) {
    const business = mockBusinesses[i];
    await pgClient.query({
      text: 'INSERT INTO businesses(id, data) VALUES ($1, $2)',
      values: [business.id, business.data],
    });
  }

  console.log('Seeding bookmarks...');
  for (let i = 0; i < mockBookmarks.length; i++) {
    const bookmark = mockBookmarks[i];
    await pgClient.query({
      text:
        'INSERT INTO bookmarks(id, owner_id, business_id, tags) VALUES ($1, $2, $3, $4)',
      values: [
        bookmark.id,
        bookmark.owner_id,
        bookmark.business_id,
        bookmark.tags,
      ],
    });
  }

  console.log('Seeding users...');
  for (let i = 0; i < mockUsers.length; i++) {
    const user = mockUsers[i];
    await pgClient.query({
      text: 'INSERT INTO users(id) VALUES ($1)',
      values: [user.id],
    });
  }
}

function usage() {
  console.error(`${process.argv[0]} ${process.argv[1]} [--seed]`);
  process.exit(1);
}

if (require.main === module) {
  main();
}
