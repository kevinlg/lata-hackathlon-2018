<template>
  <div id='app'>
    <div id='map' class='map'></div>
    <div id='caption'>
      <h2>Time of the day : {{timeString}}</h2>
      <input type="number" v-model="time" min="0" max="23">
      <input type="hidden" :value="markers">
      <h2>Caption</h2>
      <h3> Bus route Data</h3> 
      <div class='caption-group'>
        <div class='caption-line'>
          <div class='circle black high'></div> 
          <div class='caption-text'>High number of ticket validation</div>
        </div> 
        <div class='caption-line'>
          <div class='circle black small'></div> 
          <div class='caption-text'>Small number of ticket validation</div>
        </div> 
      </div>

      <div class='caption-group'>
        <h3>Bus passages frequency</h3>
        <div class='caption-line'>
          <div class='circle red medium'></div> 
          <div class='caption-text'>No buses passing</div>
        </div> 
        <div class='caption-line'>
          <div class='circle green medium'></div> 
          <div class='caption-text'>Lot of busses passing</div>
        </div> 
      </div>
      
      <h3>Population density</h3>
       <div class='caption-group'>
        <div class='caption-line'>
          <div class='square red opacity-3'></div> 
          <div class='caption-text'>Low density area</div>
        </div> 
        <div class='caption-line'>
          <div class='square red opacity-9'></div> 
          <div class='caption-text'>High density area</div>
        </div> 
      </div>

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

.black {
  background: black;
}

.square {
  width: 24px;
  height: 24px;
}

.circle {
  border-radius: 24px;
}

.green {
  background: green;
}

.opacity-3 {
  opacity: 0.1;
}

.opacity-9 {
  opacity: 0.9;
}

.red {
  background: red;
}

.high {
  width: 32px;
  height: 32px;
}

.medium {
  width: 24px;
  height: 24px;
  border-radius: 24px;
}

.small {
  width: 16px;
  height: 16px;
}

.low {
  opacity: 0.2;
}

.caption-line {
  display: flex;
  align-items: center;
  margin-top: 16px;
}

.caption-text {
  margin-left: 8px;
}
</style>


<script>

import converted from './data/converted-2010.json';
import bussource from './data/route.json';
import fullSource from './data/full-network.json';
// import frequency from './data/route_frequency.json';

const defaultRadius = 60;
export default {
  data() {
    return {
      map: null,
      showStops: true,
      eraseMarker: true,
      population: converted,
      bustops: bussource.busstops,
      // freqs: frequency,
      time: 0,
      radiuses: [
        {
          id: 0,
          radius: 200
        },
        {
          id: 1,
          radius: 500
        }
      ]
    };
  },


  computed: {
    // a computed getter
    markers: function () {
      if (this.time == 4) {
        this.bustops = fullSource.busstops;
      }
      if (this.time == 5) {
        this.eraseMarker = false;
        this.drawPopulation();
      }
      if (this.map != null) {
        if (this.showStops) this.drawStops();
      }
      return this.time;
    },

    timeString: function () {
      if (this.time === 0) {
        return '02:00';
      } else if (parseInt(this.time) === 1) {
        return '06:00';
      } else if (parseInt(this.time) >= 2) {
        return '08:00';
      }
    },
  },


  mounted() {
    this.initMap();
    this.drawPopulation();
    if (this.showStops) this.drawStops()
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
    },

    drawStops() {
      if (this.eraseMarker) {
        this.clearMap();
        for (let i = 0; i < this.bustops.length; i++) {
          const bs = this.bustops[i];
          this.drawStop(0, bs.id);
        }
      }
    },


    radiusForTime() {
      let resp = defaultRadius
      if (this.time == 1) {
        resp = defaultRadius * 1.66 * (1 + Math.random());
      }
      if (this.time >= 2) {
        resp = defaultRadius * 1.88 * (1 + Math.random());
      }
      if (this.time >= 4) {
        return defaultRadius * 0.5 * (1 + 2 * Math.random());
      }
      return resp;
    },

    drawStop(time, stopId) {
      const stopFound = this.findStop(stopId);
      if (stopFound) {
        const findFrequencyColor = this.findFrequencyColor(this.time, stopId);
        var circle = L.circle(
          [stopFound.coords[1], stopFound.coords[0]], {
            color: stopFound.exchange ? 'green' : findFrequencyColor,
            fillColor: stopFound.exchange ? 'green' : findFrequencyColor,
            fillOpacity: 1,
            radius: this.radiusForTime(),
          }).addTo(this.map);
      }
    },

    findStop(idParam) {
      if (!this.bustops) return null;
      let stop = this.bustops.find(it => it.id === idParam);
      return stop;
    },

    findFrequencyColor(time, stopId) {
      if (parseInt(time) === 1) {
        return 'orange';
      }
      if (parseInt(time) >= 2) {
        return 'green';
      }
      return 'red';
    },

    clearMap() {
      const m = this.map;
      for (let i in m._layers) {
        if (m._layers[i]._path != undefined) {
          try {
            m.removeLayer(m._layers[i]);
          }
          catch (e) {
            console.log("problem with " + e + m._layers[i]);
          }
        }
      }
      this.populationIsDrawn = false;
    },
  },
};
</script>

