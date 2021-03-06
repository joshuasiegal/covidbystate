<template>
  <div id="home">

    <div>
      <chart-buttons :selected-states="selectedStates" :states="states"></chart-buttons>

      <loader v-if="dataLoading"></loader>

      <div id="chart-container" v-if="!dataLoading">
        <chart :chart-data="stateChartData"></chart>
      </div>
    </div>

    <info></info>

    <signup></signup>

    <router-link class="router-link" to="/FAQ">FAQ</router-link>

  </div>
</template>

<style scoped lang="scss">

  #chart-container {
    width:80%;
    min-height:400px;
    margin:0px auto;
  }

  @media (min-width: 320px) and (max-width: 1000px) {
    #chart-container {
      width:96%;
    }
  }

</style>

<script>
import ChartButtons from '@/components/ChartButtons'
import Loader from '@/components/Loader'
import Chart from '@/components/Chart'
import Info from '@/components/Info'
import Signup from '@/components/Signup'

export default {
  name: 'Home',

  components: {
    ChartButtons, Loader, Chart, Info, Signup
  },

  props:['statestring'],

  data: () => ({
    dataLoading:false,
    allCovidData: {},
    stateChartData: [],
    states: ['AK', 'AL', 'AR', 'AS', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'GU', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MP', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UM', 'UT', 'VA', 'VI', 'VT', 'WA', 'WI', 'WV', 'WY'],
    selectedStates: [],
    stateMetaData: {},
    rollingAvgSize: 7
  }),

  methods: {

    getCovidData() {
      /*
      //covid data response is now > 5MB, so too large for localstorage
      //TODO: find another cache option?
      const cacheDate = parseInt(localStorage.getItem('cacheDate'),10) || 0
      const curDate = parseInt(this.getCurrentDateString())
      if (curDate > cacheDate) {
        this.fetchCovidData()
      } else {
        this.getCovidCache()
      }
      */

      this.fetchCovidData()
    },

    /*
    //see above method - API data is now too large to cache in localStorage
    getCovidCache() {
      const rawCache = localStorage.getItem('covidCache')
      if (!rawCache) {
        this.fetchCovidData()
        return
      }

      const cache = JSON.parse(rawCache)

      this.normalizeDataByState(cache)
    },
    */

    /*
    //see above method - API data is now too large to cache in localStorage
    setCovidCache(covidData) {

      localStorage.setItem('covidCache', '')
      localStorage.setItem('cacheDate', '')

      try {
        localStorage.setItem('covidCache', JSON.stringify(covidData))
      } catch(e) {
        console.error(e)
        return
      }

      const curDate = this.getCurrentDateString()
      localStorage.setItem('cacheDate', curDate)
    },
    */

    fetchCovidData() {
      this.dataLoading = true

      fetch('https://api.covidtracking.com/v1/states/daily.json')


        .then(response => response.json())
        .then(data => {

          // see above - covid API response data is now too large for localStorage
          //this.setCovidCache(data)

          this.normalizeDataByState(data)
        })
    },

    /*
    //see above method - API data is now too large to cache in localStorage
    getCurrentDateString() {
      const curDateObj = new Date()
      const year = curDateObj.getFullYear().toString()
      let month = curDateObj.getMonth() + 1
      month = (month < 10) ? '0' + month : month.toString()
      let date = curDateObj.getDate()
      date = (date < 10) ? '0' + date : date.toString()
      return year + month + date
    },
    */

    normalizeDataByState(data) {

      let stateNormedData = {};

      //prefill stateNormedData and stateMetaData for states
      this.states.map(state => {
        stateNormedData[state] = []
        this.stateMetaData[state] = {}
      })


      //manipulate data

      const dataLength = data.length
      
      //fill stateNormedData with data per state
      //reverse b/c COVID-19 Tracker data is chornologically backwards
      for (let d=dataLength-1; d>=0; d--) {
        let cd = data[d]
        if (cd.date > 20200301) {
          stateNormedData[cd.state].push(cd)
        }
      }

      //make high points
      for (let state in stateNormedData) {
        const theStateData = stateNormedData[state]
        const theStateDataLength = theStateData.length
        const stateMeta = this.stateMetaData[state]
        stateMeta.highPoint = 0

        for (let hp=0; hp<theStateDataLength; hp++) {
          const currentData = theStateData[hp]
          const currentHighPoint = stateMeta.highPoint
          const posIncrease = currentData.positiveIncrease

          if (posIncrease > currentHighPoint) {
            stateMeta.highPoint = posIncrease
          }
        }
      }


      const rollingAvgSize = this.rollingAvgSize

      // normalize and format state-level data
      for (let state in stateNormedData) {
        const theStateData = stateNormedData[state]
        const theStateDataLength = theStateData.length
        const stateMeta = this.stateMetaData[state]
        const theStateChartData = this.stateChartData[state]

        const avgBuffer = []
        const normAvgBuffer = []
        
        for (let hp=0; hp<theStateDataLength; hp++) {
          const currentData = theStateData[hp]
          const posIncrease = currentData.positiveIncrease
          
          //normalize
          const percHighPoint = Math.round((posIncrease / stateMeta.highPoint) * 100)
          currentData.percentOfHighPoint = percHighPoint
        
          /*
          //raw rolling avg
          avgBuffer.push(posIncrease)
          if (avgBuffer.length > rollingAvgSize) {
            avgBuffer.shift()
          }
          const sumBuffer = avgBuffer.reduce((acc, cur) => acc + cur)
          currentData.rollingAverage = Math.round(sumBuffer / rollingAvgSize)
          */

          //normalized avg
          normAvgBuffer.push(percHighPoint)
          if (normAvgBuffer.length > rollingAvgSize) {
            normAvgBuffer.shift()
          }
          const normSumBuffer = normAvgBuffer.reduce((acc, cur) => acc + cur)
          currentData.normRollingAverage = Math.round(normSumBuffer / rollingAvgSize)

          //date
          const curDateString = currentData.date.toString()
          const curDateFormatted = curDateString.slice(0,4) + "-" + curDateString.slice(4,6) + "-" + curDateString.slice(6,8)
          //TODO: improve this - gotta be super slow
          // -- contacted Covid Tracking Project about this - see API v2?
          currentData.datems = new Date(curDateFormatted).getTime()
        }
      }

      //assign to data
      this.allCovidData = stateNormedData
      this.allCovidData.populated = true

      this.covidDataReady()

    },


    covidDataReady() {
      if (this.selectedStates.length) {
        this.makeChartData()
      }

      this.dataLoading = false
    },


    makeChartData() {
      const localStateChartData = []

      this.selectedStates.map(state => {
        const stateCovidData = this.allCovidData[state]
        if (!stateCovidData) { return }

        const stateSeriesObj = {}
        stateSeriesObj.name = state
        stateSeriesObj.type = 'line'
        stateSeriesObj.data = []

        const stateCovidDataLength = stateCovidData.length
        for (let sd=0; sd<stateCovidDataLength; sd++) {
          let thisDataPoint = stateCovidData[sd]
          stateSeriesObj.data.push([thisDataPoint.datems, thisDataPoint.normRollingAverage]) //percentOfHighPoint | rollingAverage | normRollingAverage | positiveIncrease
        }
        
        localStateChartData.push(stateSeriesObj)
      })

      this.stateChartData = localStateChartData

    },


    setInitialStates() {
      this.selectedStates = (this.statestring) ? this.statestring.split('-') : []
      if (this.allCovidData.populated){
        this.makeChartData()
      }
    }

  },

  watch: {
    statestring: function() {
      this.selectedStates = (this.statestring) ? this.statestring.split('-') : []
      if (this.allCovidData.populated) {
        this.makeChartData()
      } else {
        this.getCovidData()
      }
    }
  },

  computed: {

  },

  created() {
    this.setInitialStates()
    this.getCovidData()
  },

  mounted() {
    
  }
}
</script>