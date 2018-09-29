const population = require('./population-2018.json');

// console.log(JSON.stringify(population));


const converted = population.features.map((it) => {
  return {
    total: it.attributes.Total,
    geometry: it.geometry.rings.map(ring => ring.map(coords => [coords[1], coords[0]]))[0],
  };
});

console.log(JSON.stringify(converted));
