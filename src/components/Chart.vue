<template>
  <div id="chart">
    


  </div>
</template>

<style scoped lang="scss">

</style>

<script>
import Highcharts from 'highcharts'
// import SubComponent from '@/components/SubComponent.vue'


export default {
  name: 'Chart',

  components: {
    // SubComponent
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
          footerFormat:''//'<span class="hc-tooltip-val">{point.y}% of Highest Day</span>'
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
    //better as a computed, or will Highcharts not respond to that
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