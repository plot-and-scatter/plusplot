import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

class AbstractPlot extends React.Component {

    constructor(props) {
        super(props);

        const defaultOptions = {
            height: 400,
            width: 600,
            margins: {
                top: 5,
                right: 15,
                bottom: 40,
                left: 50
            },
            axes: {
                xAxisLabel: 'X Axis Label',
                yAxisLabel: 'Y Axis Label',
                xAxisVisible: 'unset',
                yAxisVisible: 'unset'
            }
        };

        // First, merge any sub-objects (e.g. margins); then merge the base
        // options object; then reassign all merged sub-objects to the merged
        // options object. TODO: clean this up a little
        const propOptions = this.props.options || {};
        const mergedMargins = Object.assign(defaultOptions.margins, (propOptions.margins || {}));

        const mergedAxes = Object.assign(defaultOptions.axes, (propOptions.axes || {}));

        // const mergedAxisLabels = Object.assign(defaultOptions.axisLabels, (propOptions.axisLabels || {}));
        // const mergedAxisVisible = Object.assign(defaultOptions.axisVisible, (propOptions.axisVisible || {}));

        const mergedOptions = Object.assign(defaultOptions, this.props.options);

        mergedOptions.margins = mergedMargins;
        mergedOptions.axes = mergedAxes;
        // mergedOptions.axisLabels = mergedAxisLabels;
        // mergedOptions.axisVisible = mergedAxisVisible;

        this.margins = mergedOptions.margins;
        this.axes = mergedOptions.axes;
        // this.axisLabels = mergedOptions.axisLabels;
        // this.axisVisible = mergedOptions.axisVisible;
        this.height = mergedOptions.height - this.margins.top - this.margins.bottom;
        this.width = mergedOptions.width;

        this.updateGraphicDimensions = this.updateGraphicDimensions.bind(this);
        this.getXScale = this.getXScale.bind(this);
        this.getYScale = this.getYScale.bind(this);
    }

    componentDidMount() {
        this.initialSetup();
    }

    componentDidUpdate() {
        console.log('AbstractPlot.componentDidUpdate()');
        if (this.props.data.length === 0) { this.resetGraphic(); }
        this.updateGraphicDimensions();
        this.updateGraphicContents();
    }

    initialSetup() {
        // const xAxisLabel = 'X Axis Label';
        // const yAxisLabel = 'Y Axis Label';
        this.svg = d3.select(this.svgRef);

        this.wrapper = this.svg.append('g')
            .attr('class', 'wrapper')
            .attr('transform', 'translate(' + this.margins.left + ',' + this.margins.top + ')');

        this.wrapper.append('g')
            .attr('class', 'y-axis')
            .style('display', this.axes.yAxisVisible);

        this.wrapper.append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(0,' + this.height + ')')
            .style('display', this.axes.xAxisVisible);

        this.wrapper.append('text')
            .attr('class', 'axis-label y-axis-label')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - this.margins.left + 10)
            .attr('x', 0 - this.height / 2)
            .attr('dy', 0)
            .style('text-anchor', 'middle')
            .text(this.axes.yAxisLabel)
            .style('display', this.axes.yAxisVisible);

        this.wrapper.append('text')
            .attr('class', 'axis-label x-axis-label')
            .attr('y', this.height + this.margins.bottom)
            .style('text-anchor', 'middle')
            .text(this.axes.xAxisLabel)
            .style('display', this.axes.xAxisVisible);

        this.updateGraphicDimensions();

        if (this.props.data && this.props.data.length > 0) {
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
        // this.width = width - this.margins.left - this.margins.right;
        this.svg.attr('width', this.width + this.margins.left + this.margins.right)
            .attr('height', this.height + this.margins.top + this.margins.bottom);

        this.wrapper.select('.x-axis-label').attr('x', this.width / 2);
    }

    getXScale() {
        throw ('AbstractPlot.getXScale(): unimplemented stub method');
    }

    getYScale() {
        throw ('AbstractPlot.getYScale(): unimplemented stub method');
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
                <svg ref={(svgRef) => { this.svgRef = svgRef; }}></svg>
            </div>
        );
    }
}

AbstractPlot.propTypes = {
    data: PropTypes.array.isRequired,
    options: PropTypes.shape({
        height: PropTypes.number,
        width: PropTypes.number,
        margins: PropTypes.shape({
            top: PropTypes.number,
            right: PropTypes.number,
            bottom: PropTypes.number,
            left: PropTypes.number
        }),
        axes: PropTypes.shape({
            yAxisLabel: PropTypes.string,
            xAxisLabel: PropTypes.string,
            yAxisVisible: PropTypes.string,
            xAxisVisible: PropTypes.string
        })
    })
};

module.exports = AbstractPlot;