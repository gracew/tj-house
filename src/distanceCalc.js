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