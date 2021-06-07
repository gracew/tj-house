const fs = require("fs");
const airtable = require("airtable");
const neatCsv = require("neat-csv");
const { Client } = require('pg');
const client = new Client();

async function getTJLocations() {
  airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: 'keyjbd9c1iSM3uuWQ'
  });
  const base = airtable.base('appg4VBdmvhr9pbDO');

  const locations = [];
  const records = await base("Imported table").select({
    maxRecords: 600,
    view: "Grid view"
  }).all();

  return records;
}

// usage 
// alert(calcCrow(59.3293371, 13.4877472, 59.3225525, 13.4619422).toFixed(1) + ' miles');
//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in miles, m)
function calcCrow(lat1, lon1, lat2, lon2) {
  // TODO - add parameter to return distance in km or mi
  var R = 6371; // radius of the earth in km
  var dLat = toRad(lat2 - lat1);
  var dLon = toRad(lon2 - lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var km = R * c; // km as crow flies
  var mi = km * 0.621371 // miles as crow flies

  return mi;
}

// Converts numeric degrees to radians
function toRad(Value) {
  return Value * Math.PI / 180;
}

function pgParams(num) {
  const paramStrs = [];
  for (let i = 1; i <= num; i++) {
    paramStrs.push(`$${i}`);
  }
  return paramStrs.join(', ');
}

async function insert(client, tableName, kv) {
  const keys = Object.keys(kv);
  const q = `INSERT INTO ${tableName} (${keys.join(", ")}) VALUES (${pgParams(keys.length)})`;
  return client.query(q, Object.values(kv));
}

async function main() {
  const locations = await getTJLocations();
  const tjZips = locations.map(l => {
    const zipNum = l.get("Zip_Code");
    return zipNum < 10000 ? "0" + zipNum.toString() : zipNum.toString();
  });

  const contents = fs.readFileSync("./zip_code_lat_long.txt");
  const rows = await neatCsv(contents);
  const zipToLatLong = {};

  rows.forEach(row => {
    const zip = row['ZIP'];
    zipToLatLong[zip] = {
      lat: row['LAT'],
      lng: row['LNG'],
    }
  });

  await client.connect();

  for (const tjZip of tjZips) {
    tjCoords = zipToLatLong[tjZip];

    for (const zip of Object.keys(zipToLatLong)) {
      const coords = zipToLatLong[zip];
      const d = calcCrow(tjCoords.lat, tjCoords.lng, coords.lat, coords.lng);
      if (d < 50) {
        await client.query('INSERT INTO zip_code_distances(zip_codes, distance_mi) VALUES ($1, $2)', [[tjZip, zip], d]);
      }
    }
  }
  await client.end();
}

main();