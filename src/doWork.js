const airtable = require("airtable");
const fetch = require("node-fetch");

async function getTJLocations() {
  airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: 'keyjbd9c1iSM3uuWQ'
  });
  const base = airtable.base('appg4VBdmvhr9pbDO');

  const locations = [];
  const records = await base("Imported table").select({
    maxRecords: 5,
    view: "Grid view"
  }).all();

  return records;
}

async function getRegionId(zip) {
  const res = await fetch(`https://www.redfin.com/stingray/do/location-autocomplete?location=${zip}&v=2&accessLevel=1`, {
    headers: { "user-agent": "redfin" },
  });
  const body = await res.text();
  const parsed = JSON.parse(body.substring(4));
  const regionId = parsed.payload.exactMatch.id;
  if (!regionId) {
    return undefined;
  }
  const parts = regionId.split("_");
  if (parts.length !== 2) {
    return undefined;
  }
  return parts[1];
}

async function getListings(regionId, price) {
  const res = await fetch(`https://www.redfin.com/stingray/api/gis?al=1&max_price=${price}&num_homes=350&region_id=${regionId}&region_type=2&v=8`, {
    headers: { "user-agent": "redfin" },
  });
  const body = await res.text();
  const parsed = JSON.parse(body.substring(4));
  return parsed.payload.homes;
}

async function main() {
  const locations = await getTJLocations();
  const allListings = [];
  await Promise.all(locations.map(async (l) => {
    const zip = l.get("Zip_Code");
    const regionId = await getRegionId(zip)
    const listings = await getListings(regionId, "1000000");
    allListings.push({
      tj: l.fields,
      listings,
    });
  }));
  console.log(JSON.stringify(allListings));
  return allListings;
}

main();