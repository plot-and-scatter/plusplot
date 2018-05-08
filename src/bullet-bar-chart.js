import AbstractPlot from './abstract-plot'
import PropTypes from 'prop-types'
import * as d3 from 'd3'

/**
 * @class
 * @extends AbstractPlot
 *
 * Expects props.data to be an array of objects. Each object has a `category`
 * property and a `count` property. The value of the `category` property is the
 * name of a category or grouping; the value of the `value` property is the
 * count of that category. The keys will appear on the x-axis, while the y-axis
 * will show the corresponding values.
 *
 * e.g. `[{ category: 'A', count: 10}, { category: 'B', count: 15}]`
 *
 */
class BulletBarChart extends AbstractPlot {
  constructor (props) {
    super(props)
    this.setBarSizes = this.setBarSizes.bind(this)
    this.setInitialBarSizes = this.setInitialBarSizes.bind(this)
    this.setBulletBarSizes = this.setBulletBarSizes.bind(this)
    this.setInitialBulletBarSizes = this.setInitialBulletBarSizes.bind(this)
    this.setDataLabels = this.setDataLabels.bind(this)
    this.setInitialDataLabels = this.setInitialDataLabels.bind(this)
    this.setXLines = this.setXLines.bind(this)
    this.setXLineLabels = this.setXLineLabels.bind(this)
    this.getXOrigin = this.getXOrigin.bind(this)
  }

  initialSetup () {
    super.initialSetup()
  }

  getYScale () {
    const minRange = 0
    const maxRange = this.height
    const domain = this.props.data.map(d => d.category)
    return d3.scaleBand()
      .range([minRange, maxRange])
      .domain(domain)
      .padding(0.7)
  }

  getXOrigin () {
    return 0
  }

  getXScale () {
    const minRange = 0
    const maxRange = Math.max(this.width, 1)
    const minDomain = this.getXOrigin()
    const maxDomain = d3.max(this.props.data.map(d =>
      Math.max(d.count, d3.max(d.comparators.map(c => c.value))))
    )
    console.log('maxDomain', maxDomain)
    return d3.scaleLinear()
      .range([minRange, maxRange])
      .domain([minDomain, maxDomain])
      .nice()
  }

  setBarSizes (bars) {
    const colorCategoryScale = d3.scaleOrdinal(d3.schemeCategory20)
    bars.attr('y', d => this.getYScale()(d.category))
      .attr('x', 1)
      .attr('height', this.getYScale().bandwidth())
      .attr('width', d => this.getXScale()(d.count))
      .attr('fill', (d, i) => d.color || colorCategoryScale(i))
  }

  // When we initially set the bar locations, we want the x-values to be
  // correct, but not the y-values -- that way we can animate the height of the
  // bar changing
  setInitialBarSizes (bars) {
    const colorCategoryScale = d3.scaleOrdinal(d3.schemeCategory20)
    bars.attr('y', d => this.getYScale()(d.category))
      .attr('x', 0)
      .attr('height', this.getYScale().bandwidth())
      .attr('width', 0)
      .attr('fill', (d, i) => d.color || colorCategoryScale(i))
  }

  setBulletBarSizes (bars) {
    const colorCategoryScale = d3.scaleOrdinal(d3.schemeCategory20)
    bars
      .attr('y', d => this.getYScale()(d.category) - this.getYScale().bandwidth() * 0.5)
      .attr('x', 1)
      .attr('height', this.getYScale().bandwidth() * 2)
      .attr('width', d => this.getXScale()(d.value))
      .attr('fill', (d, i) => d.color || colorCategoryScale(i))
  }

  setInitialBulletBarSizes (bars) {
    const colorCategoryScale = d3.scaleOrdinal(d3.schemeCategory20)
    bars
      .attr('y', d => this.getYScale()(d.category) - this.getYScale().bandwidth() * 0.5)
      .attr('x', 0)
      .attr('height', this.getYScale().bandwidth() * 2)
      .attr('width', 0)
      .attr('fill', (d, i) => d.color || colorCategoryScale(i))
  }

  setDataLabels (dataLabels) {
    const positionAdjustment = this.dataLabels.position || 0
    dataLabels
      .attr('y', d => this.getYScale()(d.category) + 0.5 * this.getYScale().bandwidth())
      .attr('x', d => this.getXScale()(d.count) + positionAdjustment)
      .text(d => this.dataLabels.formatter ? this.dataLabels.formatter(d.count) : d.count)
      .style('font-family', this.font)
      .style('text-anchor', 'middle')
      .style('alignment-baseline', 'middle')
      .style('fill', this.dataLabels.color)
  }

  setInitialDataLabels (dataLabels) {
    dataLabels
      .attr('y', d => this.getYScale()(d.category) + 0.5 * this.getYScale().bandwidth())
      .attr('x', 0)
      .style('font-family', this.font)
      .style('text-anchor', 'middle')
      .style('alignment-baseline', 'middle')
      .style('fill', this.dataLabels.color)
  }

  setXLines (xLines) {
    xLines
      .attr('y', 0)
      .attr('x', d => this.getXScale()(d.value))
      .attr('height', this.height)
      .attr('width', d => d.width || 1)
      .attr('fill', d => d.color)
  }

  setXLineLabels (xLineLabels) {
    xLineLabels
      .attr('y', 10)
      .attr('x', d => this.getXScale()(d.value) + 5)
      .attr('height', this.height)
      .attr('width', d => d.width || 1)
      .attr('fill', d => d.color)
      .style('font-family', this.font)
      .style('text-anchor', 'start')
      .style('alignment-baseline', 'middle')
      .text(d => d.label)
  }

  updateVizComponents (duration = 500) {
    super.updateVizComponents(duration)
    this.svg.selectAll('.xLine').transition().duration(duration).call(this.setXLines)
    this.svg.selectAll('.xLineLabel').transition().duration(duration).call(this.setXLineLabels)
    if (this.state.initialUpdate) {
      // Initial update? No animation
      this.svg.selectAll('.bulletBar').call(this.setInitialBulletBarSizes)
      this.svg.selectAll('.bar').call(this.setInitialBarSizes)
      this.svg.selectAll('.dataLabel').call(this.setInitialDataLabels)
      // The next line will, conveniently, re-trigger updateVizComponents(),
      // which in turn will actually animate the height of the bars.
      this.setState({ initialUpdate: false })
    }
    this.svg.selectAll('.bulletBar').transition().duration(duration).call(this.setBulletBarSizes)
    this.svg.selectAll('.bar').transition().duration(duration).call(this.setBarSizes)
    this.svg.selectAll('.dataLabel').transition().duration(duration).call(this.setDataLabels)
  }

  updateGraphicContents () {
    // Sort comparator values from high to low so they can cover each other
    this.props.data.forEach(d => {
      d.comparators.sort((a, b) => a.value < b.value ? 1 : a.value > b.value ? -1 : 0)
    })

    console.log('comparators post-sort', this.props.data)

    const comparators = []

    this.props.data.forEach(d => {
      d.comparators.forEach(c => {
        comparators.push({ category: d.category, value: c.value, color: c.color })
      })
    })

    console.log('comparators', comparators)

    const bulletBars = this.wrapper.selectAll('.bulletBar')
      .data(comparators, d => `${d.category}-${d.color}`)
    bulletBars.enter().append('rect')
      .attr('class', 'bulletBar')
    bulletBars.exit().remove()

    const bars = this.wrapper.selectAll('.bar')
      .data(this.props.data, d => d.category)
    bars.enter().append('rect')
      .attr('class', 'bar')
    bars.exit().remove()

    if (this.dataLabels) {
      const dataLabels = this.wrapper.selectAll('.dataLabel')
        .data(this.props.data, d => d.category)
      dataLabels.enter().append('text')
        .attr('class', 'dataLabel')
      dataLabels.exit().remove()
    }

    const xLines = this.wrapper.selectAll('.xLine')
      .data(this.props.xLines)
    xLines.enter().append('rect')
      .attr('class', 'xLine')
    xLines.exit().remove()

    const xLineLabels = this.wrapper.selectAll('.xLineLabel')
      .data(this.props.xLines)
    xLineLabels.enter().append('text')
      .attr('class', 'xLineLabel')
    xLineLabels.exit().remove()

    this.updateVizComponents()
  }

  render () {
    return super.render()
  }
}

BulletBarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    category: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    count: PropTypes.number.isRequired,
    color: PropTypes.string
  })).isRequired
}

module.exports = BulletBarChart
