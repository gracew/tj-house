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
  l.id, l.metadata,
  d.distance_mi, 
  t.store_no as tj_store_no, t.name as tj_name, t.address as tj_address
  from (select zip_codes[1] as tj_zip_code, zip_codes[2] as zip_code, distance_mi from zip_code_distances where distance_mi < $1) d 
  left join listings l on d.zip_code = l.zip_code 
  left join trader_joes t on d.tj_zip_code = t.zip_code_str 
  where price < $2 
  order by distance_mi 
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