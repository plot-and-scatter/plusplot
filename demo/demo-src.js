const PlusPlot = require('../lib/plusplot');
const React = require('react');
const ReactDOM = require('react-dom');

class App extends React.Component {

    constructor(props) {
        super(props);
    }

    // Get an integer in the range of min, max, inclusive.
    // From https://stackoverflow.com/a/1527820
    getRandomInt(min=1, max=9) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    getRandomXY(min=1, max=5) {
        return { x: this.getRandomInt(min, max), y: this.getRandomInt(min, max) };
    }

    getArrayOfRandomXY(length=5, min=1, max=5) {
        const array = [];
        for (let i = 0; i < length; i++) { array.push(this.getRandomXY(min, max)); }
        return array;
    }

    getArrayOfLinearY(length=5, min=1, max=5) {
        const array = [];
        for (let i = 0; i < length; i++) {
            array.push({ x: i, y: this.getRandomInt(min, max)});
        }
        return array;
    }

    generateBarChartData() {
        const barChartData = [
            { category: 'Apples', count: this.getRandomInt(), color: 'rgba(0, 150, 0, 0.5)' },
            { category: 'Bananas', count: this.getRandomInt(), color: '#fe0' },
            { category: 'Oranges', count: this.getRandomInt(), color: 'orange' },
            { category: 'Raspberries', count: this.getRandomInt(), color: '#e25098' },
            { category: 'Strawberries', count: this.getRandomInt(), color: 'rgb(255, 0, 0)' },
            { category: 'Watermelons', count: this.getRandomInt(), color: 'green' },
        ];
        const barChartDataForDisplay = barChartData.map((item, index) => {
            return (
                <span key={index}>&nbsp;&nbsp;{JSON.stringify(item, null, 1)}<br /></span>
            );
        });
        return { barChartData, barChartDataForDisplay };
    }

    generateHistogramData() {
        let histogramData = [];
        for (let i = 0; i < 100; i++) { histogramData.push(this.getRandomInt(1, 9)); }
        histogramData = PlusPlot.Histogram.defaultBinning(histogramData);
        histogramData.color = '#fc0';
        const histogramDataForDisplay = histogramData.map((item, index) => {
            return (
                <span key={index}>
                    &nbsp;&nbsp;
                    <i>x0</i>: {item.x0.toFixed(1)}&nbsp;&nbsp;
                    <i>x1</i>: {item.x1.toFixed(1)}&nbsp;
                    &nbsp;&nbsp;
                    {JSON.stringify(item.sort(), null, 1)}
                    <br />
                </span>
            );
        });
        return { histogramData, histogramDataForDisplay };
    }

    generateScatterPlotData() {
        const scatterPlotData = this.getArrayOfRandomXY(20, 1, 9);
        const scatterPlotDataForDisplay = scatterPlotData.map((item, index) => {
            return (
                <span key={index}>&nbsp;&nbsp;{JSON.stringify(item, null, 1)}<br /></span>
            );
        });
        return { scatterPlotData, scatterPlotDataForDisplay };
    }

    generateLineChartData() {
        const lineChartData = [
            { color: 'blue', values: this.getArrayOfLinearY() },
            { color: 'red', values: this.getArrayOfLinearY() },
            { color: 'green', values: this.getArrayOfLinearY() },
        ];
        const lineChartDataForDisplay = lineChartData.map((item, index) => {
            return (
                <span key={index}>&nbsp;&nbsp;{JSON.stringify(item, null, 1)}<br/></span>
            );
        });
        return { lineChartData, lineChartDataForDisplay };
    }

    render() {

        const { barChartData, barChartDataForDisplay } = this.generateBarChartData();
        const { histogramData, histogramDataForDisplay } = this.generateHistogramData();
        const { scatterPlotData, scatterPlotDataForDisplay } = this.generateScatterPlotData();
        const { lineChartData, lineChartDataForDisplay } = this.generateLineChartData();

        return(
            <div>
                <h2>PlusPlot.BarChart</h2>
                <PlusPlot.BarChart
                    data={barChartData} />
                <h3>Data</h3>
                <div className="data">
                    [<br />{barChartDataForDisplay}]
                </div>

                <h2>PlusPlot.Histogram</h2>
                <PlusPlot.Histogram
                    data={histogramData} />
                <h3>Data</h3>
                <div className="data">
                    [<br />{histogramDataForDisplay}]
                </div>

                <h2>PlusPlot.ScatterPlot</h2>
                <PlusPlot.ScatterPlot
                    data={scatterPlotData} />
                <h3>Data</h3>
                <div className="data">
                    [<br />{scatterPlotDataForDisplay}]
                </div>

                <h2>PlusPlot.LineChart</h2>
                <PlusPlot.LineChart
                    data={lineChartData} />
                <h3>Data</h3>
                <div className="data">
                    [<br/>{lineChartDataForDisplay}]
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));