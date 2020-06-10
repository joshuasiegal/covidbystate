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
        <p>{{ st.date }} : {{ st.positiveIncrease }}</p>
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
    allCovidData: [],
    states: ['AK', 'AL', 'AR', 'AS', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'GU', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MP', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UM', 'UT', 'VA', 'VI', 'VT', 'WA', 'WI', 'WV', 'WY'],
    selectedStates: []
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

      this.states.map(state => {
        stateNormedData[state] = []
      })

      data.map(cd => {
        stateNormedData[cd.state].push(cd)
      })

      this.allCovidData = stateNormedData

      //TODO - seven-day avgs

      console.log(this.allCovidData.IL[0].date, this.allCovidData.IL[0].positiveIncrease)

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