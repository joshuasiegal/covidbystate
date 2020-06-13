<template>
  <div id="chart-buttons">
    
    <div id="state-grid">
      <button v-for="state in states" :class="{'selected':(isStateSelected(state))}" @click="toggleSelectState(state)">{{state}}</button>
    </div>
    <div id="conv-grid">
      <button @click="clearSelections" class="button-clear-selections">Clear Selections</button>
      <button @click="selectAllStates" class="button-select-all">Select All States</button>
    </div>


  </div>
</template>

<style scoped lang="scss">
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
  name: 'ChartButtons',

  components: {
    // SubComponent
  },

  props:['selectedStates', 'states'],

  data: () => ({
    statesForURL: []
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

    updateURL() {
      let newParam = this.statesForURL.join('|')
      this.$router.push({path: `/${newParam}`})
    },

    setStates() {
      this.statesForURL = this.selectedStates
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