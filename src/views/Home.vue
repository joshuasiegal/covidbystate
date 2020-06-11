<template>
  <div id="home">
    <h2>Covid By State</h2>

    <button @click="getCovidData">TEST GET DATA</button>

    <div id="state-grid">
      <button v-for="state in states" :class="{'selected':(isStateSelected(state))}" @click="toggleSelectState(state)">{{state}}</button>
    </div>

    <div v-for="cd, key in allCovidData">
      <h3>{{ key }}</h3>
      <div v-for="st in cd">
        <p>{{ st.date }} : {{ st.percentOfHighPoint }} : {{st.rollingAverage}}</p>
      </div>
    </div>
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
// import SubComponent from '@/components/SubComponent.vue'


export default {
  name: 'Home',

  components: {
    // SubComponent
  },

  props:['statestring'],

  data: () => ({
    allCovidData: {},
    states: ['AK', 'AL', 'AR', 'AS', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'GU', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MP', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UM', 'UT', 'VA', 'VI', 'VT', 'WA', 'WI', 'WV', 'WY'],
    selectedStates: [],
    stateMetaData: {},
    rollingAvgSize: 3
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
      for (let d=0; d<dataLength; d++) {
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

      // make high point percents and rolling averages
      for (let state in stateNormedData) {
        let theStateData = stateNormedData[state]
        let theStateDataLength = theStateData.length
        let stateMeta = this.stateMetaData[state]

        let avgBuffer = []
        
        for (let hp=0; hp<theStateDataLength; hp++) {
          let currentData = theStateData[hp]
          let posIncrease = currentData.positiveIncrease
          
          //normalize
          currentData.percentOfHighPoint = Math.round((posIncrease / stateMeta.highPoint) * 100)
        
          //rolling avg
          avgBuffer.push(posIncrease)
          if (avgBuffer.length > rollingAvgSize) {
            avgBuffer.shift()
          }
          currentData.rollingAverage = avgBuffer.reduce((acc, cur) => {
            return Math.round(acc + cur / rollingAvgSize)
          })
        }
      }

      //assign to data
      this.allCovidData = stateNormedData

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

    },

    isStateSelected(state) {
      return (this.selectedStates.indexOf(state) >= 0)
    },

    setSelectedStates() {
      this.selectedStates = (this.statestring) ? this.statestring.split('|') : []
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