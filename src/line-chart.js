import AbstractPlot from './abstract-plot'
import * as d3 from 'd3'

const colorFunc = (d, i) => d.color || d3.scaleOrdinal(d3.schemeCategory10)(i)

const CHANGE_THRESHOLD = 60

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

    if (this.props.showLineValues) {
      this.mouseG = this.svg
        .append('g')
        .attr('class', 'mouse-over-effects')
        .attr(
          'transform',
          `translate(${this.margins.left}, ${this.margins.top})`
        )

      this.wrapper
        .append('g')
        .attr('class', 'mouse-line-g')
        .append('path') // this is the black vertical line to follow mouse
        .attr('class', 'mouse-line')
        .style('stroke', 'black')
        .style('stroke-width', '1px')
        .style('opacity', '1')
        .attr('d', () => `M0, ${this.height} 0, 0`)

      d3.select('.mouse-line-g')
        .append('text')
        .attr('fill', 'black')
        .attr('class', 'mouse-line-text')
        .attr('font-size', '12px')

      this.rect = this.mouseG
        .append('svg:rect') // append a rect to catch mouse movements on canvas
        .attr('width', this.width) // can't catch mouse events on a g element
        .attr('height', this.height)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mouseout', () => {
          // on mouse out hide line, circles and text
          d3.select('.mouse-line-g').style('opacity', '0')
          d3.selectAll('.mouse-per-line circle').style('opacity', '0')
          d3.selectAll('.mouse-per-line text').style('opacity', '0')
        })
        .on('mouseover', () => {
          // on mouse in show line, circles and text
          d3.select('.mouse-line-g').style('opacity', '1')
          d3.selectAll('.mouse-per-line circle').style('opacity', '1')
          d3.selectAll('.mouse-per-line text').style('opacity', '1')
        })
        .on('mousemove', (d, i, nodes) => {
          const lines = document.getElementsByClassName('line')
          const rectElement = nodes[i]
          // mouse moving over canvas
          var mouse = d3.mouse(rectElement)
          d3.select('.mouse-line-g').attr(
            'transform',
            `translate(${mouse[0]} 0)`
          )
          d3.select('.mouse-line-text')
            .text(
              `${d3.format('.0f')(this.getXScale().invert(mouse[0]))} months`
            )
            .attr('transform', () => {
              const translateX =
                this.width - mouse[0] > CHANGE_THRESHOLD ? 5 : -70
              return `translate(${translateX}, 10)`
            })

          d3.selectAll('.mouse-per-line').attr('transform', (d, i, nodes) => {
            const mousePerLineElement = nodes[i]
            var beginning = 0
            var end = lines[i].getTotalLength()
            var target = null
            let pos

            while (true) {
              target = Math.floor((beginning + end) / 2)
              pos = lines[i].getPointAtLength(target)
              if (
                (target === end || target === beginning) &&
                pos.x !== mouse[0]
              ) {
                break
              }
              if (pos.x > mouse[0]) end = target
              else if (pos.x < mouse[0]) beginning = target
              else break // position found
            }

            d3.select(mousePerLineElement)
              .select('text')
              .text(d3.format('.0%')(this.getYScale().invert(pos.y)))

            return 'translate(' + mouse[0] + ',' + pos.y + ')'
          })

          d3.selectAll('.mouse-per-line-text').attr('transform', () => {
            const translateX =
              this.width - mouse[0] > CHANGE_THRESHOLD ? 10 : -35
            return `translate(${translateX}, 0)`
          })
        })
    }
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

    lines
      .attr('d', d => lineFunction(d.values))
      .attr('fill', 'none')
      .attr('stroke', colorFunc)
  }

  buildMouseCatcher () {
    this.rect
      .attr('width', this.width) // can't catch mouse events on a g element
      .attr('height', this.height)
  }

  updateVizComponents (duration = 500) {
    super.updateVizComponents(duration)
    this.svg
      .selectAll('.line')
      .transition(this.transitionID())
      .duration(duration)
      .call(this.drawLines)

    if (this.props.showLineValues) {
      this.svg
        .selectAll('.mouse-per-line')
        .transition(this.transitionID())
        .duration(duration)
        .call(this.buildMouseCatcher)
    }
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

    if (this.props.showLineValues) {
      const mousePerLine = this.wrapper
        .selectAll('.mouse-per-line')
        .data(this.props.data, d => d.id || d.key)

      const mousePerLineGs = mousePerLine
        .enter()
        .append('g')
        .attr('class', 'mouse-per-line')

      mousePerLineGs
        .append('circle')
        .attr('r', 5)
        .style('stroke', colorFunc)
        .style('fill', colorFunc)
        .style('stroke-width', '1px')
        .style('opacity', '0')

      mousePerLineGs
        .append('text')
        .attr('transform', 'translate(8, 4.5)')
        .attr('fill', colorFunc)
        .attr('class', 'mouse-per-line-text')
        .attr('font-size', '12px')

      mousePerLine.exit().remove()
    }

    this.updateVizComponents()
  }
}

module.exports = LineChart
