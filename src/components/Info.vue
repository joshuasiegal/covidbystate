<template>
  <div id="info">
    <p>This site shows the trajectory of daily cases in each state, normalized to each state's largest single day of cases, on a 7-day rolling average.  If a date has a value of <span class="value">50</span>, that means that the number of cases for that day, averaged with 7 days previous to it, is 50% of that state's highest reported number of cases.</p>
  </div>
</template>

<style scoped lang="scss">

  #info {
    margin:36px auto;
    width:60%;

    .covid-tracking-project {
      display:block;
      width:128px;
      height:42px;
      padding:4px;
      margin:0px auto 24px;
      background-color:#5667ad;
    }

    .special-thanks {
      padding-top:48px;
    }

  }


</style>


<script>
export default {

  name:'Info'



}
</script>