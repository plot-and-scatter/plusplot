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

  static getArrayOfDates (length = 5) {
    const array = []
    for (let i = 0; i < length; i++) {
      array.push(new Date(2018, i, 1))
    }
    return array
  }

  static getArrayOfDateY (length = 5, min = 1, max = 5) {
    const array = []
    const dates = Utils.getArrayOfDates(length)
    for (let i = 0; i < length; i++) {
      array.push({ x: dates[i], y: Utils.getRandomInt(min, max) })
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
    const delAtIndex = Utils.getRandomInt(0, 3)

    let groupedBarChartData = [
      { category: 'BC', values: Utils.getArrayOfRandomInts() },
      { category: 'AB', values: Utils.getArrayOfRandomInts() },
      { category: 'SK', values: Utils.getArrayOfRandomInts() },
      { category: 'MB', values: Utils.getArrayOfRandomInts() },
      { category: 'ON', values: Utils.getArrayOfRandomInts() }
    ]

    groupedBarChartData.splice(delAtIndex, 1)

    return groupedBarChartData
  }

  static generateStackedColumnChartData () {
    const delAtIndex = Utils.getRandomInt(0, 3)

    let stackedColumnChartData = [
      { category: 'BC', apples: Utils.getRandomInt(), bananas: Utils.getRandomInt(), oranges: Utils.getRandomInt() },
      { category: 'AB', apples: Utils.getRandomInt(), bananas: Utils.getRandomInt(), oranges: Utils.getRandomInt() },
      { category: 'SK', apples: Utils.getRandomInt(), bananas: Utils.getRandomInt(), oranges: Utils.getRandomInt() },
      { category: 'MB', apples: Utils.getRandomInt(), bananas: Utils.getRandomInt(), oranges: Utils.getRandomInt() },
      { category: 'ON', apples: Utils.getRandomInt(), bananas: Utils.getRandomInt(), oranges: Utils.getRandomInt() }
    ]

    stackedColumnChartData.splice(delAtIndex, 1)

    return stackedColumnChartData
  }

  static generateBulletBarChartData () {
    const delAtIndex = Utils.getRandomInt(0, 3)

    const bulletBarChartData = [
      {
        category: 'BC',
        count: Utils.getRandomInt(),
        color: '#70ccdb',
        comparators: [
          { value: Utils.getRandomInt(1, 3), color: '#6b747c', showMark: true },
          { value: Utils.getRandomInt(4, 6), color: '#d3e2ef' }
        ]
      },
      {
        category: 'AB',
        count: Utils.getRandomInt(),
        color: '#70ccdb',
        comparators: [
          { value: Utils.getRandomInt(1, 3), color: '#6b747c' },
          { value: Utils.getRandomInt(4, 6), color: '#d3e2ef' }
        ]
      },
      {
        category: 'SK',
        count: Utils.getRandomInt(),
        color: '#70ccdb',
        comparators: [
          { value: Utils.getRandomInt(1, 3), color: '#6b747c' },
          { value: Utils.getRandomInt(4, 6), color: '#d3e2ef' }
        ]
      },
      {
        category: 'MB',
        count: Utils.getRandomInt(),
        color: '#70ccdb',
        comparators: [
          { value: Utils.getRandomInt(1, 3), color: '#6b747c' },
          { value: Utils.getRandomInt(4, 6), color: '#d3e2ef' }
        ]
      },
      {
        category: 'ON',
        count: Utils.getRandomInt(),
        color: '#70ccdb',
        comparators: [
          { value: Utils.getRandomInt(1, 3), color: '#6b747c' },
          { value: Utils.getRandomInt(4, 6), color: '#d3e2ef' }
        ]
      }
    ]

    bulletBarChartData.splice(delAtIndex, 1)

    return bulletBarChartData
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

  static generateLineChartDateData () {
    const lineChartDateData = [
      { color: 'blue', values: Utils.getArrayOfDateY() },
      { color: 'red', values: Utils.getArrayOfDateY() },
      { color: 'green', values: Utils.getArrayOfDateY() }
    ]
    return lineChartDateData
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
      bulletBarChartData: [],
      barChartData: [],
      groupedBarChartData: [],
      stackedColumnChartData: [],
      histogramData: [],
      scatterPlotData: [],
      lineChartData: [],
      lineChartDateData: [],
      slopeGraphData: []
    }
    this.refreshData = this.refreshData.bind(this)
  }

  componentDidMount () {
    this.refreshData()
  }

  refreshData () {
    this.setState({
      bulletBarChartData: DataGenerator.generateBulletBarChartData(),
      barChartData: DataGenerator.generateBarChartData(),
      groupedBarChartData: DataGenerator.generateGroupedBarChartData(),
      stackedColumnChartData: DataGenerator.generateStackedColumnChartData(),
      histogramData: DataGenerator.generateHistogramData(),
      scatterPlotData: DataGenerator.generateScatterPlotData(),
      lineChartData: DataGenerator.generateLineChartData(),
      lineChartDateData: DataGenerator.generateLineChartDateData(),
      slopeGraphData: DataGenerator.generateSlopeGraphData()
    })
  }

  render () {
    const barChartDataForDisplay = this.state.barChartData.map((item, index) => {
      return (
        <span key={index}>&nbsp;&nbsp;{JSON.stringify(item, null, 1)}<br /></span>
      )
    })

    const bulletBarChartDataForDisplay = this.state.bulletBarChartData.map((item, index) => {
      return (
        <span key={index}>&nbsp;&nbsp;{JSON.stringify(item, null, 1)}<br /></span>
      )
    })

    const groupedBarChartDataForDisplay = this.state.groupedBarChartData.map((item, index) => {
      return (
        <span key={index}>&nbsp;&nbsp;{JSON.stringify(item, null, 1)}<br /></span>
      )
    })

    const stackedColumnChartDataForDisplay = this.state.stackedColumnChartData.map((item, index) => {
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

    const lineChartDateDataForDisplay = this.state.lineChartDateData.map((item, index) => {
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
        {/* <h2>PlusPlot.BulletBarChart {refreshAllDataButton}</h2>
        <PlusPlot.BulletBarChart
          data={this.state.bulletBarChartData}
          options={{
            dataLabels: {
              position: -20,
              color: '#fff',
              bulletLabelColor: '#333',
              formatter: (d) => '$' + d
            },
            height: 400,
            axes: { xAxisRotateTickLabels: -15 }
          }}
          xLines={[]}
        />
        <h3>Data</h3>
        <div className='data'>
          [<br />{bulletBarChartDataForDisplay}]
        </div>

        <h2>PlusPlot.ColumnChart {refreshAllDataButton}</h2>
        <PlusPlot.ColumnChart
          data={this.state.barChartData}
          options={{
            dataLabels: {
              position: 20,
              color: '#ffffff',
              formatter: (d) => '$' + d
            },
            margins: { right: 50 },
            axes: { xAxisRotateTickLabels: -15 }
          }}
          yLines={[{ value: 5, label: 'Now', color: 'grey' }]}
        />
        <h3>Data</h3>
        <div className='data'>
          [<br />{barChartDataForDisplay}]
        </div>

        <h2>PlusPlot.BarChart {refreshAllDataButton}</h2>
        <PlusPlot.BarChart
          data={this.state.barChartData}
          options={{
            dataLabels: {
              position: -20,
              color: '#ffffff',
              formatter: (d) => '$' + d
            },
            margins: { left: 100 }
          }}
          xLines={[{ value: 5, label: 'Now', color: 'grey' }]}
        />
        <h3>Data</h3>
        <div className='data'>
          [<br />{barChartDataForDisplay}]
        </div> */}

        <h2>PlusPlot.StackedColumnChart {refreshAllDataButton}</h2>
        <PlusPlot.StackedColumnChart
          data={this.state.stackedColumnChartData}
          stackKeys={['apples', 'bananas', 'oranges']}
          colors={['#1b9194', '#1b6c94', '#1b4e94']}
          options={{
            dataLabels: {
              position: 20,
              color: '#fff',
              formatter: (d) => '$' + d
            },
            axes: { xAxisRotateTickLabels: -15 }
          }}
        />
        <h3>Data</h3>
        <div className='data'>
          [<br />{stackedColumnChartDataForDisplay}]
        </div>

        <h2>PlusPlot.GroupedColumnChart {refreshAllDataButton}</h2>
        <PlusPlot.GroupedColumnChart
          data={this.state.groupedBarChartData}
          colors={['red', 'blue']}
          options={{
            dataLabels: {
              position: 20,
              color: '#fff',
              formatter: (d) => '$' + d
            },
            axes: { xAxisRotateTickLabels: -15 }
          }}
        />
        <h3>Data</h3>
        <div className='data'>
          [<br />{groupedBarChartDataForDisplay}]
        </div>

        <h2>PlusPlot.GroupedBarChart {refreshAllDataButton}</h2>
        <PlusPlot.GroupedBarChart
          data={this.state.groupedBarChartData}
          colors={['red', 'blue']}
          options={{
            dataLabels: {
              position: -20,
              color: '#fff',
              formatter: (d) => '$' + d
            },
            height: 800,
            axes: { xAxisRotateTickLabels: -15 }
          }}
        />
        <h3>Data</h3>
        <div className='data'>
          [<br />{groupedBarChartDataForDisplay}]
        </div>

        {/* <h2>PlusPlot.Histogram {refreshAllDataButton}</h2>
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

        <h2>PlusPlot.LineChart (Dates) {refreshAllDataButton}</h2>
        <PlusPlot.LineChart
          data={this.state.lineChartDateData}
          dates={Utils.getArrayOfDates()}
        />
        <h3>Data</h3>
        <div className='data'>
          [<br />{lineChartDateDataForDisplay}]
        </div> */}
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
