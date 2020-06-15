<template>
  <div id="header">

    <div id="header-left">
      &nbsp;
    </div>

    <div id="header-middle">
      &nbsp;
    </div>

    <div id="header-right">
      <a href="https://twitter.com/joshuasiegal?ref_src=twsrc%5Etfw" class="twitter-follow-button" data-show-screen-name="false" data-show-count="false"></a>
    </div>

  </div>
</template>

<style scoped lang="scss">

  #header {
    display:flex;
    height:32px;
    width:100vw;

    div {
      flex:33%;
      padding:6px;

      &#header-left {
        text-align:left;
      }

      &#header-middle {
        text-align:center;
      }

      &#header-right {
        text-align:right;
        opacity:0.4; /* for twitter button iframe */
      }
    }

  }


</style>


<script>
export default {
  name: 'SiteHeader'




}
</script>