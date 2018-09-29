// Script to get zip code based on a list of polygon
const _ = require('lodash');
const axios = require('axios');

const sample = {
  total: 5,
  geometry: [
    [57.081823999303246, 24.11383419623485],
    [57.081822490202, 24.115483963412288],
    [57.08092415492946, 24.115481172134167],
    [57.08092566397913, 24.11383144483183],
    [57.081823999303246, 24.11383419623485],
  ],
};


function calcluateCenter(geometryList) {
  const lats = geometryList.map(it => it[0]);
  const maxLat = _.max(lats);
  const minLat = _.min(lats);

  const lngs = geometryList.map(it => it[1]);
  const maxLng = _.max(lngs);
  const minLng = _.min(lngs);

  return [(maxLat + minLat) / 2, (maxLng + minLng) / 2];
}


function fetchZipCode(coord) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coord[0]}&lon=${coord[1]}&zoom=18&addressdetails=1`;
  return axios.get(url).then((resp) => {
    console.log(resp.data.address.postcode);
  });
}

async function run() {
  console.log('run');
  const calcluatedCenter = await calcluateCenter(sample.geometry);
  fetchZipCode(calcluatedCenter);
}

run();
