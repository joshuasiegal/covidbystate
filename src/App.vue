<template>
  <div id="app">
    <router-view/>

    <!--
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    -->

  </div>
</template>

<style lang="scss">

  * {
    margin:0;
    padding:0;
    box-sizing:border-box;
  }

  body {
    background:#D7D9E0;
  }

  p {
    margin-bottom:36px;
  }

  a,
  a:hover,
  a:visited,
  a:active {
    color:#2c3e50;
    text-decoration: none;
  }

  button {
    font-size:10pt;
    border:0px solid grey;
    padding:4px 8px;
    border-radius:4px;
    cursor:pointer;
    box-shadow:0px 1px 1px 1px #DEDEDE;
    background-color:#F0F0F0;

    &.disabled {
      color:#919191;
      cursor:not-allowed;
    }
  }

  select {
    font-size:10pt;
    border:0px solid grey;
    padding:8px 16px 8px 8px;
    border-radius:4px;
    cursor:pointer;
    box-shadow:0px 1px 1px 1px #DEDEDE;
    background-color:#F0F0F0;
    background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23969EBA%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E');
    background-repeat: no-repeat, repeat;
    background-position: right .7em top 50%, 0 0;
    background-size: .65em auto, 100%;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;

    option {
      background-color:#F0F0F0;
      font-weight:normal;
      padding:8px;
    }
  }

  button:focus { outline:0; }
  select:focus { outline:0; }

  @keyframes fadeInAndRiseOut {
    0% {
      opacity: 0;
      top:0px;
    }
    50% {
      opacity: 0.7;
      top:-20px;
    }
    100% {
      opacity: 0;
      top:-40px;
    }
  }


  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

</style>
