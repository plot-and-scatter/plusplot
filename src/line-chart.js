import AbstractPlot from './abstract-plot';
import * as d3 from 'd3';

class LineChart extends AbstractPlot {
    constructor(props) {
        super(props);
        this.drawLines = this.drawLines.bind(this);
    }

    _accumulatedValues() {
        return this.props.data.reduce((acc, d) => acc.concat(d.values), []);
    }

    getXScale() {
        const minRange = 0;
        const maxRange = this.width;
        const minDomain = 0;
        const maxDomain = d3.max(this._accumulatedValues(), d => d.x);
        return d3.scaleLinear()
            .range([minRange, maxRange])
            .domain([minDomain, maxDomain]);
    }

    getYScale() {
        const minRange = 0;
        const maxRange = this.height;
        const minDomain = 0;
        const maxDomain = d3.max(this._accumulatedValues(), d => d.y);
        return d3.scaleLinear()
            .range([maxRange, minRange]) // Yes, we need to swap these
            .domain([minDomain, maxDomain]);
    }

    drawLines(lines) {
        const lineFunction = d3.line()
            .curve(d3.curveBasis)
            .x(d => this.getXScale()(d.x))
            .y(d => this.getYScale()(d.y));

        lines.attr('d', d => lineFunction(d.values));
    }

    updateGraphicContents() {
        const lines = this.wrapper.selectAll('.line')
            .data(this.props.data);

        const colorCategoryScale = d3.scaleOrdinal(d3.schemeCategory20);

        // Enter: add lines
        lines.enter().append('path')
            .attr('class', 'line')
            .attr('fill', 'none')
            .attr('stroke', (d, i) => d.color || colorCategoryScale(i))
            .call(this.drawLines);

        lines.exit().remove();

        this.updateVizComponents();
    }
}

module.exports = LineChart;