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
class GroupedColumnChart extends AbstractPlot {
  constructor (props) {
    super(props)
    this.setBarSizes = this.setBarSizes.bind(this)
    this.setInitialBarSizes = this.setInitialBarSizes.bind(this)
    this.setDataLabels = this.setDataLabels.bind(this)
    this.setInitialDataLabels = this.setInitialDataLabels.bind(this)
    this.updateGraphicContents = this.updateGraphicContents.bind(this)
  }

  getXScale () {
    const minRange = 0
    const maxRange = this.width || 1
    const domain = this.props.data.map(d => d.category)
    // console.log('minRange', minRange, 'maxRange', maxRange)
    // console.log('domain', domain)
    return d3
      .scaleBand()
      .range([minRange, maxRange])
      .domain(domain)
      .padding(0.2)
  }

  getInnerXScale () {
    const minRange = 0
    const maxRange = this.getXScale().bandwidth()
    const maxDomain = d3.max(this.props.data.map(d => d.values.length))
    const domain = []
    for (let i = 0; i < maxDomain; i++) {
      domain.push(i)
    }
    // console.log('* * *')
    // console.log('maxRange', maxRange)
    // console.log('domain', domain)
    return d3
      .scaleBand()
      .rangeRound([minRange, maxRange])
      .domain(domain)
      .padding(0.05)
  }

  getYScale () {
    const minRange = 0
    const maxRange = this.height
    const minDomain = 0
    const maxDomain = d3.max(
      this.props.data.map(d => d3.max(d.values.map(v => +v || 0)))
    )
    return d3
      .scaleLinear()
      .range([maxRange, minRange]) // Yes, we need to swap these
      .domain([minDomain, maxDomain])
      .nice()
  }

  setBarSizes (bars) {
    const barDomainExtent = d3.extent(this.getInnerXScale().domain())

    const colorCategoryScale = this.props.colors
      ? this.props.colors.length === 2
        ? d3
          .scaleLinear()
          .domain(barDomainExtent)
          .range(this.props.colors)
        : d3.scaleOrdinal(this.props.colors)
      : d3.scaleOrdinal(d3.schemeCategory10)

    bars
      .attr('x', (d, i) => this.getInnerXScale()(i))
      .attr('y', d => {
        const yValue = this.getYScale()(d)
        return isNaN(yValue) ? this.height : yValue
      })
      .attr('width', this.getInnerXScale().bandwidth())
      .attr('height', d => {
        const yValue = this.getYScale()(d)
        return isNaN(yValue) ? 0 : this.height - yValue
      })
      .attr('fill', (d, i) => d.color || colorCategoryScale(i))
  }

  // When we initially set the bar locations, we want the x-values to be
  // correct, but not the y-values -- that way we can animate the height of the
  // bar changing
  setInitialBarSizes (bars) {
    const barDomainExtent = d3.extent(this.getInnerXScale().domain())

    const colorCategoryScale = this.props.colors
      ? this.props.colors.length === 2
        ? d3
          .scaleLinear()
          .domain(barDomainExtent)
          .range(this.props.colors)
        : d3.scaleOrdinal(this.props.colors)
      : d3.scaleOrdinal(d3.schemeCategory10)

    bars
      .attr('x', (d, i) => this.getInnerXScale()(i))
      .attr('y', d => this.height)
      .attr('width', this.getInnerXScale().bandwidth())
      .attr('height', 0)
      .attr('fill', (d, i) => d.color || colorCategoryScale(i))
  }

  setDataLabels (dataLabels) {
    const positionAdjustment = this.dataLabels.position || 0

    dataLabels
      .attr(
        'x',
        (d, i) =>
          this.getInnerXScale()(i) + 0.5 * this.getInnerXScale().bandwidth()
      )
      .attr('y', d => {
        const yValue = this.getYScale()(d)
        return (isNaN(yValue) ? this.height : yValue) + positionAdjustment
      })
      .style('font-family', this.font)
      .style('text-anchor', 'middle')
      .style('alignment-baseline', 'middle')
      .attr('fill', this.dataLabels.color)
      .text(d => (this.dataLabels.formatter ? this.dataLabels.formatter(d) : d))
  }

  setInitialDataLabels (dataLabels) {
    dataLabels
      .attr(
        'x',
        (d, i) =>
          this.getInnerXScale()(i) + 0.5 * this.getInnerXScale().bandwidth()
      )
      .attr('y', d => this.height)
      .style('font-family', this.font)
      .style('text-anchor', 'middle')
      .style('alignment-baseline', 'middle')
      .attr('fill', this.dataLabels.color)
  }

  updateVizComponents (duration = 500, delay = 0) {
    super.updateVizComponents(duration, delay)
    this.svg
      .selectAll('.barGroup')
      .transition(this.transitionID())
      .duration(duration)
      .delay(delay)
      .attr('transform', d => `translate(${this.getXScale()(d.category)},0)`)
    this.svg
      .selectAll('.barGroup')
      .selectAll('.bar')
      .transition(this.transitionID())
      .duration(duration)
      .delay(delay)
      .call(this.setBarSizes)
    this.svg
      .selectAll('.barGroup')
      .selectAll('.dataLabel')
      .transition(this.transitionID())
      .duration(duration)
      .delay(delay)
      .call(this.setDataLabels)
  }

  updateGraphicContents () {
    const DURATION = 300

    // The bar groups are the groupings of bars
    const barGroups = this.wrapper
      .selectAll('.barGroup')
      .data(this.props.data, d => d.category)

    // EXITING

    // First, reduce height of the exiting bars
    barGroups
      .exit()
      .selectAll('.bar')
      .transition(this.transitionID())
      .duration(DURATION)
      .call(this.setInitialBarSizes)
      .on('end', () => barGroups.exit().remove())

    barGroups
      .exit()
      .selectAll('.dataLabel')
      .transition(this.transitionID())
      .duration(DURATION)
      .call(this.setInitialDataLabels)

    const delay = barGroups.exit().size() ? DURATION + 50 : 0

    // Now move the bar groups
    barGroups
      .transition(this.transitionID())
      .delay(delay)
      .duration(DURATION)
      .attr('transform', d => `translate(${this.getXScale()(d.category)},0)`)

    // Finally, add the bar groups and bars
    barGroups
      .enter()
      .append('g')
      .attr('class', 'barGroup')
      .attr('data-category', d => d.category)
      .attr(
        'transform',
        d => `translate(${this.getXScale()(d.category) || 0},0)`
      )

    const bars = this.wrapper
      .selectAll('.barGroup')
      .selectAll('.bar')
      .data(d => d.values, (d, i) => i)

    bars
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .call(this.setInitialBarSizes)
      .transition(this.transitionID())
      .delay(delay)
      .duration(DURATION)
      .call(this.setBarSizes)

    bars
      .transition(this.transitionID())
      .delay(delay)
      .duration(DURATION)
      .call(this.setBarSizes)

    if (this.dataLabels) {
      // The dataLabels are the dataLabels within each group
      const dataLabels = this.wrapper
        .selectAll('.barGroup')
        .selectAll('.dataLabel')
        .data(d => d.values, (d, i) => i)

      dataLabels
        .enter()
        .append('text')
        .attr('class', 'dataLabel')
        .call(this.setInitialDataLabels)
        .transition(this.transitionID())
        .delay(delay)
        .duration(DURATION)
        .call(this.setDataLabels)

      dataLabels
        .transition(this.transitionID())
        .delay(delay)
        .duration(DURATION)
        .call(this.setDataLabels)
    }

    this.updateVizComponents(DURATION, delay)
  }

  render () {
    return super.render()
  }
}

GroupedColumnChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      values: PropTypes.array.isRequired
    })
  ).isRequired
}

module.exports = GroupedColumnChart
