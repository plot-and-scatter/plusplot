import AbstractPlot from './abstract-plot'
import PropTypes from 'prop-types'
import * as d3 from 'd3'

/**
 * @class
 * @extends AbstractPlot
 *
 * Expects props.data to be an array of objects. Each object has a `category`
 * property and a `values` array. The value of the `category` property is the
 * name of a higher-order category or grouping; the `values` array should be an
 * ordered list of values that will be grouped under the higher-order category.
 *
 * e.g. `[{ category: 'A', count: 10}, { category: 'B', count: 15}]`
 *
 */
class GroupedBarChart extends AbstractPlot {
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

  getInnerXScale () {
    const minRange = 0
    const maxRange = this.getXScale().bandwidth()
    const maxDomain = d3.max(this.props.data.map(d => d.values.length))
    const domain = []
    for (let i = 0; i < maxDomain; i++) { domain.push(i) }
    return d3.scaleBand()
      .rangeRound([minRange, maxRange])
      .domain(domain)
      .padding(0.05)
  }

  getYScale () {
    const minRange = 0
    const maxRange = this.height
    const minDomain = 0
    const maxDomain = d3.max(this.props.data.map(d => d3.max(d.values)))
    return d3.scaleLinear()
      .range([maxRange, minRange]) // Yes, we need to swap these
      .domain([minDomain, maxDomain])
  }

  setBarSizes (barGroups) {
    const colorCategoryScale = d3.scaleOrdinal(d3.schemeCategory20)
    barGroups.selectAll('rect')
      .attr('x', (d, i) => this.getInnerXScale()(i))
      .attr('y', d => this.getYScale()(d))
      .attr('width', this.getInnerXScale().bandwidth())
      .attr('height', d => this.height - this.getYScale()(d))
      .attr('fill', (d, i) => d.color || colorCategoryScale(i))
  }

  // When we initially set the bar locations, we want the x-values to be
  // correct, but not the y-values -- that way we can animate the height of the
  // bar changing
  setInitialBarSizes (barGroups) {
    const colorCategoryScale = d3.scaleOrdinal(d3.schemeCategory20)
    barGroups.selectAll('rect')
      .attr('x', (d, i) => this.getInnerXScale()(i))
      .attr('y', d => this.height)
      .attr('width', this.getInnerXScale().bandwidth())
      .attr('height', 0)
      .attr('fill', (d, i) => d.color || colorCategoryScale(i))
  }

  updateVizComponents () {
    super.updateVizComponents()
    if (this.state.initialUpdate) {
      // Initial update? No animation
      this.svg.selectAll('.barGroup').call(this.setInitialBarSizes)
      // The next line will, conveniently, re-trigger updateVizComponents(),
      // which in turn will actually animate the height of the bars.
      this.setState({ initialUpdate: false })
    }
    this.svg.selectAll('.barGroup').transition().duration(500).call(this.setBarSizes)
  }

  updateGraphicContents () {
    const barGroups = this.wrapper.selectAll('.barGroup')
      .data(this.props.data, d => d.category)

    barGroups.enter().append('g')
        .attr('class', 'barGroup')
        .attr('transform', d => `translate(${this.getXScale()(d.category)},0)`)
      .selectAll('rect')
      .data(d => d.values, (d, i) => i)
      .enter().append('rect')
        .attr('class', 'bar')

    // TODO: What if data is updated?

    barGroups.exit().remove()

    this.updateVizComponents()
  }

  render () {
    return super.render()
  }
}

GroupedBarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    category: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    values: PropTypes.array.isRequired
  })).isRequired
}

module.exports = GroupedBarChart
