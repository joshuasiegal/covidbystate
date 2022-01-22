export function normalizeActNowData(data) {
  let stateNormedData = {};

  //prefill stateNormedData and stateMetaData for states
  this.states.map(state => {
    stateNormedData[state] = []
    this.stateMetaData[state] = {}
  })

  //manipulate data
  const dataLength = data.length

  //fill stateNormedData with data per state
  for (let d=0; d<dataLength; d++) {
    let cd = data[d]
    let timeSeries = cd.actualsTimeseries

    if (stateNormedData[cd.state]) {
      stateNormedData[cd.state] = timeSeries
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
      const posIncrease = currentData.newCases || 0

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
      const posIncrease = currentData.newCases || 0
      
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
      currentData.datems = new Date(currentData.date).getTime()
    }
  }


  //assign to data
  this.allCovidData = stateNormedData
  this.allCovidData.populated = true

  this.covidDataReady()

  // console.log("ActNow Data")
  // console.log(stateNormedData)
}