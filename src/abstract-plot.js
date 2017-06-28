import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

class AbstractPlot extends React.Component {

    constructor(props) {
        super(props);

        this.margin = { top: 5, right: 15, bottom: 40, left: 50 };
        this.height = this.props.options.height - this.margin.top - this.margin.bottom;
        this.width = this.props.options.width;

        this.updateGraphicDimensions = this.updateGraphicDimensions.bind(this);
        this.getXScale = this.getXScale.bind(this);
        this.getYScale = this.getYScale.bind(this);
    }

    componentDidMount() {
        this.initialSetup();
    }

    componentDidUpdate() {
        // console.log('AbstractPlot.componentDidUpdate()');
        if (this.props.data.length === 0) { this.resetGraphic(); }
        this.updateGraphicDimensions();
        this.updateGraphicContents();
    }

    initialSetup() {
        const xAxisLabel = 'X Axis Label';
        const yAxisLabel = 'Y Axis Label';

        this.svg = d3.select(this.svg);

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
        // const width = this.svg.getBoundingClientRect().width;
        // this.width = width - this.margin.left - this.margin.right;

        this.svg.attr('width', this.width + this.margin.left + this.margin.right)
                .attr('height', this.height + this.margin.top + this.margin.bottom);

        this.wrapper.select('.x-axis-label').attr('x', this.width/2);
    }

    getXScale() {
        throw('AbstractPlot.getXScale(): unimplemented stub method');
    }

    getYScale() {
        throw('AbstractPlot.getYScale(): unimplemented stub method');
    }

    updateVizComponents() {
        const yAxis = this.svg.select('.y-axis');
        const xAxis = this.svg.select('.x-axis');

        yAxis.transition()
            .duration(500)
            .call(d3.axisLeft(this.getYScale()));

        xAxis.transition()
            .duration(500)
            .call(d3.axisBottom(this.getXScale()));
    }

    updateGraphicContents() {
        this.updateVizComponents();
    }

    resetGraphic() {
    }

    render() {
        return (
            <div className="ps-AbstractPlot">
                <svg ref={(svg) => { this.svg = svg; }}></svg>
            </div>
        );
    }
}

AbstractPlot.propTypes = {
    data: PropTypes.array.isRequired,
    options: PropTypes.shape({
        height: PropTypes.number,
        width: PropTypes.number
    })
};

AbstractPlot.defaultProps = {
    options: {
        height: 400,
        width: 600
    }
};

module.exports = AbstractPlot;