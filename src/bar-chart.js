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
class BarChart extends AbstractPlot {
  constructor (props) {
    super(props)
    this.setBarSizes = this.setBarSizes.bind(this)
    this.setInitialBarSizes = this.setInitialBarSizes.bind(this)
    this.setDataLabels = this.setDataLabels.bind(this)
    this.setInitialDataLabels = this.setInitialDataLabels.bind(this)
    this.setXLines = this.setXLines.bind(this)
    this.setXLineLabels = this.setXLineLabels.bind(this)
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
      .padding(0.2)
  }

  getXScale () {
    const minRange = 0
    const maxRange = Math.max(this.width, 1)
    const minDomain = 0
    const maxDomain = d3.max(this.props.data.map(d => d.count))
    return d3.scaleLinear()
      .range([minRange, maxRange])
      .domain([minDomain, maxDomain])
      .nice()
  }

  setBarSizes (bars) {
    const colorCategoryScale = d3.scaleOrdinal(d3.schemeCategory20)
    bars
      .attr('y', d => this.getYScale()(d.category))
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
    bars
      .attr('y', d => this.getYScale()(d.category))
      .attr('x', 1)
      .attr('height', this.getYScale().bandwidth())
      .attr('width', 0)
      .attr('fill', (d, i) => d.color || colorCategoryScale(i))
  }

  setExitingBarSizes (bars) {
    bars.attr('width', 0)
  }

  setExitingDataLabels (bars) {
    bars.attr('x', 0)
  }

  setDataLabels (dataLabels) {
    const positionAdjustment = this.dataLabels.position || 0
    dataLabels
      .attr('y', d => this.getYScale()(d.category) + 0.5 * this.getYScale().bandwidth())
      .attr('x', d => this.getXScale()(d.count) + positionAdjustment)
      .text(d => this.dataLabels.formatter ? this.dataLabels.formatter(d.count) : d.count)
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

  updateGraphicContents () {
    const DURATION = 300

    // Link data
    const bars = this.wrapper.selectAll('.bar')
      .data(this.props.data, d => d.category)

    const dataLabels = this.wrapper.selectAll('.dataLabel')
      .data(this.props.data, d => d.category)

    // Exit
    bars.exit()
      .transition().duration(DURATION).on('end', () => bars.exit().remove())
        .call(this.setExitingBarSizes)

    dataLabels.exit()
      .transition().duration(DURATION).on('end', () => dataLabels.exit().remove())
        .call(this.setExitingDataLabels)

    console.log('bars.exit()', bars.exit(), bars.exit().size())

    const delay = bars.exit().size() ? DURATION : 0

    bars.enter().append('rect')
      .attr('class', 'bar')
      .call(this.setInitialBarSizes)
      .transition().delay(delay).duration(DURATION)
        .call(this.setBarSizes)

    dataLabels.enter().append('text')
      .attr('class', 'dataLabel')
      .call(this.setInitialDataLabels)
      .transition().delay(delay).duration(DURATION)
        .call(this.setDataLabels)

    bars
      .transition().delay(delay).duration(DURATION)
        .call(this.setBarSizes)

    dataLabels
      .transition().delay(delay).duration(DURATION)
        .call(this.setDataLabels)

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

    this.updateVizComponents(DURATION, delay)
  }

  render () {
    return super.render()
  }
}

BarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    category: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    count: PropTypes.number.isRequired,
    color: PropTypes.string
  })).isRequired
}

module.exports = BarChart
