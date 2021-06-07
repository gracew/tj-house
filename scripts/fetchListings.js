const airtable = require("airtable");
const fetch = require("node-fetch");
const { Client } = require('pg');
const client = new Client();

async function getListings(regionId) {
  const res = await fetch(`https://www.redfin.com/stingray/api/gis?al=1&num_homes=350&region_id=${regionId}&region_type=2&v=8`, {
    headers: { "user-agent": "redfin" },
  });
  const body = await res.text();
  const parsed = JSON.parse(body.substring(4));
  return parsed.payload.homes;
}

async function main() {
  await client.connect();
  // the region ids we still don't have listings for
  const res = await client.query("select * from (select redfin_region_id from zip_code_to_redfin_region_id) r where not exists(select from listings where redfin_region_id=r.redfin_region_id)");
  console.log(res.rows.length);

  // kick off requests in batches of 100
  const batchSize = 50;
  for (var i = 0; i < res.rows.length / batchSize; i++) {
    console.log(i);
    const subArr = res.rows.slice(i * batchSize, (i + 1) * batchSize  );

    await Promise.all(subArr.map(async row => {
      const listings = await getListings(row.redfin_region_id);
      return Promise.all(listings.map(l => 
        client.query('INSERT INTO listings(redfin_region_id, zip_code, street_address, metadata, price) VALUES ($1, $2, $3, $4, $5)', [row.redfin_region_id, l.postalCode.value, l.streetLine.value, l, l.price.value])
      ));
    }));
  }
  await client.end();
}

main();