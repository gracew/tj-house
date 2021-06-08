const express = require('express')
const app = express()
const port = 5000
const { Client } = require('pg');
const client = new Client();

app.use(express.json());
app.post('/', async (req, res) => {
  const distance = req.body.distance;
  const price = req.body.price;
  const query = `select 
  street_address, price, 
  d.zip_code, d.distance_mi, 
  t.store_no, t.name, t.address
  from (select zip_codes[2] as zip_code, distance_mi from zip_code_distances where distance_mi < $1) d 
  left join listings on d.zip_code = listings.zip_code 
  left join trader_joes t on d.zip_code = t.zip_code_str 
  where price < $2 
  order by distance_mi 
  limit 100`;
  const pgRes = await client.query(query, [distance, price]);
  return res.json(pgRes.rows);
})

client.connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`)
    })
  })