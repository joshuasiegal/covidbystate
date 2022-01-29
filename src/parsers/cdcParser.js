export function normalizeCDCData(data) {

  //https://data.cdc.gov/Case-Surveillance/United-States-COVID-19-Cases-and-Deaths-by-State-o/9mfq-cb36
  
  let stateNormedData = {};

  //prefill stateNormedData and stateMetaData for states
  this.states.map(state => {
    stateNormedData[state] = []
    this.stateMetaData[state] = {}
  })

  //manipulate data
  const dataLength = data.length

  //convert date to ms
  data.forEach((d) => {
    d.datems = new Date(d.submission_date).getTime()
  })

  //order by date
  data.sort((a,b) => {
    return (a.datems - b.datems)
  })

  //fill stateNormedData with data per state
  for (let d=0; d<dataLength; d++) {
    let cd = data[d]
    //kludge for CDC weird NYC state abbr
    if (cd.state == 'NYC') {
      cd.state = 'NY'
    }
    cd.new_case = parseInt(cd.new_case, 10)
    if (stateNormedData[cd.state]) {
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
      const posIncrease = currentData.new_case

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
      const posIncrease = currentData.new_case
      
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
    }
  }


  //assign to data
  this.allCovidData = stateNormedData
  this.allCovidData.populated = true

  this.covidDataReady()

  // console.log("CDC Data")
  // console.log(stateNormedData)
  
}