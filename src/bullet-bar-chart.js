import AbstractPlot from './abstract-plot'
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
    this.setBulletBarLabels = this.setBulletBarLabels.bind(this)
    this.setInitialBulletBarLabels = this.setInitialBulletBarLabels.bind(this)
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
    return d3
      .scaleBand()
      .range([minRange, maxRange])
      .domain(domain)
      .padding(0.75)
  }

  getXOrigin () {
    return 0
  }

  getXScale () {
    const minRange = 0
    const maxRange = Math.max(this.width, 1)
    const minDomain = this.getXOrigin()
    const maxDomain = d3.max(
      this.props.data.map(d =>
        Math.max(d.count, d3.max(d.comparators.map(c => +c.value || 0)))
      )
    )
    return d3
      .scaleLinear()
      .range([minRange, maxRange])
      .domain([minDomain, maxDomain])
      .nice()
  }

  setBarSizes (bars) {
    const colorCategoryScale = d3.scaleOrdinal(d3.schemeCategory10)
    bars
      .attr('y', d => this.getYScale()(d.category))
      .attr('x', 1)
      .attr('height', this.getYScale().bandwidth())
      .attr('width', d => {
        const xValue = this.getXScale()(d.count)
        return isNaN(xValue) ? 0 : xValue
      })
      .attr('fill', (d, i) => d.color || colorCategoryScale(i))
  }

  // When we initially set the bar locations, we want the x-values to be
  // correct, but not the y-values -- that way we can animate the height of the
  // bar changing
  setInitialBarSizes (bars) {
    const colorCategoryScale = d3.scaleOrdinal(d3.schemeCategory10)
    bars
      .attr('y', d => this.getYScale()(d.category))
      .attr('x', 0)
      .attr('height', this.getYScale().bandwidth())
      .attr('width', 0)
      .attr('fill', (d, i) => d.color || colorCategoryScale(i))
  }

  setBulletBarSizes (bars) {
    const colorCategoryScale = d3.scaleOrdinal(d3.schemeCategory10)
    bars
      .attr(
        'y',
        d => this.getYScale()(d.category) - this.getYScale().bandwidth() * 0.5
      )
      .attr('x', d => (d.showMark ? this.getXScale()(d.value) - 5 : 1))
      .attr('height', this.getYScale().bandwidth() * 2)
      .attr('width', d => (d.showMark ? 5 : this.getXScale()(d.value)))
      .attr('fill', (d, i) => d.color || colorCategoryScale(i))
  }

  setInitialBulletBarSizes (bars) {
    const colorCategoryScale = d3.scaleOrdinal(d3.schemeCategory10)
    bars
      .attr(
        'y',
        d => this.getYScale()(d.category) - this.getYScale().bandwidth() * 0.5
      )
      .attr('x', 0)
      .attr('height', this.getYScale().bandwidth() * 2)
      .attr('width', d => (d.showMark ? 5 : 0))
      .attr('fill', (d, i) => d.color || colorCategoryScale(i))
  }

  setDataLabels (dataLabels) {
    const positionAdjustment = this.dataLabels.position || 0
    dataLabels
      .attr(
        'y',
        d => this.getYScale()(d.category) + 0.5 * this.getYScale().bandwidth()
      )
      .attr('x', d => {
        const xValue = this.getXScale()(d.count)
        return (isNaN(xValue) ? 0 : xValue) + positionAdjustment
      })
      .text(d =>
        this.dataLabels.formatter ? this.dataLabels.formatter(d.count) : d.count
      )
      .style('font-family', this.font)
      .style('text-anchor', 'middle')
      .style('alignment-baseline', 'middle')
      .style('fill', this.dataLabels.color)
  }

  setInitialDataLabels (dataLabels) {
    dataLabels
      .attr(
        'y',
        d => this.getYScale()(d.category) + 0.5 * this.getYScale().bandwidth()
      )
      .attr('x', 0)
      .style('font-family', this.font)
      .style('text-anchor', 'middle')
      .style('alignment-baseline', 'middle')
      .style('fill', this.dataLabels.color)
  }

  setBulletBarLabels (bulletBarLabels) {
    bulletBarLabels
      .attr(
        'y',
        d => this.getYScale()(d.category) - this.getYScale().bandwidth()
      )
      .attr('x', d => this.getXScale()(d.value))
      .text(d =>
        this.dataLabels.formatter ? this.dataLabels.formatter(d.value) : d.value
      )
      .style('font-family', this.font)
      .style('text-anchor', 'middle')
      .style('alignment-baseline', 'middle')
      .style('fill', this.dataLabels.bulletLabelColor || this.dataLabels.color)
  }

  setInitialBulletBarLabels (bulletBarLabels) {
    bulletBarLabels
      .attr(
        'y',
        d => this.getYScale()(d.category) + 0.5 * this.getYScale().bandwidth()
      )
      .attr('x', 0)
      .style('font-family', this.font)
      .style('text-anchor', 'middle')
      .style('alignment-baseline', 'middle')
      .style('fill', this.dataLabels.bulletLabelColor || this.dataLabels.color)
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
    this.svg
      .selectAll('.xLine')
      .transition(this.transitionID())
      .duration(duration)
      .call(this.setXLines)
    this.svg
      .selectAll('.xLineLabel')
      .transition(this.transitionID())
      .duration(duration)
      .call(this.setXLineLabels)
    if (this.state.initialUpdate) {
      // Initial update? No animation
      this.svg.selectAll('.bulletBar').call(this.setInitialBulletBarSizes)
      this.svg.selectAll('.bar').call(this.setInitialBarSizes)
      this.svg.selectAll('.dataLabel').call(this.setInitialDataLabels)
      this.svg.selectAll('.bulletBarLabel').call(this.setInitialBulletBarLabels)
      // The next line will, conveniently, re-trigger updateVizComponents(),
      // which in turn will actually animate the height of the bars.
      this.setState({ initialUpdate: false })
    }
    this.svg
      .selectAll('.bulletBar')
      .transition(this.transitionID())
      .duration(duration)
      .call(this.setBulletBarSizes)
    this.svg
      .selectAll('.bar')
      .transition(this.transitionID())
      .duration(duration)
      .call(this.setBarSizes)
    this.svg
      .selectAll('.dataLabel')
      .transition(this.transitionID())
      .duration(duration)
      .call(this.setDataLabels)
    this.svg
      .selectAll('.bulletBarLabel')
      .transition(this.transitionID())
      .duration(duration)
      .call(this.setBulletBarLabels)
  }

  updateGraphicContents () {
    // Sort comparator values from high to low so they can cover each other
    this.props.data.forEach(d => {
      d.comparators.sort((a, b) =>
        a.value < b.value ? 1 : a.value > b.value ? -1 : 0
      )
    })

    const comparators = []

    this.props.data.forEach(d => {
      d.comparators.forEach(c => {
        const value = Object.assign({}, c)
        value.category = d.category
        comparators.push(value)
      })
    })

    const bulletBars = this.wrapper
      .selectAll('.bulletBar')
      .data(comparators, d => `${d.category}-${d.color}`)
    bulletBars
      .enter()
      .append('rect')
      .attr('class', 'bulletBar')
    bulletBars.exit().remove()

    const bars = this.wrapper
      .selectAll('.bar')
      .data(this.props.data, d => d.category)
    bars
      .enter()
      .append('rect')
      .attr('class', 'bar')
    bars.exit().remove()

    if (this.dataLabels) {
      const dataLabels = this.wrapper
        .selectAll('.dataLabel')
        .data(this.props.data, d => d.category)
      dataLabels
        .enter()
        .append('text')
        .attr('class', 'dataLabel')
      dataLabels.exit().remove()

      const bulletBarLabels = this.wrapper
        .selectAll('.bulletBarLabel')
        .data(comparators, d => `${d.category}-${d.color}`)
      bulletBarLabels
        .enter()
        .append('text')
        .attr('class', 'bulletBarLabel')
      bulletBarLabels.exit().remove()
    }

    const xLines = this.wrapper.selectAll('.xLine').data(this.props.xLines)
    xLines
      .enter()
      .append('rect')
      .attr('class', 'xLine')
    xLines.exit().remove()

    const xLineLabels = this.wrapper
      .selectAll('.xLineLabel')
      .data(this.props.xLines)
    xLineLabels
      .enter()
      .append('text')
      .attr('class', 'xLineLabel')
    xLineLabels.exit().remove()

    this.updateVizComponents()
  }

  render () {
    return super.render()
  }
}

module.exports = BulletBarChart
