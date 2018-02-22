const PlusPlot = require('../lib/plusplot')
const React = require('react')
const ReactDOM = require('react-dom')

class Utils {
    // Get an integer in the range of min, max, inclusive.
    // From https://stackoverflow.com/a/1527820
  static getRandomInt (min = 1, max = 9) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  static getArrayOfRandomInts (length = 5, min = 1, max = 9) {
    const array = []
    for (let i = 0; i < length; i++) { array.push(Utils.getRandomInt(min, max)) }
    return array
  }

  static getRandomXY (min = 1, max = 5) {
    return { x: Utils.getRandomInt(min, max), y: Utils.getRandomInt(min, max) }
  }

  static getArrayOfRandomXY (length = 5, min = 1, max = 5) {
    const array = []
    for (let i = 0; i < length; i++) { array.push(Utils.getRandomXY(min, max)) }
    return array
  }

  static getArrayOfLinearY (length = 5, min = 1, max = 5) {
    const array = []
    for (let i = 0; i < length; i++) {
      array.push({ x: i, y: Utils.getRandomInt(min, max) })
    }
    return array
  }
}

class DataGenerator {
  static generateBarChartData () {
    const barChartData = [
      { category: 'Apples', count: Utils.getRandomInt(), color: 'rgba(0, 150, 0, 0.5)' },
      { category: 'Bananas', count: Utils.getRandomInt(), color: '#fe0' },
      { category: 'Oranges', count: Utils.getRandomInt(), color: 'orange' },
      { category: 'Raspberries', count: Utils.getRandomInt(), color: '#e25098' },
      { category: 'Strawberries', count: Utils.getRandomInt(), color: 'rgb(255, 0, 0)' },
      { category: 'Watermelons', count: Utils.getRandomInt(), color: 'green' }
    ]
    return barChartData
  }

  static generateGroupedBarChartData () {
    const groupedBarChartData = [
      { category: 'BC', values: Utils.getArrayOfRandomInts() },
      { category: 'AB', values: Utils.getArrayOfRandomInts() },
      { category: 'SK', values: Utils.getArrayOfRandomInts() },
      { category: 'MB', values: Utils.getArrayOfRandomInts() },
      { category: 'ON', values: Utils.getArrayOfRandomInts() }
    ]
    return groupedBarChartData
  }

  static generateHistogramData () {
    let histogramData = []
    for (let i = 0; i < 100; i++) { histogramData.push(Utils.getRandomInt(1, 9)) }
    histogramData = PlusPlot.Histogram.defaultBinning(histogramData)
    histogramData.color = '#fc0'
    return histogramData
  }

  static generateScatterPlotData () {
    const scatterPlotData = Utils.getArrayOfRandomXY(20, 1, 9)
    return scatterPlotData
  }

  static generateLineChartData () {
    const lineChartData = [
      { color: 'blue', values: Utils.getArrayOfLinearY() },
      { color: 'red', values: Utils.getArrayOfLinearY() },
      { color: 'green', values: Utils.getArrayOfLinearY() }
    ]
    return lineChartData
  }

  static generateSlopeGraphData () {
    const slopeGraphData = [
      { category: 'China', values: Utils.getArrayOfRandomInts(2, 0, 2000) },
      { category: 'India', values: Utils.getArrayOfRandomInts(2, 0, 2000) },
      { category: 'United States', values: Utils.getArrayOfRandomInts(2, 0, 2000) },
      { category: 'Indonesia', values: Utils.getArrayOfRandomInts(2, 0, 2000) },
      { category: 'Brazil', values: Utils.getArrayOfRandomInts(2, 0, 2000) }
    ]
    return slopeGraphData
  }
}

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      barChartData: [],
      groupedBarChartData: [],
      histogramData: [],
      scatterPlotData: [],
      lineChartData: [],
      slopeGraphData: []
    }
    this.refreshData = this.refreshData.bind(this)
  }

  componentDidMount () {
    this.refreshData()
  }

  refreshData () {
    this.setState({
      barChartData: DataGenerator.generateBarChartData(),
      groupedBarChartData: DataGenerator.generateGroupedBarChartData(),
      histogramData: DataGenerator.generateHistogramData(),
      scatterPlotData: DataGenerator.generateScatterPlotData(),
      lineChartData: DataGenerator.generateLineChartData(),
      slopeGraphData: DataGenerator.generateSlopeGraphData()
    })
  }

  render () {
    const barChartDataForDisplay = this.state.barChartData.map((item, index) => {
      return (
        <span key={index}>&nbsp;&nbsp;{JSON.stringify(item, null, 1)}<br /></span>
      )
    })

    const groupedBarChartDataForDisplay = this.state.groupedBarChartData.map((item, index) => {
      return (
        <span key={index}>&nbsp;&nbsp;{JSON.stringify(item, null, 1)}<br /></span>
      )
    })

    const histogramDataForDisplay = this.state.histogramData.map((item, index) => {
      return (
        <span key={index}>
          &nbsp;&nbsp;
          <i>x0</i>: {item.x0.toFixed(1)}&nbsp;&nbsp;
          <i>x1</i>: {item.x1.toFixed(1)}&nbsp;
          &nbsp;&nbsp;
          {JSON.stringify(item.sort(), null, 1)}
          <br />
        </span>
      )
    })

    const scatterPlotDataForDisplay = this.state.scatterPlotData.map((item, index) => {
      return (
        <span key={index}>&nbsp;&nbsp;{JSON.stringify(item, null, 1)}<br /></span>
      )
    })

    const lineChartDataForDisplay = this.state.lineChartData.map((item, index) => {
      return (
        <span key={index}>&nbsp;&nbsp;{JSON.stringify(item, null, 1)}<br /></span>
      )
    })

    const slopeGraphDataForDisplay = this.state.slopeGraphData.map((item, index) => {
      return (
        <span key={index}>&nbsp;&nbsp;{JSON.stringify(item, null, 1)}<br /></span>
      )
    })

    const refreshAllDataButton = <button onClick={this.refreshData}>Refresh all data</button>

    return (
      <div>
        <h2>PlusPlot.BarChart {refreshAllDataButton}</h2>
        <PlusPlot.BarChart
          data={this.state.barChartData}
          options={{ margins: { right: 50 }, axes: { xAxisRotateTickLabels: -15 } }}
          yLines={[{ value: 3, label: 'Now', color: 'grey' }]}
        />
        <h3>Data</h3>
        <div className='data'>
          [<br />{barChartDataForDisplay}]
        </div>

        <h2>PlusPlot.GroupedBarChart {refreshAllDataButton}</h2>
        <PlusPlot.GroupedBarChart
          data={this.state.groupedBarChartData}
          colors={['red', 'blue']}
          options={{ axes: { xAxisRotateTickLabels: -15 } }}
        />
        <h3>Data</h3>
        <div className='data'>
          [<br />{groupedBarChartDataForDisplay}]
        </div>

        <h2>PlusPlot.Histogram {refreshAllDataButton}</h2>
        <PlusPlot.Histogram data={this.state.histogramData} />
        <h3>Data</h3>
        <div className='data'>
          [<br />{histogramDataForDisplay}]
        </div>

        <h2>PlusPlot.ScatterPlot {refreshAllDataButton}</h2>
        <PlusPlot.ScatterPlot data={this.state.scatterPlotData} />
        <h3>Data</h3>
        <div className='data'>
          [<br />{scatterPlotDataForDisplay}]
        </div>

        <h2>PlusPlot.SlopeGraph {refreshAllDataButton}</h2>
        <PlusPlot.SlopeGraph
          data={this.state.slopeGraphData}
          labels={['2005', '2015']}
          options={{ margins: { top: 10, left: 125, bottom: 10, right: 125 } }}
        />
        <h3>Data</h3>
        <div className='data'>
          [<br />{slopeGraphDataForDisplay}]
        </div>

        <h2>PlusPlot.LineChart {refreshAllDataButton}</h2>
        <PlusPlot.LineChart data={this.state.lineChartData} />
        <h3>Data</h3>
        <div className='data'>
          [<br />{lineChartDataForDisplay}]
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
