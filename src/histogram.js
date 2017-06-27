import AbstractPlot from './abstract-plot';
import * as d3 from 'd3';

class Histogram extends AbstractPlot {
    constructor(props) {
        super(props);

        this.updateGraphicContents = this.updateGraphicContents.bind(this);
        this.setBarSizes = this.setBarSizes.bind(this);
    }

    getXScale() {
        const minRange = 0;
        const maxRange = this.width;

        // Note that we assume the data has already been 'niced'; see
        // PlottableFactory.
        // Min will be x0 of the first bin
        const minDomain = +this.props.data[0].x0;
        // Max will be x1 of the last bin
        const maxDomain = +this.props.data[this.props.data.length-1].x1;

        return d3.scaleLinear()
            .rangeRound([minRange, maxRange])
            .domain([minDomain, maxDomain])
            .nice();
    }

    getYScale() {
        const minRange = 0;
        const maxRange = this.height;

        const minDomain = 0;
        const maxDomain = d3.max(this.props.data.map(d => d.length));

        return d3.scaleLinear()
            .range([maxRange, minRange]) // Yes, we need to swap these
            .domain([minDomain, maxDomain]);
    }

    setBarSizes(bars) {
        const x = this.getXScale();
        const y = this.getYScale();

        bars.attr('x', 1)
            .attr('y', d => this.getYScale()(d.length))
            .attr('width', d => x(d.x1) - x(d.x0) - 1)
            .attr('height', d => this.height - y(d.length))
            .attr('transform', d => `translate(${x(d.x0)}, 0)`);
    }

    updateGraphicContents() {
        const bars = this.wrapper.selectAll('.bar')
            .data(this.props.data);

        const colorCategoryScale = d3.scaleOrdinal(d3.schemeCategory20);

        // Enter: add bars
        bars.enter().append('rect')
            .attr('class', 'bar')
            .attr('fill', colorCategoryScale(0)) // All bars are the same color
            .call(this.setBarSizes);

        bars.exit().remove();

        this.updateVizComponents();
    }

    render() {
        return super.render();
    }
}

module.exports = Histogram;