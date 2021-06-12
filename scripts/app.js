const express = require('express')
var cors = require('cors')
const app = express()
const port = 5000
const { Client } = require('pg');
const client = new Client();

app.use(express.json());
app.use(cors())
app.post('/', async (req, res) => {
  const state = req.body.state;
  const distance = req.body.distance;
  const priceLow = req.body.priceLow;
  const priceHigh = req.body.priceHigh;
  const propertyTypes = req.body.propertyTypes.join();
  const offset = req.body.offset || 0;
  const pageSize = 60;

  const countQuery = `select count(*) from listings 
  where closest_tj_distance_mi < $1 
  and price > $2
  and price < $3
  and state = $4
  and property_type in (` + propertyTypes + `)`
  const countRes = await client.query(countQuery, [distance, priceLow, priceHigh, state]);
  const count = countRes.rows[0].count;

  const query = `select 
  l.id, l.metadata, l.closest_tj_distance_mi,
  t.name as tj_name, t.address as tj_address
  from listings l 
  left join trader_joes t on store_no = l.closest_tj_store_no
  where closest_tj_distance_mi < $1
  and price > $2
  and price < $3 
  and l.state = $4
  and property_type in (` + propertyTypes + `)
  order by closest_tj_distance_mi 
  offset $5
  limit $6`;
  
  const pgRes = await client.query(query, [distance, priceLow, priceHigh, state, offset, pageSize]);
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
      console.log(`TraderJoes.house app listening at http://localhost:${port}`)
    })
  })