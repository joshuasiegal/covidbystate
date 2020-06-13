<template>
  <div id="chart-buttons">
    
    <div id="state-grid">
      <button v-for="state in states" :class="{'selected':(isStateSelected(state))}" @click="toggleSelectState(state)">{{state}}</button>
    </div>
    <div id="conv-grid">
      <button @click="clearSelections" class="button-clear-selections button-pill button-pill-left">Clear Selections</button>
      <button @click="selectRegion('pacific')" class="button-select-west button-pill">Pacific</button>
      <button @click="selectRegion('west')" class="button-select-west button-pill">West</button>
      <button @click="selectRegion('southwest')" class="button-select-southwest button-pill">Southwest</button>
      <button @click="selectRegion('plains')" class="button-select-southwest button-pill">Plains</button>
      <button @click="selectRegion('midwest')" class="button-select-midwest button-pill">Midwest</button>
      <button @click="selectRegion('south')" class="button-select-west button-pill">South</button>
      <button @click="selectRegion('southeast')" class="button-select-west button-pill">Southeast</button>
      <button @click="selectRegion('newengland')" class="button-select-west button-pill">New England</button>
      <button @click="selectRegion('northeast')" class="button-select-west button-pill">NorthEast</button>
      <button @click="selectRegion('territories')" class="button-select-west button-pill">Territories</button>
      <button @click="selectAllStates" class="button-select-all button-pill button-pill-right">Select All States</button>
    </div>


  </div>
</template>

<style scoped lang="scss">

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

  #conv-grid {
    margin-bottom:24px;

    .button-pill {
      border-radius:0;

      &.button-pill-left {
        border-radius:4px 0 0 4px;
      }

      &.button-pill-right {
        border-radius:0 4px 4px 0;
      }
    }
  }

</style>

<script>
// import SubComponent from '@/components/SubComponent.vue'


export default {
  name: 'ChartButtons',

  components: {
    // SubComponent
  },

  props:['selectedStates', 'states'],

  data: () => ({
    statesForURL: [],
    regionStrings: {
      pacific: 'WA|OR|CA|HI|AK', 
      west: 'NV|ID|MT|WY|CO|UT',
      southwest: 'AZ|NM|TX|OK',
      plains: 'ND|SD|NE|KS|IA|MO',
      midwest: 'MN|WI|IL|MI|IN|OH',
      south: 'AR|LA|MS|TN|KY|AL',
      southeast: 'GA|FL|NC|SC|VA|WV',
      newengland: 'ME|VT|NH|MA|RI|CT',
      northeast: 'NY|PA|DC|NJ|DE|MD',
      territories: 'GU|MP|PR|UM|AS|VI',
    }
  }),

  methods: {
    toggleSelectState(state) {
      let stateIndex = this.statesForURL.indexOf(state)
      if (stateIndex == -1) {
        this.statesForURL.push(state)
      } else {
        this.statesForURL.splice(stateIndex, 1)
      }

      this.updateURL()
    },

    isStateSelected(state) {
      return (this.selectedStates.indexOf(state) >= 0)
    },

    clearSelections() {
      this.statesForURL = []
      this.updateURL()
    },

    selectAllStates() {
      this.statesForURL = [...this.states]
      this.updateURL()
    },

    updateURL(param) {
      let paramString = (param) ? param : this.statesForURL.join('|')
      this.$router.push({path: `/${paramString}`})
    },

    setStates() {
      this.statesForURL = this.selectedStates
    },

    selectRegion(region) {
      this.updateURL(this.regionStrings[region])
    }

  },

  watch: {

  },

  computed: {

  },

  created() {
    this.setStates()
  },

  mounted() {
    
  }
}
</script>