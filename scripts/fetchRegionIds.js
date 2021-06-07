const fetch = require("node-fetch");
const { Client } = require('pg');
const client = new Client();

async function getRegionId(zip) {
  const res = await fetch(`https://www.redfin.com/stingray/do/location-autocomplete?location=${zip}&v=2&accessLevel=1`, {
    headers: { "user-agent": "redfin" },
  });
  const body = await res.text();
  const parsed = JSON.parse(body.substring(4));
  if (!parsed.payload.exactMatch) {
    console.warn("could not look up region id, no exact match. zip: " + zip);
    return undefined;
  }
  const regionId = parsed.payload.exactMatch.id;
  if (!regionId) {
    console.warn("could not look up region id, no id in exact match. zip: " + zip);
    return undefined;
  }
  const parts = regionId.split("_");
  if (parts.length !== 2) {
    console.warn("could not parse up region id for zip: " + zip);
    return undefined;
  }
  return parts[1];
}

async function main() {
  await client.connect();
  // the zip codes we still don't have region ids for
  const res = await client.query("select * from (select distinct unnest(zip_codes) as zip_code from zip_code_distances) r where not exists(select from zip_code_to_redfin_region_id where zip_code=r.zip_code)")
  console.log(res.rows.length);

  // kick off requests in batches of 200
  for (var i = 0; i < res.rows.length / 200; i++) {
    const subArr = res.rows.slice(i * 200, (i + 1) * 200);
    await Promise.all(subArr.map(async row => {
      try {
        const zip = row.zip_code;
        const regionId = await getRegionId(zip)
        if (regionId) {
          return client.query('INSERT INTO zip_code_to_redfin_region_id(zip_code, redfin_region_id) VALUES ($1, $2)', [zip, regionId]);
        }
      } catch (e) {
        console.error(e);
      }
      return Promise.resolve();
    }));
  }
  await client.end();
}

main();