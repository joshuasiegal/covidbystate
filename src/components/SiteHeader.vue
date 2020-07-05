<template>
  <div id="header">
    <div id="brow">
      <div id="header-left">
        <a href="https://twitter.com/joshuasiegal?ref_src=twsrc%5Etfw" class="twitter-follow-button" data-show-screen-name="false" data-show-count="false"></a>
      </div>

      <div id="header-middle">
        &nbsp;
      </div>

      <div id="header-right">
        <iframe src="https://www.facebook.com/plugins/share_button.php?href=https%3A%2F%2Fcovidbystate.org&layout=button&size=small&width=67&height=20" width="67" height="20" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allow="encrypted-media"></iframe>
        &nbsp;<a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-show-count="false">Tweet</a>
      </div>
    </div>

    <!-- for seo -->
    <h1 style="display:none;">Compare Covid By State</h1>
    
    <h2>Compare Covid By State</h2>

  </div>
</template>

<style scoped lang="scss">

  h2 {
    font-size:24pt;
  }

  #brow {
    display:flex;
    height:32px;
    width:100vw;

    div {
      flex:33%;
      padding:6px;

      &#header-left {
        text-align:left;
        opacity:0.4;
      }

      &#header-middle {
        text-align:center;
      }

      &#header-right {
        text-align:right;
        opacity:0.4;
      }
    }

  }

  @media (min-width: 320px) and (max-width: 1000px) {

    h2 {
      font-size:20pt;
    }

    #brow {
      height:48px;
    }

    #brow div {
      flex:45%;
    }

    #brow div#header-middle {
      flex:10%;
    }

  }



</style>


<script>
export default {
  name: 'SiteHeader'




}
</script>