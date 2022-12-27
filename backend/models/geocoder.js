const NodeGeocoder = require('node-geocoder');
// PR33+J32, Industrial Area Phase I, Chandigarh, 160002	

// Electric Vehicle Charging Station	
const options = {
  provider:process.env.GEOCODEER_PROVIDER ,

  // Optional depending on the providers
  httpAdapter:"https",
  apiKey: process.env.GEOCODE_API_KEY, // for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);
module.exports = geocoder;
