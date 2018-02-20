const PlusPlot = require('../lib/plusplot')
const React = require('react')
const ReactDOM = require('react-dom')

class Utils {
    // Get an integer in the range of min, max, inclusive.
    // From https://stackoverflow.com/a/1527820
  static getRandomInt (min = 1, max = 9) {
    return Math.floor(Math.random() * (max - min + 1)) + min
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
}

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      barChartData: [],
      histogramData: [],
      scatterPlotData: [],
      lineChartData: []
    }
    this.refreshData = this.refreshData.bind(this)
  }

  componentDidMount () {
    this.refreshData()
  }

  refreshData () {
    this.setState({
      barChartData: DataGenerator.generateBarChartData(),
      histogramData: DataGenerator.generateHistogramData(),
      scatterPlotData: DataGenerator.generateScatterPlotData(),
      lineChartData: DataGenerator.generateLineChartData()
    })
  }

  render () {
    const barChartDataForDisplay = this.state.barChartData.map((item, index) => {
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

    const refreshAllDataButton = <button onClick={this.refreshData}>Refresh all data</button>

    return (
      <div>
        <h2>PlusPlot.BarChart {refreshAllDataButton}</h2>
        <PlusPlot.BarChart
          data={this.state.barChartData}
          options={{ axes: { xAxisRotateTickLabels: -15 } }}
        />
        <h3>Data</h3>
        <div className='data'>
          [<br />{barChartDataForDisplay}]
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
