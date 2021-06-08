const { Client } = require('pg');
const client = new Client();

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

async function main() {
  await client.connect();
  /*
  1. for each listing, finds the tj_zip_code in zip_code_distances with the smallest distance_mi (table c)
  2. left joins with trader joe's table to fetch all possible store locations in the tj_zip_code and aggregates into array cols

  based on https://stackoverflow.com/a/30775753
  */
  const query = `select c.id, c.lat, c.lng, array_agg(t.store_no) as tj_store_nos, array_agg(t.latitude) as tj_lats, array_agg(t.longitude) as tj_lngs
  from (
    select distinct on (id) l.id, metadata -> 'latLong' -> 'value' -> 'latitude' as lat, metadata -> 'latLong' -> 'value' -> 'longitude' as lng, zip_codes[1] as tj_zip_code 
    from listings l 
    left join zip_code_distances on zip_code = zip_codes[2] 
    order by id, distance_mi asc
  ) c 
  left join trader_joes t on c.tj_zip_code = zip_code_str group by (c.id, c.lat, c.lng)`;
  const res = await client.query(query);
  console.log("done with query");
  await Promise.all(res.rows.map(row => {
    let minDistance = 100;
    let storeNo;
    for (var i = 0; i < row.tj_store_nos.length; i++) {
      const tjLat = row.tj_lats[i];
      const tjLng = row.tj_lngs[i];
      const d = calcCrow(row.lat, row.lng, tjLat, tjLng);
      if (d < minDistance) {
        minDistance = d;
        storeNo = row.tj_store_nos[i];
      }
    }
    if (storeNo) {
      return client.query('UPDATE listings set closest_tj_store_no=$1, closest_tj_distance_mi=$2 where id=$3', [storeNo, minDistance, row.id]);
    } else {
      return Promise.resolve();
    }
  }));
  await client.end();
}

main();