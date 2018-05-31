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
class ColumnChart extends AbstractPlot {
  constructor (props) {
    super(props)
    this.setBarSizes = this.setBarSizes.bind(this)
    this.setInitialBarSizes = this.setInitialBarSizes.bind(this)
    this.setDataLabels = this.setDataLabels.bind(this)
    this.setInitialDataLabels = this.setInitialDataLabels.bind(this)
    this.setYLines = this.setYLines.bind(this)
    this.setYLineLabels = this.setYLineLabels.bind(this)
    this.setExitingBarSizes = this.setExitingBarSizes.bind(this)
  }

  initialSetup () {
    super.initialSetup()
  }

  getXScale () {
    const minRange = 0
    const maxRange = this.width
    const domain = this.props.data.map(d => d.category)
    return d3.scaleBand()
      .range([minRange, maxRange])
      .domain(domain)
      .padding(0.2)
  }

  getYScale () {
    const minRange = 0
    const maxRange = this.height
    const minDomain = 0
    const maxDomain = d3.max(this.props.data.map(d => d.count))
    return d3.scaleLinear()
      .range([maxRange, minRange]) // Yes, we need to swap these
      .domain([minDomain, maxDomain])
      .nice()
  }

  setBarSizes (bars) {
    const colorCategoryScale = d3.scaleOrdinal(d3.schemeCategory20)
    bars
      .attr('x', d => this.getXScale()(d.category))
      .attr('y', d => this.getYScale()(d.count))
      .attr('width', this.getXScale().bandwidth())
      .attr('height', d => this.height - this.getYScale()(d.count))
      .attr('fill', (d, i) => d.color || colorCategoryScale(i))
  }

  setInitialBarSizes (bars) {
    const colorCategoryScale = d3.scaleOrdinal(d3.schemeCategory20)
    bars
      .attr('x', d => this.getXScale()(d.category))
      .attr('y', this.height)
      .attr('width', this.getXScale().bandwidth())
      .attr('height', 0)
      .attr('fill', (d, i) => d.color || colorCategoryScale(i))
  }

  setExitingBarSizes (bars) {
    bars.attr('height', 0)
    bars.attr('y', this.height)
  }

  setExitingDataLabels (bars) {
    bars.attr('y', 0)
  }

  setDataLabels (dataLabels) {
    const positionAdjustment = this.dataLabels.position || 0
    dataLabels
      .attr('x', d => this.getXScale()(d.category) + 0.5 * this.getXScale().bandwidth())
      .attr('y', d => this.getYScale()(d.count) + positionAdjustment)
      .style('font-family', this.font)
      .style('text-anchor', 'middle')
      .style('alignment-baseline', 'middle')
      .style('fill', this.dataLabels.color)
      .text(d => this.dataLabels.formatter ? this.dataLabels.formatter(d.count) : d.count)
  }

  setInitialDataLabels (dataLabels) {
    dataLabels
      .attr('x', d => this.getXScale()(d.category) + 0.5 * this.getXScale().bandwidth())
      .attr('y', this.height)
      .style('font-family', this.font)
      .style('text-anchor', 'middle')
      .style('alignment-baseline', 'middle')
      .style('fill', this.dataLabels.color)
  }

  setYLines (yLines) {
    yLines
      .attr('x', 0)
      .attr('y', d => this.getYScale()(d.value))
      .attr('width', this.width)
      .attr('height', d => d.height || 1)
      .attr('fill', d => d.color)
  }

  setYLineLabels (yLineLabels) {
    yLineLabels
      .attr('x', this.width + 5)
      .attr('y', d => this.getYScale()(d.value))
      .attr('width', this.width)
      .attr('height', d => d.height || 1)
      .attr('fill', d => d.color)
      .style('font-family', this.font)
      .style('text-anchor', 'start')
      .style('alignment-baseline', 'middle')
      .text(d => d.label)
  }

  updateVizComponents (duration = 500, delay = 0) {
    super.updateVizComponents(duration, delay)
    this.svg.selectAll('.yLine')
      .transition(this.transitionID()).duration(duration).delay(delay).call(this.setYLines)
    this.svg.selectAll('.yLineLabel')
      .transition(this.transitionID()).duration(duration).delay(delay).call(this.setYLineLabels)
    this.svg.selectAll('.bar')
      .transition(this.transitionID()).duration(duration).delay(delay).call(this.setBarSizes)
    this.svg.selectAll('.dataLabel')
      .transition(this.transitionID()).duration(duration).delay(delay).call(this.setDataLabels)
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
      .transition(this.transitionID()).duration(DURATION).on('end', () => bars.exit().remove())
        .call(this.setExitingBarSizes)

    dataLabels.exit()
      .transition(this.transitionID()).duration(DURATION).on('end', () => dataLabels.exit().remove())
        .call(this.setExitingDataLabels)

    console.log('bars.exit()', bars.exit(), bars.exit().size())

    const delay = bars.exit().size() ? DURATION : 0

    bars.enter().append('rect')
      .attr('class', 'bar')
      .call(this.setInitialBarSizes)
      .transition(this.transitionID()).delay(delay).duration(DURATION)
        .call(this.setBarSizes)

    dataLabels.enter().append('text')
      .attr('class', 'dataLabel')
      .call(this.setInitialDataLabels)
      .transition(this.transitionID()).delay(delay).duration(DURATION)
        .call(this.setDataLabels)

    bars
      .transition(this.transitionID()).delay(delay).duration(DURATION)
        .call(this.setBarSizes)

    dataLabels
      .transition(this.transitionID()).delay(delay).duration(DURATION)
        .call(this.setDataLabels)

    const yLines = this.wrapper.selectAll('.yLine')
      .data(this.props.yLines)
    yLines.enter().append('rect')
      .attr('class', 'yLine')
    yLines.exit().remove()

    const yLineLabels = this.wrapper.selectAll('.yLineLabel')
      .data(this.props.yLines)
    yLineLabels.enter().append('text')
      .attr('class', 'yLineLabel')
    yLineLabels.exit().remove()

    this.updateVizComponents(DURATION, delay)
  }

  render () {
    return super.render()
  }
}

ColumnChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    category: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    count: PropTypes.number.isRequired,
    color: PropTypes.string
  })).isRequired
}

module.exports = ColumnChart
