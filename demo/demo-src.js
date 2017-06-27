const PlusPlot = require('../lib/plusplot');
const React = require('react');
const ReactDOM = require('react-dom');

function App(props) {

    const barchartData = [
        { category: 'Apples', count: 3},
        { category: 'Bananas', count: 5},
        { category: 'Oranges', count: 1},
    ];

    return(
        <div>
            <h2>PlusPlot.BarChart</h2>
            <PlusPlot.BarChart data={barchartData} />
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));