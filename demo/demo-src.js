const PlusPlot = require('../lib/plusplot');
const React = require('react');
const ReactDOM = require('react-dom');

function App(props) {

    const barChartData = [
        { category: 'Apples', count: 3, color: 'rgba(0, 150, 0, 0.5)' },
        { category: 'Bananas', count: 5, color: '#fe0' },
        { category: 'Oranges', count: 2, color: 'orange' },
        { category: 'Raspberries', count: 9, color: '#e25098' },
        { category: 'Strawberries', count: 7, color: 'rgb(255, 0, 0)'},
        { category: 'Watermelons', count: 4, color: 'green'},
    ];
    const barChartDataForDisplay = barChartData.map((item, index) => {
        return (
            <span key={index}>&nbsp;&nbsp;{JSON.stringify(item, null, 1)}<br/></span>
        );
    });

    const randomData = [
        1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5,
        5, 5, 6, 6, 6, 6, 7, 7, 7, 8, 8, 9
    ];
    const histogramData = PlusPlot.Histogram.defaultBinning(randomData);
    histogramData.color = '#fc0';
    const histogramDataForDisplay = histogramData.map((item, index) => {
        return(
            <span key={index}>
                &nbsp;&nbsp;
                <i>x0</i>: {item.x0.toFixed(1)}&nbsp;&nbsp;
                <i>x1</i>: {item.x1.toFixed(1)}&nbsp;
                &nbsp;&nbsp;
                {JSON.stringify(item.sort(), null, 1)}
                <br/>
            </span>
        );
    });

    const scatterPlotData = [
        { x: 1, y: 3, color: 'black' }, { x: 5, y: 7 },
        { x: 3, y: 1 }, { x: 4, y: 5 },
        { x: 6, y: 5 }, { x: 6, y: 1 },
        { x: 4, y: 4 }, { x: 3, y: 8 },
        { x: 7, y: 2 }, { x: 2, y: 5 },
    ];
    const scatterPlotDataForDisplay = scatterPlotData.map((item, index) => {
        return (
            <span key={index}>&nbsp;&nbsp;{JSON.stringify(item, null, 1)}<br/></span>
        );
    });

    const lineChartData = [
        { color: 'blue', values: [ {x: 0, y: 1}, {x: 1, y: 3}, {x: 2, y: 0} ]},
        { color: 'red', values: [ {x: 0, y: 3}, {x: 1, y: 1}, {x: 2, y: 3} ]},
        { color: 'green', values: [ {x: 0, y: 4}, {x: 1, y: 3}, {x: 2, y: 1} ]},
    ];
    const lineChartDataForDisplay = lineChartData.map((item, index) => {
        return (
            <span key={index}>&nbsp;&nbsp;{JSON.stringify(item, null, 1)}<br/></span>
        );
    });

    return(
        <div>
            <h2>PlusPlot.BarChart</h2>
            <PlusPlot.BarChart
                data={barChartData}
                options={{
                    axisLabels: {
                        xAxisLabel: 'X test',
                        yAxisLabel: 'Y text'
                    }
                }}
            />
            <h3>Data</h3>
            <div className="data">
                [<br/>{barChartDataForDisplay}]
            </div>

            <h2>PlusPlot.Histogram</h2>
            <PlusPlot.Histogram
                data={histogramData}
            />
            <h3>Data</h3>
            <div className="data">
                [<br/>{histogramDataForDisplay}]
            </div>

            <h2>PlusPlot.ScatterPlot</h2>
            <PlusPlot.ScatterPlot
                data={scatterPlotData}
            />
            <h3>Data</h3>
            <div className="data">
                [<br/>{scatterPlotDataForDisplay}]
            </div>

            <h2>PlusPlot.LineChart</h2>
            <PlusPlot.LineChart
                data={lineChartData}
            />
            <h3>Data</h3>
            <div className="data">
                [<br/>{lineChartDataForDisplay}]
            </div>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));