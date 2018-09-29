<template>
  <div id='app'>
    <div id='map' class='map'></div>
    <div id='caption'>
      <h2>Caption</h2>
      <div>Red : Population densitiy</div>
    </div>
  </div>
</template>

<style lang='css'>
#app {
  width: 100%;
  height: 100%;
  display: flex;
}

.map {
  width: 1000px;
  height: 1000px;
}

#caption {
  padding: 24px;
}
</style>


<script>

import converted from './data/converted-2010.json';

export default {
  data() {
    return {
      total: 100,
      map: null,
      population: converted,
    };
  },


  mounted() {
    this.initMap();
    this.drawPopulation();
    // this.initLayers();
  },

  methods: {

    initMap() {
      this.map = L.map('map').setView([56.9496, 24.1052], 13);
      this.tileLayer = L.tileLayer(
        'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png',
        {
          maxZoom: 15,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
        }
      );
      this.tileLayer.addTo(this.map);
    },

    initLayer() {

    },


    drawPopulation() {
      this.population.forEach(element => {
        this.drawPopulationSquare(element.geometry, element.total);
      });

      // // this.drawPopulationSquare(this.coord1, this.total);
      // this.map.setView([57.02972891758661, 24.103790127562252], 12);
    },

    drawPopulationSquare(coords, total) {
      const maxTotal = 1853;
      const opacity = (total / maxTotal) * 0.66;
      L.polygon(coords,
        {
          fillColor: '#ff0000',
          color: '#ff0000',
          opacity: opacity,
          fillOpacity: opacity,
        }).addTo(this.map);
    }
  }
}
</script>

