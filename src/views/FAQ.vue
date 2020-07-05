<template>
  <div id="faq">
    <site-header></site-header>

    <div id="faq-cont">

      <h3>(More or Less) Frequently Asked Questions</h3>

      <dl>
        <dt>What do these charts show?</dt>
        
          <dd>I wanted a way to compare the different trajectories of state coronavirus cases, so I could get a quick comparative picture of how various states were dealing with the crisis.  Each line shows a timeline of a particular state, relative to its highest number of cases per day.  They overlay in the chart for easy comparison.</dd>

        <dt>What do these charts not show?</dt>
        
          <dd>These charts do not show absolute data, per capita data, logarithmic data, fatalities, or any other statistics besides daily case counts relative to highest daily case counts.  There are a lot of good resources for other numbers online, for example, the <a href="https://www.nytimes.com/interactive/2020/us/coronavirus-us-cases.html" target="_blank">NYT Coronavirus Tracker</a> or the <a href="https://ncov2019.live/" target="_blank">ncovid2019.live</a> tracker.  And, of course, there's <a href="https://covidtracking.com/" target="_blank">The Covid Tracking Project</a>, which is the data source for this project.</dd>


        <dt>How does this site make money?</dt>

          <dd>It doesn’t.  This site is provided as a free resource.  I had trouble finding a visualization of relative coronavirus cases by state, so I made this tool.  I hope it helps people get a picture of how various states are battling coronavirus.</dd>


        <dt>How can I help</dt>

          <dd><a href="https://www.forbes.com/sites/morgansimon/2020/04/14/covid-19-giving-guide-how-to-donate-to-reach-the-most-marginalized/#323d96d31a72" target="_blank">Here is an article that details some ways to help.</a><br /><br />Also, you can protect other people by <em>wearing your mask</em>.</dd>
      
      </dl>

    </div>
              
    <router-link class="router-link" to="/Home">Home</router-link>

    <site-footer></site-footer>
  </div>
</template>

<style scoped lang="scss">

  #faq-cont {
    width:80%;
    margin:12px auto;
    min-height:400px;

    a {
      text-decoration:underline;

      &:hover {
        text-decoration:none;
      }
    }


    h3 {
      font-size:16pt;
      width:100%;
      text-align:center;
    }

    dl {
      width:72%;
      text-align:left;
      margin:36px auto 24px;

      dt {
        font-weight:bold;
        margin-top:16px;
      }

      dd {
        margin-top:12px;
        padding-bottom:18px;
      }
    }


  }

</style>

<script>
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter' 

export default {
  name: 'FAQ',

  components: {
    SiteHeader, SiteFooter
  }

}
</script>