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
  }

  setBarSizes (bars) {
    const colorCategoryScale = d3.scaleOrdinal(d3.schemeCategory20)
    bars.attr('x', d => this.getXScale()(d.category))
      .attr('y', d => this.getYScale()(d.count))
      .attr('width', this.getXScale().bandwidth())
      .attr('height', d => this.height - this.getYScale()(d.count))
      .attr('fill', (d, i) => d.color || colorCategoryScale(i))
  }

  // When we initially set the bar locations, we want the x-values to be
  // correct, but not the y-values -- that way we can animate the height of the
  // bar changing
  setInitialBarSizes (bars) {
    const colorCategoryScale = d3.scaleOrdinal(d3.schemeCategory20)
    bars.attr('x', d => this.getXScale()(d.category))
      .attr('y', this.height)
      .attr('width', this.getXScale().bandwidth())
      .attr('height', 0)
      .attr('fill', (d, i) => d.color || colorCategoryScale(i))
  }

  updateVizComponents () {
    super.updateVizComponents()
    if (this.state.initialUpdate) {
      // Initial update? No animation
      this.svg.selectAll('.bar').call(this.setInitialBarSizes)
      // The next line will, conveniently, re-trigger updateVizComponents(),
      // which in turn will actually animate the height of the bars.
      this.setState({ initialUpdate: false })
    }
    this.svg.selectAll('.bar').transition().duration(500).call(this.setBarSizes)
  }

  updateGraphicContents () {
    const bars = this.wrapper.selectAll('.bar')
      .data(this.props.data, d => d.category)

    bars.enter().append('rect')
      .attr('class', 'bar')

    bars.exit().remove()

    this.updateVizComponents()
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
