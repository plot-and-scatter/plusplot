import AbstractPlot from './abstract-plot';
import * as d3 from 'd3';

class Histogram extends AbstractPlot {
    constructor(props) {
        super(props);

        this.updateGraphicContents = this.updateGraphicContents.bind(this);
        this.setBarSizes = this.setBarSizes.bind(this);
    }

    static defaultBinning(data, numTicks=10) {
        // This is somewhat complicated. Basically, we can't just
        // rely on d3.histogram to give nice bins, because the x0 of the
        // first bin and the x1 of the last bin are effectively infinite.
        // So we build a temporarily scale and 'nice' it, then use that
        // scale to build the histogram bins. For more information,
        // see https://github.com/d3/d3-array/issues/46
        const extent = d3.extent(data, d => +d.value || +d);
        const scale = d3.scaleLinear().domain(extent).nice(numTicks);
        const bins = d3.histogram()
            .domain(scale.domain())
            .thresholds(scale.ticks())
            .value(d => +d.value || +d)(data);

        const filteredBins = bins.filter(bin => (bin.x1 - bin.x0 > 0 || bin.length > 0));

        return filteredBins;
    }

    getBinWidth(bin) {
        return bin.x1 - bin.x0;
    }

    getXScale() {
        const minRange = 0;
        const maxRange = this.width;

        // Note that we assume the data has already been 'niced'; see
        // defaultBinning().

        // Min will be x0 of the first bin
        const minDomain = +this.props.data[0].x0;

        // If the last bin has a width of zero, max will be x1 of the last bin
        // plus the width of the second-to-last bin
        const dataLength = this.props.data.length;
        const lastBinWidth = this.getBinWidth(this.props.data[dataLength-1]);
        let maxDomain = this.props.data[dataLength-1].x1;
        if (lastBinWidth === 0) {
            const secondLastBinWidth = this.getBinWidth(this.props.data[dataLength-2]);
            maxDomain += secondLastBinWidth;
        }

        return d3.scaleLinear()
            .range([minRange, maxRange])
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

        // Calculate the standard width, which will be of the first bin.
        const firstBin = this.props.data[0];
        const width = x(firstBin.x1) - x(firstBin.x0) - 1;

        bars.attr('x', 1)
            .attr('y', d => y(d.length))
            .attr('width', width)
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