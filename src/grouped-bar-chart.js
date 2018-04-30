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
 * Every list of values must have the same length.
 *
 * e.g. `[{category: 'A', values: [1, 2, 3]}, {category: 'B', values: [4, 5, 6]}`
 *
 * Can also take an optional `colors` array, which should be the same length as
 * the `values` arrays; these colors will be used instead of the default color
 * bands. If, however, `colors` is an array of only two elements, its two colors
 * will be used as an interpolation range to color the bars in each group.
 */
class GroupedBarChart extends AbstractPlot {
  constructor (props) {
    super(props)
    this.setBarSizes = this.setBarSizes.bind(this)
    this.setInitialBarSizes = this.setInitialBarSizes.bind(this)
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

  getInnerYScale () {
    const minRange = 0
    const maxRange = this.getYScale().bandwidth()
    const maxDomain = d3.max(this.props.data.map(d => d.values.length))
    const domain = []
    for (let i = 0; i < maxDomain; i++) { domain.push(i) }
    return d3.scaleBand()
      .rangeRound([minRange, maxRange])
      .domain(domain)
      .padding(0.05)
  }

  getXScale () {
    const minRange = 0
    const maxRange = Math.max(1, this.width)
    const minDomain = 0
    const maxDomain = d3.max(this.props.data.map(d => d3.max(d.values)))
    return d3.scaleLinear()
      .range([minRange, maxRange])
      .domain([minDomain, maxDomain])
  }

  setBarSizes (barGroups) {
    const barDomainExtent = d3.extent(this.getInnerYScale().domain())

    const colorCategoryScale = this.props.colors
    ? (this.props.colors.length === 2
        ? d3.scaleLinear().domain(barDomainExtent).range(this.props.colors)
        : d3.scaleOrdinal(this.props.colors)
      )
    : d3.scaleOrdinal(d3.schemeCategory20)

    barGroups
      .attr('transform', d => `translate(0,${this.getYScale()(d.category)})`)

    barGroups.selectAll('rect')
      .attr('y', (d, i) => this.getInnerYScale()(i))
      .attr('x', 1)
      .attr('height', this.getInnerYScale().bandwidth())
      .attr('width', d => this.getXScale()(d))
      .attr('fill', (d, i) => d.color || colorCategoryScale(i))
  }

  // When we initially set the bar locations, we want the x-values to be
  // correct, but not the y-values -- that way we can animate the height of the
  // bar changing
  setInitialBarSizes (barGroups) {
    const barDomainExtent = d3.extent(this.getInnerYScale().domain())

    const colorCategoryScale = this.props.colors
      ? (this.props.colors.length === 2
          ? d3.scaleLinear().domain(barDomainExtent).range(this.props.colors)
          : d3.scaleOrdinal(this.props.colors)
        )
      : d3.scaleOrdinal(d3.schemeCategory20)

    barGroups
      .attr('transform', d => `translate(0, ${this.getYScale()(d.category)})`)

    barGroups.selectAll('rect')
      .attr('y', (d, i) => this.getInnerYScale()(i))
      .attr('x', 1)
      .attr('height', this.getInnerYScale().bandwidth())
      .attr('width', 0)
      .attr('fill', (d, i) => d.color || colorCategoryScale(i))
  }

  updateVizComponents (duration = 500) {
    super.updateVizComponents(duration)
    if (this.state.initialUpdate) {
      // Initial update? No animation
      this.svg.selectAll('.barGroup').call(this.setInitialBarSizes)
      // The next line will, conveniently, re-trigger updateVizComponents(),
      // which in turn will actually animate the height of the bars.
      this.setState({ initialUpdate: false })
    }
    this.svg.selectAll('.barGroup').transition().duration(duration).call(this.setBarSizes)
  }

  updateGraphicContents () {
    // The bar groups are the groupings of bars
    const barGroups = this.wrapper.selectAll('.barGroup')
      .data(this.props.data, d => d.category)

    barGroups.enter().append('g')
        .attr('class', 'barGroup')

    barGroups.exit().remove()

    // The bars are the bars within each group
    const bars = this.wrapper.selectAll('.barGroup').selectAll('.bar')
        .data(d => d.values, (d, i) => i)

    bars.enter().append('rect')
        .attr('class', 'bar')

    bars.exit().remove()

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
