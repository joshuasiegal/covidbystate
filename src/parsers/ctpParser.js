export function normalizeCTPData(data) {

  let stateNormedData = {};

  //prefill stateNormedData and stateMetaData for states
  this.states.map(state => {
    stateNormedData[state] = []
    this.stateMetaData[state] = {}
  })


  //manipulate data
  const dataLength = data.length
  
  //fill stateNormedData with data per state
  //reverse b/c COVID-19 Tracker data is chornologically backwards
  for (let d=dataLength-1; d>=0; d--) {
    let cd = data[d]
    if (cd.date > 20200301) {
      stateNormedData[cd.state].push(cd)
    }
  }

  //make high points
  for (let state in stateNormedData) {
    const theStateData = stateNormedData[state]
    const theStateDataLength = theStateData.length
    const stateMeta = this.stateMetaData[state]
    stateMeta.highPoint = 0

    for (let hp=0; hp<theStateDataLength; hp++) {
      const currentData = theStateData[hp]
      const currentHighPoint = stateMeta.highPoint
      const posIncrease = currentData.positiveIncrease

      if (posIncrease > currentHighPoint) {
        stateMeta.highPoint = posIncrease
      }
    }
  }


  const rollingAvgSize = this.rollingAvgSize

  // normalize and format state-level data
  for (let state in stateNormedData) {
    const theStateData = stateNormedData[state]
    const theStateDataLength = theStateData.length
    const stateMeta = this.stateMetaData[state]
    const theStateChartData = this.stateChartData[state]

    const avgBuffer = []
    const normAvgBuffer = []
    
    for (let hp=0; hp<theStateDataLength; hp++) {
      const currentData = theStateData[hp]
      const posIncrease = currentData.positiveIncrease
      
      //normalize
      const percHighPoint = Math.round((posIncrease / stateMeta.highPoint) * 100)
      currentData.percentOfHighPoint = percHighPoint

      //normalized avg
      normAvgBuffer.push(percHighPoint)
      if (normAvgBuffer.length > rollingAvgSize) {
        normAvgBuffer.shift()
      }
      const normSumBuffer = normAvgBuffer.reduce((acc, cur) => acc + cur)
      currentData.normRollingAverage = Math.round(normSumBuffer / rollingAvgSize)

      //date
      const curDateString = currentData.date.toString()
      const curDateFormatted = curDateString.slice(0,4) + "-" + curDateString.slice(4,6) + "-" + curDateString.slice(6,8)
      //TODO: improve this - gotta be super slow
      // -- Can highcharts take just a different format?
      // -- contacted Covid Tracking Project about this - see API v2?
      currentData.datems = new Date(curDateFormatted).getTime()
    }
  }

  console.log("CTP DATA")
  console.log(stateNormedData)

  //assign to data
  this.allCovidData = stateNormedData
  this.allCovidData.populated = true

  this.covidDataReady()

}