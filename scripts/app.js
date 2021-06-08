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
  const offset = req.body.offset || 0;
  const pageSize = 60;

  const countQuery = `select count(*) from listings where closest_tj_distance_mi < $1 and price < $2`
  const countRes = await client.query(countQuery, [distance, price]);
  const count = countRes.rows[0].count;

  const query = `select 
  l.id, l.metadata, l.closest_tj_distance_mi,
  t.name as tj_name, t.address as tj_address
  from listings l 
  left join trader_joes t on store_no = l.closest_tj_store_no
  where closest_tj_distance_mi < $1
  and price < $2 
  order by closest_tj_distance_mi 
  offset $3
  limit $4`;
  const pgRes = await client.query(query, [distance, price, offset, pageSize]);
  res.json({
    count,
    rows: pgRes.rows,
    paging: {
      moreResults: offset + pageSize < count,
      nextOffset: offset + pageSize,
    }
  });
})

client.connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`)
    })
  })