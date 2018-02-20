import AbstractPlot from './abstract-plot'
import * as d3 from 'd3'

class ScatterPlot extends AbstractPlot {
  constructor (props) {
    super(props)
    this.setPointPositions = this.setPointPositions.bind(this)
    this.setInitialPointPositions = this.setInitialPointPositions.bind(this)
  }

  getXScale () {
    const minRange = 0
    const maxRange = this.width
    const minDomain = 0
    const maxDomain = d3.max(this.props.data.map(d => d.x))
    return d3.scaleLinear()
      .range([minRange, maxRange])
      .domain([minDomain, maxDomain])
  }

  getYScale () {
    const minRange = 0
    const maxRange = this.height
    const minDomain = 0
    const maxDomain = d3.max(this.props.data.map(d => d.y))
    return d3.scaleLinear()
      .range([maxRange, minRange]) // Yes, we need to swap these
      .domain([minDomain, maxDomain])
  }

  setPointPositions (points) {
    points.attr('r', 5)
      .attr('cx', d => this.getXScale()(d.x))
      .attr('cy', d => this.getYScale()(d.y))
  }

  setInitialPointPositions (points) {
    const colorCategoryScale = d3.scaleOrdinal(d3.schemeCategory20)

    // Start the points in the middle, then 'burst' them out.
    points.attr('r', 5)
      .attr('cx', d => this.width / 2)
      .attr('cy', d => this.height / 2)
      .attr('fill', (d, i) => d.color || colorCategoryScale(i))
  }

  updateVizComponents () {
    super.updateVizComponents()
    if (this.state.initialUpdate) {
      // Initial update? No animation
      this.svg.selectAll('.point').call(this.setInitialPointPositions)
      // The next line will, conveniently, re-trigger updateVizComponents(),
      // which in turn will actually animate the height of the points.
      this.setState({ initialUpdate: false })
    }
    this.svg.selectAll('.point').transition().duration(500).call(this.setPointPositions)
  }

  updateGraphicContents () {
    const points = this.wrapper.selectAll('.point')
      .data(this.props.data)

    points.enter().append('circle')
      .attr('class', 'point')

    points.exit().remove()

    this.updateVizComponents()
  }
}

module.exports = ScatterPlot
