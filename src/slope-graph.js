import AbstractPlot from './abstract-plot'
import PropTypes from 'prop-types'
import * as d3 from 'd3'

/**
 * @class
 * @extends AbstractPlot
 *
 * Expects props.data to be an array of objects. Each object has a `category`
 * property and a `values` array. The value of the `category` property is the
 * name of a higher-order category or grouping; the `values` array should
 * contain two values that will be grouped under the higher-order category.
 *
 * e.g. `[{category: 'A', values: [1, 2]}, {category: 'B', values: [3, 4]}`
 *
 * Also requires a `labels` array, which should be of length 2, containing
 * labels for the first and second values.
 *
 * Can also take an optional `colors` array, which should be the same length as
 * the props.data array; these colors will be used instead of the default color
 * bands. If, however, `colors` is an array of only two elements, its two colors
 * will be used as an interpolation range to color the slopes in each group.
 */
const CIRCLE_RADIUS = 5
const LABEL_MARGIN = CIRCLE_RADIUS * 2

class SlopeGraph extends AbstractPlot {
  constructor (props) {
    super(props)
    this.drawSlopes = this.drawSlopes.bind(this)
    this.drawLabels = this.drawLabels.bind(this)
    this.drawInitialLabels = this.drawInitialLabels.bind(this)
  }

  getXScale () {
    // const texts = d3.selectAll('text').nodes()
    // const textWidth = d3.max(texts, d => d.getBBox().width) + 5
    const minRange = 0
    const maxRange = this.width
    const minDomain = 0
    const maxDomain = 1
    return d3.scaleLinear()
      .range([minRange, maxRange])
      .domain([minDomain, maxDomain])
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

  setupXAxis () {
    // Return null; we don't show the X axis on a slopegraph
  }

  setupYAxis () {
    // Return null; we don't show the Y axis on a slopegraph
  }

  drawSlopes (slopes) {
    const lineFunction = d3.line()
      .curve(d3.curveBasis)
      .x((d, i) => this.getXScale()(i))
      .y((d, i) => this.getYScale()(d))

    const colorCategoryScale = d3.scaleOrdinal(d3.schemeCategory20)

    slopes.attr('d', d => lineFunction(d.values))
      .attr('fill', 'none')
      .attr('stroke', (d, i) => colorCategoryScale(i))
  }

  drawLabels (gElements, side) {
    const index = side === 'left' ? 0 : 1

    gElements.select('text')
      .text(d => `${d.category}:  ${d.values[index]}`)
      .attr('y', d => this.getYScale()(d.values[index]))
      .attr('x', this.getXScale()(index))

    gElements.select('circle')
      .attr('cy', d => this.getYScale()(d.values[index]))
      .attr('cx', this.getXScale()(index))
  }

  drawInitialLabels (gElements, side) {
    const colorCategoryScale = d3.scaleOrdinal(d3.schemeCategory20)

    const index = side === 'left' ? 0 : 1

    gElements.select('text')
      .text(d => `${d.category}:  ${d.values[index]}`)
      .attr('fill', (d, i) => colorCategoryScale(i))
      .attr('y', d => this.getYScale()(d.values[index]))
      .attr('x', this.getXScale()(index))
      .attr('dx', side === 'left' ? -LABEL_MARGIN : LABEL_MARGIN)
      .style('text-anchor', side === 'left' ? 'end' : 'start')
      .style('alignment-baseline', 'middle')
      .style('font-size', '0.8rem')
      .style('font-family', this.font)

    gElements.select('circle')
      .attr('fill', (d, i) => colorCategoryScale(i))
      .attr('cy', d => this.getYScale()(d.values[index]))
      .attr('cx', this.getXScale()(index))
      .attr('r', CIRCLE_RADIUS)
  }

  updateVizComponents () {
    super.updateVizComponents()
    this.svg.selectAll('.line').transition().duration(500).call(this.drawSlopes)
    if (this.state.initialUpdate) {
      // Initial update? No animation
      this.svg.selectAll('g.left-label').call(this.drawInitialLabels, 'left')
      this.svg.selectAll('g.right-label').call(this.drawInitialLabels, 'right')
      // The next line will, conveniently, re-trigger updateVizComponents(),
      // which in turn will actually animate the height of the bars.
      this.setState({ initialUpdate: false })
    }
    this.svg.selectAll('g.left-label').transition().duration(500).call(this.drawLabels, 'left')
    this.svg.selectAll('g.right-label').transition().duration(500).call(this.drawLabels, 'right')
  }

  updateGraphicContents () {
    const slopes = this.wrapper.selectAll('.line')
      .data(this.props.data)

    slopes.enter().append('path')
      .attr('class', 'line')

    slopes.exit().remove()

    const leftLabels = this.wrapper.selectAll('g.left-label')
      .data(this.props.data)

    const leftLabelsEnter = leftLabels.enter().append('g')
      .attr('class', 'label left-label')

    leftLabelsEnter.append('text').attr('class', 'label left-label')
    leftLabelsEnter.append('circle').attr('class', 'label left-label')

    leftLabels.exit().remove()

    const rightLabels = this.wrapper.selectAll('g.right-label')
      .data(this.props.data)

    const rightLabelsEnter = rightLabels.enter().append('g')
      .attr('class', 'label right-label')

    rightLabelsEnter.append('text').attr('class', 'label right-label')
    rightLabelsEnter.append('circle').attr('class', 'label right-label')

    rightLabels.exit().remove()

    this.updateVizComponents()
  }

  render () {
    return super.render()
  }
}

SlopeGraph.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    category: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    values: PropTypes.array.isRequired
  })).isRequired
}

module.exports = SlopeGraph
