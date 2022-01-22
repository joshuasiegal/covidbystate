<template>
  <div id="chart-bounds">
    <h3 v-if="!chartData.length" class="header-select-states">Select some States!</h3>
    <div id="chart">
      


    </div>
  </div>
</template>

<style scoped lang="scss">

  #chart-bounds {
    position:relative;
    width:100%;
  
    .header-select-states {
      text-align:center;
      position:absolute;
      z-index:9999;
      width:100%;
      top:48px;
      left:0;
    }

  }

</style>

<script>
import Highcharts from 'highcharts'


export default {
  name: 'Chart',

  components: {
  },

  props:['chartData'],

  data: () => ({
    seriesData: []
  }),

  methods: {
    createChart() {

      if (!this.chartData) { return false }

      Highcharts.chart('chart', {
        /*
        chart: {
            zoomType: 'x'
        },
        */
        title: {
           text: ''
        },
        tooltip: {
          enabled:true,
          useHTML:true,
          headerFormat:'',
          pointFormat:'<span class="hc-tooltip-legend">{series.name}</span>',
          footerFormat:''
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
          title: {
            text: '% of Highest Value, 7-day Rolling Average'
          }
        },
 
        plotOptions: {
          line: {
            marker: {
              enabled:false,
              states: {
                hover: {
                  enabled:false
                }
              }
            }

          }
        },

        series: this.chartData
      })
    } //createChart

  },

  watch: {
    //better as a computed, or will Highcharts not respond to that?
    chartData: function() {
      this.createChart()
    }

  },

  computed: {

  },

  created() {

  },

  mounted() {
    this.createChart()
  }
}
</script>