const express = require('express')
var cors = require('cors')
const app = express()
const port = 5000
const { Client } = require('pg');
const client = new Client();

app.use(express.json());
app.use(cors())
app.post('/', async (req, res) => {
  const distance = req.body.distance;
  const price = req.body.price;
  const query = `select 
  l.id, l.metadata, l.closest_tj_distance_mi,
  t.name as tj_name, t.address as tj_address
  from listings l 
  left join trader_joes t on store_no = l.closest_tj_store_no
  where closest_tj_distance_mi < $1
  and price < $2 
  order by closest_tj_distance_mi 
  limit 100`;
  const pgRes = await client.query(query, [distance, price]);
  res.json(pgRes.rows);
})

client.connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`)
    })
  })