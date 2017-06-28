const PlusPlot = require('../lib/plusplot');
const React = require('react');
const ReactDOM = require('react-dom');

function App(props) {

    const barChartData = [
        { category: 'Apples', count: 3},
        { category: 'Bananas', count: 5},
        { category: 'Oranges', count: 2},
        { category: 'Strawberries', count: 7},
        { category: 'Watermelons', count: 4},
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
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));