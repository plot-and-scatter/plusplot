const PlusPlot = require('../lib/plusplot');
const React = require('react');
const ReactDOM = require('react-dom');

function App(props) {

    // Get an integer in the range of min, max, inclusive.
    // From https://stackoverflow.com/a/1527820
    const getRandomInt = (min=1, max=9) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const getRandomXY = (min=1, max=5) => {
        return { x: getRandomInt(min, max), y: getRandomInt(min, max) };
    };

    const getArrayOfRandomXY = (length=5, min=1, max=5) => {
        const array = [];
        for (let i = 0; i < length; i++) { array.push(getRandomXY(min, max)); }
        return array;
    };

    const getArrayOfLinearY = (length=5, min=1, max=5) => {
        const array = [];
        for (let i = 0; i < length; i++) {
            array.push({ x: i, y: getRandomInt(min, max)});
        }
        return array;
    };

    const barChartData = [
        { category: 'Apples', count: getRandomInt(), color: 'rgba(0, 150, 0, 0.5)' },
        { category: 'Bananas', count: getRandomInt(), color: '#fe0' },
        { category: 'Oranges', count: getRandomInt(), color: 'orange' },
        { category: 'Raspberries', count: getRandomInt(), color: '#e25098' },
        { category: 'Strawberries', count: getRandomInt(), color: 'rgb(255, 0, 0)' },
        { category: 'Watermelons', count: getRandomInt(), color: 'green' },
    ];
    const barChartDataForDisplay = barChartData.map((item, index) => {
        return (
            <span key={index}>&nbsp;&nbsp;{JSON.stringify(item, null, 1)}<br /></span>
        );
    });

    let histogramData = [];
    for (let i = 0; i < 100; i++) { histogramData.push(getRandomInt(1, 9)); }
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

    const scatterPlotData = [];
    for (let i = 0; i < 20; i++) { scatterPlotData.push(getRandomXY(1, 9)); }
    const scatterPlotDataForDisplay = scatterPlotData.map((item, index) => {
        return (
            <span key={index}>&nbsp;&nbsp;{JSON.stringify(item, null, 1)}<br /></span>
        );
    });

    const lineChartData = [
        { color: 'blue', values: getArrayOfLinearY() },
        { color: 'red', values: getArrayOfLinearY() },
        { color: 'green', values: getArrayOfLinearY() },
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
                }}
            />
            <h3>Data</h3>
            <div className="data">
                [<br />{barChartDataForDisplay}]
            </div>

            <h2>PlusPlot.Histogram</h2>
            <PlusPlot.Histogram
                data={histogramData}
            />
            <h3>Data</h3>
            <div className="data">
                [<br />{histogramDataForDisplay}]
            </div>

            <h2>PlusPlot.ScatterPlot</h2>
            <PlusPlot.ScatterPlot
                data={scatterPlotData}
            />
            <h3>Data</h3>
            <div className="data">
                [<br />{scatterPlotDataForDisplay}]
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