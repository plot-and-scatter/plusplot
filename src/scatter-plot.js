import AbstractPlot from './abstract-plot';
import * as d3 from 'd3';

class ScatterPlot extends AbstractPlot {
    constructor(props) {
        super(props);
        this.setPointPositions = this.setPointPositions.bind(this);
    }

    getXScale() {
        const minRange = 0;
        const maxRange = this.width;
        const minDomain = 0;
        const maxDomain = d3.max(this.props.data.map(d => d.x));
        return d3.scaleLinear()
            .range([minRange, maxRange])
            .domain([minDomain, maxDomain]);
    }

    getYScale() {
        const minRange = 0;
        const maxRange = this.height;
        const minDomain = 0;
        const maxDomain = d3.max(this.props.data.map(d => d.y));
        return d3.scaleLinear()
            .range([maxRange, minRange]) // Yes, we need to swap these
            .domain([minDomain, maxDomain]);
    }

    setPointPositions(points) {
        points
            .attr('r', 5)
            .attr('cx', d => this.getXScale()(d.x))
            .attr('cy', d => this.getYScale()(d.y));
    }

    updateGraphicContents() {
        const points = this.wrapper.selectAll('.point')
            .data(this.props.data);

        const colorCategoryScale = d3.scaleOrdinal(d3.schemeCategory20);

        // Enter: add points
        points.enter().append('circle')
            .attr('class', 'point')
            .attr('fill', (d, i) => d.color || colorCategoryScale(i))
            .call(this.setPointPositions);

        points.exit().remove();

        this.updateVizComponents();
    }
}

module.exports = ScatterPlot;