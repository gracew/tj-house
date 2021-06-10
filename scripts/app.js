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
  const price = req.body.price;
  const offset = req.body.offset || 0;
  const pageSize = 60;
  let priceLow;
  if(price > 1000000) priceLow = 1000000;
  else priceLow = price - 100000;

  const countQuery = `select count(*) from listings 
  where closest_tj_distance_mi < $1 
  and price > $2
  and price < $3
  AND zip_code IN (
    SELECT DISTINCT trader_joes.zip_code_str FROM trader_joes WHERE state = $4
  )
  and property_type in (1,2,3,5,6,7)`
  const countRes = await client.query(countQuery, [distance, priceLow, price, state]);
  const count = countRes.rows[0].count;

  const query = `select 
  l.id, l.metadata, l.closest_tj_distance_mi,
  t.name as tj_name, t.address as tj_address
  from listings l 
  left join trader_joes t on store_no = l.closest_tj_store_no
  where closest_tj_distance_mi < $1
  and price > $2
  and price < $3 
  and l.zip_code in (
    SELECT DISTINCT trader_joes.zip_code_str FROM trader_joes WHERE state = $4
  )
  and property_type in (1,2,3,5,6,7)
  order by closest_tj_distance_mi 
  offset $5
  limit $6`;
  const pgRes = await client.query(query, [distance, priceLow, price, state, offset, pageSize]);
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