const keys = require("./keys");

const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());

const { Pool } = require("pg");

const pgClient = new Pool({
  user: keys.pgUser,
  password: keys.pgPassword,
  database: keys.pgDatabase,
  host: keys.pgHost,
  port: keys.pgPort
});

pgClient.on("connect", client => {
  client
    .query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch(err => console.error(err));
});

pgClient.on("error", () => console.log("Lost PG Connection!"));

const redis = require("redis");

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();

app.get('/', (req, res) => {
  res.send("Hi");
});

app.get('/values/all', async (req, res) => {
  const values = await pgClient.query("SELECT * FROM values");
  res.send(values.rows);
});


app.get('/values/current', (req, res) => {
  redisClient.hgetall('values', (err, values) => {
    res.send(values);
  })
});

app.post('/values', async (req, res) => {
  const index = +req.body.index;
  if (index > 40) {
    res.status(400).send("Index has to be less than 40");
  }

  redisClient.hset('values', index, 'Nothing yet!');
  redisPublisher.publish("insert", index);
  await pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

  res.send({ working: true });
});

app.listen(5000, () => {
  console.log("Application is running on port 5000");
})


