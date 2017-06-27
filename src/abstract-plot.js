import React from 'react';
import PropTypes from 'prop-types';

class AbstractPlot extends React.Component {

    constructor(props) {
        super(props);

        this.margin = { top: 5, right: 15, bottom: 40, left: 50 };
        this.height = 400 - this.margin.top - this.margin.bottom;

        this.updateGraphicDimensions = this.updateGraphicDimensions.bind(this);
        this.getXScale = this.getXScale.bind(this);
        this.getYScale = this.getYScale.bind(this);
    }

    componentDidMount() {
        // console.log('Plottable.componentDidMount()');
        this.initialSetup();
    }

    componentDidUpdate() {
        // console.log('Plottable.componentDidUpdate()');
        if (this.props.data.length === 0) { this.resetGraphic(); }
        this.updateGraphicDimensions();
        this.updateGraphicContents();
    }

    initialSetup() {
        // console.log('Plottable.initialSetup()');

        const xAxisLabel = 'X Axis Label';
        const yAxisLabel = 'Y Axis Label';

        this.svg = d3.select(this.svgAttachmentPoint);

        this.wrapper = this.svg.append('g')
            .attr('class', 'wrapper')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

        this.wrapper.append('g')
            .attr('class', 'y-axis');

        this.wrapper.append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(0,' + this.height + ')');

        this.wrapper.append('text')
            .attr('class', 'axis-label y-axis-label')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - this.margin.left + 10)
            .attr('x', 0 - this.height/2)
            .attr('dy', 0)
            .style('text-anchor', 'middle')
            .text(yAxisLabel);

        this.wrapper.append('text')
            .attr('class', 'axis-label x-axis-label')
            .attr('y', this.height + this.margin.bottom)
            .style('text-anchor', 'middle')
            .text(xAxisLabel);

        this.updateGraphicDimensions();

        // Build tooltip
        // this.tooltip = d3.select('div#histogram').append('div').attr('class', 'tool-tip');

        if (this.props.data) {
            this.updateGraphicContents();
        }

        window.addEventListener('resize', () => {
            this.updateGraphicDimensions();
            this.updateVizComponents();
        });
    }

    updateGraphicDimensions() {
        // Set dimensions and margins of graphic
        // const width = this.svgAttachmentPoint.getBoundingClientRect().width;
        // this.width = width - this.margin.left - this.margin.right;
        this.width = 600;

        this.svg.attr('width', this.width + this.margin.left + this.margin.right)
                .attr('height', this.height + this.margin.top + this.margin.bottom);

        this.wrapper.select('.x-axis-label').attr('x', this.width/2);
    }

    getXScale() {
        throw('Plottable.getXScale(): unimplemented stub method');
    }

    getYScale() {
        throw('Plottable.getYScale(): unimplemented stub method');
    }

    updateVizComponents() {

        // console.log('Plottable.updateVizComponents()');

        // this.svg.selectAll('.bar').transition().duration(500).call(this.setBarSizes);
        // this.svg.selectAll('rect.majority').transition().duration(500).call(this.setMajorityLineSize);
        // this.svg.selectAll('text.majority').transition().duration(500).call(this.setMajorityTextSize);

        const yAxis = this.svg.select('.y-axis');
        const xAxis = this.svg.select('.x-axis');

        yAxis.transition()
            .duration(500)
            .call(d3.axisLeft(this.getYScale()));

        xAxis.transition()
            .duration(500)
            .call(d3.axisBottom(this.getXScale()));

        // Rotate labels if necessary
        // xAxis.selectAll('text')
        //         .style('text-anchor', 'end')
        //         .attr('transform', 'rotate(-30)');

        // if (this.props.data.length > 0) {
        //     yAxis.style('opacity', 1);
        //     xAxis.style('opacity', 1);
        // } else {
        //     yAxis.style('opacity', 0);
        //     xAxis.style('opacity', 0);
        // }
    }

    // setBarSizes(bars) {
    //     const barWidth = (this.width / 87) - 1;
    //     bars.attr('x', d => this.getXScale()(d.seats) - barWidth / 2)
    //         .attr('y', d => this.getYScale()(d.count))
    //         .attr('width', barWidth)
    //         .attr('height', d => this.height - this.getYScale()(d.count));
    // }

    // setMajorityLineSize(majorityLine) {
    //     majorityLine
    //         .attr('x', this.getXScale()(43.5) - 0.5)
    //         .attr('width', 1)
    //         .attr('y', 0)
    //         .attr('height', this.height);
    // }

    // setMajorityTextSize(majorityText) {
    //     majorityText
    //         .attr('x', this.getXScale()(43.5)+5)
    //         .attr('y', 10);
    // }

    updateGraphicContents() {

        // console.log('In Plottable.updateGraphicContents()');

        // // define filtered data
        // let filterData = (data) => {
        //     let filteredData = this.props.data.filter(item => {
        //         return (item.seats === data.seats) && item.count >= 1;
        //     });
        //     return filteredData;
        // };

        // define chart
        // const dataKey = '';
        // const xVariableValueAccessor = '';
        // const xVariableColorAccessor = '';
        // const yVariableValueAccessor = '';
        // const yVariableColorAccessor = '';

        // var bars = this.wrapper.selectAll('.bar')
        //     .data(this.props.data, (d) => d[dataKey]);

        // // enter: for new data added (data that needs DOM)
        // bars.enter().append('rect')
        //     .attr('class', 'bar')
        //     .attr('fill', d => d[xVariableColorAccessor])
        //     .attr('opacity', 0.5);
        //     // .call(this.setBarSizes)

        // bars.exit().remove();

        // // draw majority bar
        // if (this.props.data.length > 0
        //     && this.wrapper.selectAll('.majority').size() === 0)
        // {
        //     this.wrapper.append('rect')
        //         .attr('class', 'majority')
        //         .call(this.setMajorityLineSize);
        //     this.wrapper.append('text')
        //         .attr('class', 'majority')
        //         .text('Majority')
        //         .call(this.setMajorityTextSize);
        // }

        this.updateVizComponents();
    }

    resetGraphic() {
        // console.log('In Plottable.resetGraphic()');
    }

    render() {
        return (
            <div className="ps-plottable">
                <svg
                    ref={(svgAttachmentPoint) => { this.svgAttachmentPoint = svgAttachmentPoint; }}>
                </svg>
            </div>
        );
    }
}

AbstractPlot.propTypes = {
    data: PropTypes.array.isRequired
};

module.exports = AbstractPlot;