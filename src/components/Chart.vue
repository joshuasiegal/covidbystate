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
        title: {
            text: 'USA Covid Cases By State'
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
        },
        */
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: '% of Highest Value, 7-day Rolling Average'
            }
        },
        /*
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        */

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