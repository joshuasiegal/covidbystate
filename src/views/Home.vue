<template>
  <div id="home">
    <h2>Covid By State</h2>

    <button @click="getCovidData">TEST GET DATA</button>

    <div id="state-grid">
      <button v-for="state in states" :class="{'selected':(isStateSelected(state))}" @click="toggleSelectState(state)">{{state}}</button>
    </div>

    <div id="chart-container">
      <chart :chart-data="stateChartData"></chart>
    </div>

    <!--
    <div v-for="cd, key in allCovidData">
      <h3>{{ key }}</h3>
      <div v-for="st in cd">
        <p>{{ st.date }} : {{ st.percentOfHighPoint }} : {{st.rollingAverage}}</p>
      </div>
    </div>
    -->

  </div>
</template>

<style scoped lang="scss">

  h2 {
    font-size:24pt;
  }

  button {
    border:1px solid grey;
    padding:4px 8px;
    border-radius:4px;
    cursor:pointer;
  }

  #state-grid {
    margin:24px auto;
    width:60vw;
    display:grid;
    gap:4px;
    grid-template-columns:repeat(13, 1fr);


   button {
      width:36px;
      grid-column:auto / auto;
      grid-row:auto / auto;

      &.selected {
        background-color:#CEA3A3;
      }
    }
  }

</style>

<script>
import Chart from '@/components/Chart.vue'


export default {
  name: 'Home',

  components: {
    Chart
  },

  props:['statestring'],

  data: () => ({
    allCovidData: {},
    stateChartData: [],
    //TODO: y field (could be switchable)
    states: ['AK', 'AL', 'AR', 'AS', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'GU', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MP', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UM', 'UT', 'VA', 'VI', 'VT', 'WA', 'WI', 'WV', 'WY'],
    selectedStates: [],
    stateMetaData: {},
    rollingAvgSize: 7
  }),

  methods: {
    getCovidData() {

      //TODO: build cache - > 4MB?

      fetch('https://covidtracking.com/api/v1/states/daily.json')
        .then(response => response.json())
        .then(data => {
          this.normalizeDataByState(data)
        })
    },

    normalizeDataByState(data) {

      let stateNormedData = {};


      //prefill stateNormedData and stateMetaData for states
      this.states.map(state => {
        stateNormedData[state] = []
        this.stateMetaData[state] = {}
      })


      //manipulate data

      let dataLength = data.length
      
      //fill stateNormedData with data per state
      //reverse b/c COVID-19 Tracker data is chornologically backwards
      for (let d=dataLength-1; d>=0; d--) {
        let cd = data[d]
        stateNormedData[cd.state].push(cd)
      }

      //make high points
      for (let state in stateNormedData) {
        let theStateData = stateNormedData[state]
        let theStateDataLength = theStateData.length
        let stateMeta = this.stateMetaData[state]
        stateMeta.highPoint = 0

        for (let hp=0; hp<theStateDataLength; hp++) {
          let currentData = theStateData[hp]
          let currentHighPoint = stateMeta.highPoint
          let posIncrease = currentData.positiveIncrease

          if (posIncrease > currentHighPoint) {
            stateMeta.highPoint = posIncrease
          }
        }
      }



      let rollingAvgSize = this.rollingAvgSize

      // make high point percents, rolling averages, date ms
      for (let state in stateNormedData) {
        let theStateData = stateNormedData[state]
        let theStateDataLength = theStateData.length
        let stateMeta = this.stateMetaData[state]
        let theStateChartData = this.stateChartData[state]

        let avgBuffer = []
        let normAvgBuffer = []
        
        for (let hp=0; hp<theStateDataLength; hp++) {
          let currentData = theStateData[hp]
          let posIncrease = currentData.positiveIncrease
          
          //TODO - offload calculations to when we build the graph data?

          //normalize
          let percHighPoint = Math.round((posIncrease / stateMeta.highPoint) * 100)
          currentData.percentOfHighPoint = percHighPoint
        
          //rolling avg
          avgBuffer.push(posIncrease)
          if (avgBuffer.length > rollingAvgSize) {
            avgBuffer.shift()
          }
          let sumBuffer = avgBuffer.reduce((acc, cur) => acc + cur)
          currentData.rollingAverage = Math.round(sumBuffer / rollingAvgSize)

          //normalized avg
          normAvgBuffer.push(percHighPoint)
          if (normAvgBuffer.length > rollingAvgSize) {
            normAvgBuffer.shift()
          }
          let normSumBuffer = normAvgBuffer.reduce((acc, cur) => acc + cur)
          currentData.normRollingAverage = Math.round(normSumBuffer / rollingAvgSize)

          //date
          //var txt2 = txt1.slice(0, 3) + "bar" + txt1.slice(3);
          let curDateString = currentData.date.toString()
          let curDateFormatted = curDateString.slice(0,4) + "-" + curDateString.slice(4,6) + "-" + curDateString.slice(6,8)
          //TODO: improve this - gotta be super slow
          currentData.datems = new Date(curDateFormatted).getTime()
        }
      }

      //assign to data
      this.allCovidData = stateNormedData
      this.allCovidData.populated = true

      if (this.selectedStates.length) {
        this.makeChartData()
      }

    },


    makeChartData() {

      console.log("MAKE CHART DATA")

      let localStateChartData = []

      //TODO - dynamically handle yField changes etc

      this.selectedStates.map(state => {
        let stateSeriesObj = {}
        stateSeriesObj.name = state
        stateSeriesObj.type = 'line'
        stateSeriesObj.marker = {enabled:false}
        stateSeriesObj.data = []
        // stateSeriesObj.color = this.stateMetaData.color

        let stateCovidData = this.allCovidData[state]

        //TODO: sort stateCovidData by date?

        let stateCovidDataLength = stateCovidData.length
        for (let sd=0; sd<stateCovidDataLength; sd++) {
          let thisDataPoint = stateCovidData[sd]
          stateSeriesObj.data.push([thisDataPoint.datems, thisDataPoint.normRollingAverage]) //percentOfHighPoint | rollingAverage | normRollingAverage | positiveIncrease
        }
        
        localStateChartData.push(stateSeriesObj)
      })

      this.stateChartData = localStateChartData

    },


    toggleSelectState(state) {
      let stateIndex = this.selectedStates.indexOf(state)
      if (stateIndex == -1) {
        this.selectedStates.push(state)
      } else {
        this.selectedStates.splice(stateIndex, 1)
      }

      let newParam = this.selectedStates.join('|')

      this.$router.push({path: `/${newParam}`})

      console.log()
      if (this.allCovidData.populated){
        this.makeChartData()
      }

    },

    isStateSelected(state) {
      return (this.selectedStates.indexOf(state) >= 0)
    },

    setSelectedStates() {
      this.selectedStates = (this.statestring) ? this.statestring.split('|') : []
      if (this.allCovidData.populated){
        this.makeChartData()
      }
    }


  },

  watch: {

  },

  computed: {

  },

  created() {

  },

  mounted() {
    this.setSelectedStates()
    console.log("mounted home")
  }
}
</script>