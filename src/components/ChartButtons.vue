<template>
  <div id="chart-buttons">
    
    <div id="state-grid">
      <button v-for="state in states" :class="{'selected':(isStateSelected(state)), 'default-active':(isStateActiveDefault(state))}" @click="toggleSelectState(state)">{{state}}</button>
    </div>

    <div id="conv-regions">
      <div class="mobile-set">
        <button @click="selectRegion('largest')" class="button-pill">Largest</button>
        <button @click="selectRegion('pacific')" class="button-pill">Pacific</button>
        <button @click="selectRegion('west')" class="button-pill">West</button>
        <button @click="selectRegion('southwest')" class="button-pill">Southwest</button>
        <button @click="selectRegion('plains')" class="button-pill">Plains</button>
        <button @click="selectRegion('midwest')" class="button-pill">Midwest</button>
        <button @click="selectRegion('south')" class="button-pill">South</button>
        <button @click="selectRegion('southeast')" class="button-pill">Southeast</button>
        <button @click="selectRegion('newengland')" class="button-pill">New England</button>
        <button @click="selectRegion('northeast')" class="button-pill">Northeast</button>
        <button @click="selectRegion('territories')" class="button-pill">Territories</button>
      </div>
    </div>

    <div id="conv-settings">
      <div class="mobile-set">
        <button @click="clearSelections" class="button-clear-selections button-pill">Clear Selections</button>
        <button @click="selectAllStates" class="button-select-all button-pill">Select All States</button>
        <button @click="copyLink" class="button-copy-link button-pill">Copy Link
          <span class="verification verification-copy link" :class="{'active':linkCopied}">Copied!</span>
        </button>
      </div>
      <div class="mobile-set"> 
        <button @click="handleDefaultStates" :class="{'disabled':!selectedStates.length && !defaultStates.length}" class="button-defaults button-pill">
          <span v-text="(defaultStates.length) ? 'Clear Default' : 'Set As Default' " ></span>
          <span class="verification verification-default-states" :class="{'active':defaultStatesSet}">You're Set!</span>
          <span class="verification verification-clear-default-states" :class="{'active':defaultStatesClear}">Cleared!</span>
        </button>
        <button @click="showDefault" :class="{'disabled':!showDefaultEnabled, 'active':showDefaultActive}" class="button-show-default button-pill">Show Default</button>
      </div>
    </div>

    <div id="conv-select-cont">
      <select id="conv-select" v-model="selectedRegion">
        <option value="">Select a Region...</option>
        <option value="largest">Largest</option>
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

  @mixin left-pill {
    border-radius:4px 0 0 4px;
  }

  @mixin right-pill {
    border-radius:0 4px 4px 0;
  }

  #state-grid {
    margin:24px auto;
    width:72vw;
    display:grid;
    gap:4px;
    grid-template-columns:repeat(15, 1fr);
    justify-items:stretch;


   button {
      width:auto;
      grid-column:auto / auto;
      grid-row:auto / auto;

      &.selected {
        background-color:#CEA3A3;
      }

      &.selected.default-active {
        background-color:#A3AACE;
      }
    }
  }

  .verification {
    background-color:#3366CC;
    color:#F0F0F0;
    position:absolute;
    z-index:999;
    display:block;
    padding:3px 6px;
    top:0px;
    left:0px;
    width:100%;
    display:none;
    border-radius:2px;

    &.active {
      display:block;
      animation:fadeInAndRiseOut 1.5s ease-out forwards;
    }

  }

  #conv-regions,
  #conv-settings {

    .button-pill {
      border-radius:0;
      padding:8px;
      margin-bottom:24px;
      position:relative;
      overflow:visible;
    }

    .mobile-set {
      display:inline;

      &:first-child button:first-child {
        @include left-pill;
      }

      &:last-child button:last-child {
        @include right-pill;
      }
    }

    .button-show-default.disabled.active {
      background-color:#A3AACE;
      color:#FFFFFF;
    }
  }

  #conv-settings .button-pill {
    width:120px;
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

    #conv-regions {
      display:none;
    }

    #conv-settings {
      .mobile-set {
        display:block;

        button:first-child {
          @include left-pill;
        }

        button:last-child {
          @include right-pill;
        }
      }

    }

    #conv-select-cont {
      display:block;
      margin-bottom:24px;
    }

  }



</style>

<script>
// import SubComponent from '@/components/SubComponent.vue'
import Clipboard from 'clipboard'

export default {
  name: 'ChartButtons',

  components: {
    // SubComponent
  },

  props:['selectedStates', 'states'],

  data: () => ({
    ANIMATION_TIME:1500,
    statesForURL:[],
    selectedRegion:'',
    defaultStates:[],
    defaultStatesSet:false,
    defaultStatesClear:false,
    linkCopied:false,
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
      largest: ['CA','TX','NY','IL','FL','OH','PA','NC','GA','MI']
    }
  }),

  methods: {
    toggleSelectState(state) {

      const stateIndex = this.statesForURL.indexOf(state)
      if (stateIndex == -1) {
        this.statesForURL.push(state)
      } else {
        this.statesForURL.splice(stateIndex, 1)
      }


      this.selectedRegion = ''
      this.updateURL()
    },

    handleDefaultStates() {
      if (!this.selectedStates.length && !this.defaultStates.length) {
        return
      }

      if (this.defaultStates.length) {
        this.clearDefaultStates()
        return
      }

      this.setDefaultStates()
    },

    setDefaultStates() {
      try {
        localStorage.setItem('defaultStates',this.selectedStates.join('-'))
        this.defaultStates = this.selectedStates
        this.defaultStatesSet = true
        setTimeout(() => {
          this.defaultStatesSet = false
        },this.ANIMATION_TIME)
      } catch(e) {
       console.warn(e)
      }
    },

    clearDefaultStates() {
      try {  
        localStorage.setItem('defaultStates','')
        this.defaultStates = []
        this.defaultStatesClear = true
        setTimeout(() => {
          this.defaultStatesClear = false
        },this.ANIMATION_TIME)
      } catch(e) {
        console.warn(e)
      }
    },

    showDefault() {
      if (!this.showDefaultEnabled) { return }
      this.statesForURL = [...this.defaultStates]
      this.updateURL()
    },

    isStateSelected(state) {
      return (this.selectedStates.indexOf(state) >= 0)
    },

    isStateActiveDefault(state) {
      return  ( (this.defaultStates.indexOf(state) >= 0 ) &&
              !this.showDefaultEnabled )
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
      const paramString = this.statesForURL.join('-')
      this.$router.push({path: `/${paramString}`})
    },

    setStates() {
      const defaultStateString = localStorage.getItem('defaultStates')
      this.defaultStates = (defaultStateString) ? defaultStateString.split('-') : []
      this.statesForURL = (this.selectedStates.length) ? [...this.selectedStates] : [...this.defaultStates]

      if (defaultStateString && !this.selectedStates.length) {
        this.updateURL()
      }
    },

    selectRegion(region) {
      this.statesForURL = [...this.regionStrings[region]]
      this.updateURL()
    },

    copyLink() {
      const clipb = new Clipboard('.button-copy-link',{
        text:() => {
          return window.location.href
        }
      })
      clipb.on('success', () => {
        this.linkCopied = true
        setTimeout(() => {
          this.linkCopied = false
        },this.ANIMATION_TIME)
        clipb.destroy()
      })
      clipb.on('error', () => {
        console.warn("Could not copy to clipboard")
        clipb.destroy()
      })
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
    showDefaultEnabled() {
      if (!this.defaultStates.length) { return false }
      return (this.selectedStates.join('-') != this.defaultStates.join('-'))
    },
    showDefaultActive() {
      return (!this.showDefaultEnabled && this.selectedStates.length && this.defaultStates.length)
    }
  },

  created() {
    this.setStates()
  },

  mounted() {
    
  }
}
</script>