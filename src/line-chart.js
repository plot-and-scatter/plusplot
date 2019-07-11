import AbstractPlot from './abstract-plot'
import * as d3 from 'd3'

class LineChart extends AbstractPlot {
  constructor (props) {
    super(props)
    this.drawLines = this.drawLines.bind(this)
    this.buildMouseCatcher = this.buildMouseCatcher.bind(this)
  }

  _accumulatedValues () {
    return this.props.data.reduce((acc, d) => acc.concat(d.values), [])
  }

  initialSetupHook () {
    super.initialSetupHook()
    this.mouseG = this.wrapper.append('g').attr('class', 'mouse-over-effects')
    this.mouseG
      .append('path') // this is the black vertical line to follow mouse
      .attr('class', 'mouse-line')
      .style('stroke', 'black')
      .style('stroke-width', '1px')
      .style('opacity', '1')
    console.log('this.mouseG -->', this.mouseG)

    this.rect = this.mouseG
      .append('svg:rect') // append a rect to catch mouse movements on canvas
      .attr('width', this.width) // can't catch mouse events on a g element
      .attr('height', this.height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', () => {
        // on mouse out hide line, circles and text
        d3.select('.mouse-line').style('opacity', '0')
        d3.selectAll('.mouse-per-line circle').style('opacity', '0')
        d3.selectAll('.mouse-per-line text').style('opacity', '0')
      })
      .on('mouseover', () => {
        // on mouse in show line, circles and text
        d3.select('.mouse-line').style('opacity', '1')
        d3.selectAll('.mouse-per-line circle').style('opacity', '1')
        d3.selectAll('.mouse-per-line text').style('opacity', '1')
      })
  }

  getXScale () {
    const minRange = 0
    const maxRange = this.width
    let minDomain = 0
    let maxDomain = d3.max(this._accumulatedValues(), d => d.x)

    if (this.props.dates) {
      minDomain = d3.min(this.props.dates)
      maxDomain = d3.max(this.props.dates)

      return d3
        .scaleTime()
        .range([minRange, maxRange])
        .domain([minDomain, maxDomain])
    }

    return d3
      .scaleLinear()
      .range([minRange, maxRange])
      .domain([minDomain, maxDomain])
  }

  getYScale () {
    const minRange = 0
    const maxRange = this.height
    const minDomain = 0
    const maxDomain = d3.max(this._accumulatedValues(), d => d.y)
    return d3
      .scaleLinear()
      .range([maxRange, minRange]) // Yes, we need to swap these
      .domain([minDomain, maxDomain])
  }

  drawLines (lines) {
    const lineFunction = d3
      .line()
      .curve(this.props.curve || d3.curveMonotoneX)
      .x(d => this.getXScale()(d.x))
      .y(d => this.getYScale()(d.y))

    const colorCategoryScale = d3.scaleOrdinal(d3.schemeCategory10)

    lines
      .attr('d', d => lineFunction(d.values))
      .attr('fill', 'none')
      .attr('stroke', (d, i) => d.color || colorCategoryScale(i))
  }

  drawMouseCatcher (lines) {}

  buildMouseCatcher () {
    const mousePerLine = this.mouseG
      .selectAll('.mouse-per-line')
      .data(this.props.data, d => d.id || d.key)
      .enter()
      .append('g')
      .attr('class', 'mouse-per-line')

    mousePerLine
      .append('circle')
      .attr('r', 5)
      .style(
        'stroke',
        (d, i) => d.color || d3.scaleOrdinal(d3.schemeCategory10)(i)
      )
      .style(
        'fill',
        (d, i) => d.color || d3.scaleOrdinal(d3.schemeCategory10)(i)
      )
      .style('stroke-width', '1px')
      .style('opacity', '0')

    mousePerLine.append('text').attr('transform', 'translate(10,3)')

    const lines = document.getElementsByClassName('line')

    this.rect
      .attr('width', this.width) // can't catch mouse events on a g element
      .attr('height', this.height)

    this.rect.on('mousemove', (d, i, nodes) => {
      // mouse moving over canvas
      var mouse = d3.mouse(nodes[i])
      d3.select('.mouse-line').attr('d', () => {
        var d = 'M' + mouse[0] + ',' + this.height
        d += ' ' + mouse[0] + ',' + 0
        return d
      })

      d3.selectAll('.mouse-per-line').attr('transform', (d, i) => {
        var beginning = 0
        var end = lines[i].getTotalLength()
        var target = null
        let pos

        while (true) {
          target = Math.floor((beginning + end) / 2)
          pos = lines[i].getPointAtLength(target)
          if ((target === end || target === beginning) && pos.x !== mouse[0]) {
            break
          }
          if (pos.x > mouse[0]) end = target
          else if (pos.x < mouse[0]) beginning = target
          else break // position found
        }

        // d3.select(this)
        //   .select('text')
        //   .text(
        //     this.getYScale()
        //       .invert(pos.y)
        //       .toFixed(2)
        //   )

        return 'translate(' + mouse[0] + ',' + pos.y + ')'
      })
    })
  }

  updateVizComponents (duration = 500) {
    super.updateVizComponents(duration)
    this.svg
      .selectAll('.line')
      .transition(this.transitionID())
      .duration(duration)
      .call(this.drawLines)
  }

  updateGraphicContents () {
    const lines = this.wrapper
      .selectAll('.line')
      .data(this.props.data, d => d.id || d.key)

    lines
      .enter()
      .append('path')
      .attr('class', 'line')

    lines.exit().remove()

    this.buildMouseCatcher()

    this.updateVizComponents()
  }
}

module.exports = LineChart
