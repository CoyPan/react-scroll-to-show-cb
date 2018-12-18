import React from 'react';
import ReactDOM from 'react-dom';

import ReactScrollToShowCb from '../lib/react-scroll-to-show-cb';

class Item extends React.Component {
    render() {
        return <div className="list-dom">Item</div>
    }
}

const ItemFunc = () => {
    return <div className="list-dom">ItemFunc</div>
}

class Test extends React.Component {
    state = {
        flag: 0
    }

    render() {
        const { flag } = this.state;
        return <div>
            <div>
                <button onClick={this.handleBtnClk.bind(this, 0)} style={flag === 0 ? { backgroundColor: '#bbb' } : {}}>单个DOM</button>
                <button onClick={this.handleBtnClk.bind(this, 1)} style={flag === 1 ? { backgroundColor: '#bbb' } : {}}>DOM数组</button>
            </div>
            {
                flag === 0 
                    ? <ReactScrollToShowCb scrollToShowCb={this.handleSingleDomShow} once={true} wait={500}>
                        <section className="single-dom"></section>
                    </ReactScrollToShowCb>
                    : <div className="list-dom-wrapper">
                        <ReactScrollToShowCb scrollToShowCb={this.handleListDomShow} once={false} wait={1000}>
                            <div className="list-dom">0</div>
                            <div className="list-dom">1</div>
                            <div className="list-dom">2</div>
                            <div className="list-dom">3</div>
                            <div className="list-dom">4</div>
                            <div className="list-dom">5</div>
                            <div className="list-dom">6</div>
                            <div className="list-dom">7</div>
                            <div className="list-dom">8</div>
                            {/* <Item />
                            <Item />
                            <Item />
                            <Item />
                            <ItemFunc />
                            <ItemFunc />
                            <ItemFunc />
                            <ItemFunc /> */}
                        </ReactScrollToShowCb>
                    </div>
            }
        </div>
    }

    handleBtnClk(flag) {
        this.setState({
            flag
        });
    }

    handleSingleDomShow() {
        console.log('single dom show');
    }

    handleListDomShow(index) {
        console.log(`list dom show: ${index}`);
    }

}


ReactDOM.render(<Test />, document.getElementById('app'));