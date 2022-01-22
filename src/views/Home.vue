<template>
  <div id="home">

    <div>
      <chart-buttons :selected-states="selectedStates" :states="states"></chart-buttons>

      <div id="source-select-cont">
        <select v-model="activeSourceKey" :disabled="dataLoading">
          <option v-for="source in sources" :value="source.id">
            {{ source.label }}
          </option>
        </select>
      </div>

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
    width: 80%;
    min-height: 400px;
    margin: 0px auto;
  }

  #source-select-cont {
    padding-bottom: 24px;
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
import * as cdcParser from '@/parsers/cdcParser.js'
import * as ctpParser from '@/parsers/ctpParser.js'
import * as actnowParser from '@/parsers/actnowParser.js'

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
    rollingAvgSize: 7,
    activeSourceKey: 'actnow',
    sources: [
      {
        id: 'cdc',
        url: 'https://data.cdc.gov/resource/9mfq-cb36.json?$limit=999999',
        label: 'Centers for Disease Control'
      },
      {
        id: 'ctp',
        url: 'https://api.covidtracking.com/v1/states/daily.json',
        label: 'Covid Tracking Project'
      },
      {
        id: 'actnow',
        url: 'https://api.covidactnow.org/v2/states.timeseries.json?apiKey=435a557a83da465b9f100b312a947077',
        label: 'Covid ActNow'
      }
    ]
  }),

  methods: {

    getCovidData() {
      this.dataLoading = true

      fetch(this.activeSource.url)
        .then(response => response.json())
        .then(data => {
          this.activeParser(data)
          //this.normalizeDataByState(data)
        })
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
          stateSeriesObj.data.push([thisDataPoint.datems, thisDataPoint.normRollingAverage]) //percentOfHighPoint | normRollingAverage | positiveIncrease
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
    },

    activeSourceKey: function() {
      this.getCovidData()
    }
  },

  computed: {
    activeParser: function() {
      let parser
      switch (this.activeSourceKey) {
        case 'cdc':
          parser = cdcParser.normalizeCDCData
          break
        case 'ctp':
          parser = ctpParser.normalizeCTPData
          break
        case 'actnow':
          parser = actnowParser.normalizeActNowData
          break
      }//switch

      return parser
    },

    activeSource: function() {
      return this.sources.filter((source) => {
        return source.id == this.activeSourceKey
      })[0]
    }
  },

  created() {
    this.setInitialStates()
    this.getCovidData()
  },

  mounted() {
    
  }
}
</script>