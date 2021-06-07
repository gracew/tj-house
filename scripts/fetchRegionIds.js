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
  const res = await client.query("select distinct unnest(zip_codes) as zip_code from zip_code_distances where distance_mi < 20")
  console.log(res.rows.length);

  for (var i = 0; i < res.rows.length; i++) {
    try {
      const zip = res.rows[i].zip_code;
      const regionId = await getRegionId(zip)
      if (regionId) {
        await client.query('INSERT INTO zip_code_to_redfin_region_id(zip_code, redfin_region_id) VALUES ($1, $2)', [zip, regionId]);
      }
    } catch (e) {
      console.error(e);
    }
    if (i % 50 === 0) {
      // every 50 lookups, sleep for 1 second in an attempt to not anger redfin...
      console.log(`processed ${i + 1} zipcodes`)
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  await client.end();
}

main();