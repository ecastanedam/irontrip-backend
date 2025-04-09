const axios = require("axios");

async function geocodeAddress(address) {
  const url = "https://nominatim.openstreetmap.org/search";

  const params = {
    q: address,
    format: "jsonv2",
    limit: 1,
  };

  try {
    const response = await axios.get(url, { params });

    if (response.data.length === 0) {
      throw new Error("No results found");
    }

    const { lat, lon } = response.data[0];
    console.log(`Coordinates => LAT : ${lat} ; LONG : ${lon}`);
    return {
      lat: parseFloat(lat),
      lng: parseFloat(lon),
    };
    // return [parseFloat(lat), parseFloat(lon)];
  } catch (error) {
    throw new Error("Geocoding error : " + error.message);
  }
}

module.exports = geocodeAddress;