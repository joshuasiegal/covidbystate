<template>
  <div id="footer">

    <div id="footer-left">
      <a href="https://joshuasiegal.org" target="_blank">developer</a>
    </div>

    <div id="footer-middle">
      Special thanks: ♥ L * L ♥
    </div>

    <div id="footer-right">
      <a href="https://github.com/joshuasiegal/covidbystate" target="_blank"><img src="images/GitHub-Mark-32px.png" height="20px"></a>
    </div>

  </div>
</template>

<style scoped lang="scss">

  #footer {
    display:flex;
    height:40px;
    width:100vw;

    div {
      padding:8px;

      &#footer-left {
        flex:25%;
        text-align:left;
      }

      &#footer-middle {
        flex:50%;
        text-align:center;
      }

      &#footer-right {
        flex:25%;
        text-align:right;
        /*opacity:0.4;  for github button */
      }
    }

  }

</style>


<script>
export default {

  name: 'SiteFooter'


}
</script>

