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

    <div id="conv-select-cont">
      <select id="conv-select" v-model="selectedRegion">
        <option value="">Select a Region...</option>
        <option value="pacific">Pacific</option>
        <option value="west">West</option>
        <option value="southwest">Southwest</option>
        <option value="plains">Plains</option>
        <option value="midwest">Midwest</option>
        <option value="south">South</option>
        <option value="southeast">Southeast</option>
        <option value="newengland">New England</option>
        <option value="northeast">Northeast</option>
        <option value="territories">Territories</option>
      </select>
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
    justify-items:stretch;


   button {
      width:auto;
      grid-column:auto / auto;
      grid-row:auto / auto;

      &.selected {
        background-color:#CEA3A3;
      }
    }
  }

  #conv-grid {
    .button-pill {
      border-radius:0;
      padding:8px;
      margin-bottom:24px;

      &.button-pill-left {
        border-radius:4px 0 0 4px;
      }

      &.button-pill-right {
        border-radius:0 4px 4px 0;
      }
    }
  }

  #conv-select-cont {
    display:none;
  }


  @media (min-width: 320px) and (max-width: 1000px) {
    
    #state-grid {
      width:96vw;
      grid-template-columns:repeat(6, 1fr);
      gap:8px;

      button {
        width:auto;  
        padding:8px 0px;
      }
    }

    .button-pill {
      display:none;
    }

    .button-pill-left,
    .button-pill-right {
      padding:12px;
      display:inline;
    }

    #conv-select-cont {
      display:block;
      margin-bottom:24px;
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
    selectedRegion:'',
    regionStrings: {
      pacific: ['WA','OR','CA','HI','AK'], 
      west: ['NV','ID','MT','WY','CO','UT'],
      southwest: ['AZ','NM','TX','OK'],
      plains: ['ND','SD','NE','KS','IA','MO'],
      midwest: ['MN','WI','IL','MI','IN','OH'],
      south: ['AR','LA','MS','TN','KY','AL'],
      southeast: ['GA','FL','NC','SC','VA','WV'],
      newengland: ['ME','VT','NH','MA','RI','CT'],
      northeast: ['NY','PA','DC','NJ','DE','MD'],
      territories: ['GU','MP','PR','UM','AS','VI'],
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

      this.selectedRegion = ''
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

    updateURL() {
      let paramString = this.statesForURL.join('|')
      this.$router.push({path: `/${paramString}`})
    },

    setStates() {
      this.statesForURL = this.selectedStates
    },

    selectRegion(region) {
      this.statesForURL = [...this.regionStrings[region]]
      this.updateURL()
    }

  },

  watch: {
    selectedRegion: function(region) {
      if (region) {
        this.selectRegion(region)
      }
    }
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