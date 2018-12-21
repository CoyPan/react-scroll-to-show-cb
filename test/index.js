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
        flag: 1,
        list: []
    }

    constructor() {
        super();
        this.asyncFlag = 0;

        this.handleInitEnd = this.handleInitEnd.bind(this);
        this.handleIncreaseClick = this.handleIncreaseClick.bind(this);
        this.handleDecreaseClick = this.handleDecreaseClick.bind(this);
        this.handleChangeClick = this.handleChangeClick.bind(this);
    }

    getJSX() {
        let jsx = null;
        switch (this.state.flag) {
            case 1:
                jsx = <div className="list-dom-wrapper">
                    <ReactScrollToShowCb
                        onScrollToShow={this.handleListDomShow}
                        once={false}
                        wait={1000}>
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
                break;
            case 2:
                jsx = <ReactScrollToShowCb
                    onScrollToShow={this.handleListDomShow}
                    onInitEnd={this.handleInitEnd}
                    once={true}
                    wait={1000}
                    async={true}>
                    {this.state.list.map((item, idx) => {
                        if(item === 2){
                            return <p key={idx} className="list-dom">{`changedom-${idx}`}</p>
                        }
                        return <div key={idx} className="list-dom">{`async-${idx}`}</div>
                    })}
                </ReactScrollToShowCb>
                break;
            default:
                break;
        }
        return jsx;
    }

    render() {
        const { flag } = this.state;
        return <div>
            <div>
                <button onClick={this.handleBtnClk.bind(this, 1)} style={flag === 1 ? { backgroundColor: '#bbb' } : {}}>async = 0</button>
                <button onClick={this.handleBtnClk.bind(this, 2)} style={flag === 2 ? { backgroundColor: '#bbb' } : {}}>async = 1</button>
            </div>
            <div style={flag === 2 ? {display:'block'} : {display: 'none'}}>
                <button onClick={this.handleIncreaseClick}>Increase child</button>
                <button onClick={this.handleDecreaseClick}>Decrease child</button>
                <button onClick={this.handleChangeClick}>Change child</button>
            </div>
            {this.getJSX()}
        </div>
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.flag === 1 && this.state.flag === 2 && !this.asyncFlag) {
            this.asyncFlag = 1;
            setTimeout(() => {
                this.setState({
                    list: [1, 1, 1, 1, 1]
                })
            }, 1000);
        }
    }

    handleBtnClk(flag) {
        this.setState({
            flag
        });
    }

    handleInitEnd(instance) {
        this.scollInstance = instance;
        console.log(instance);
    }

    handleIncreaseClick() {
        this.setState({
            list: this.state.list.concat([1])
        }, () => {
            ReactScrollToShowCb.Update(this.scollInstance);
        });
    }

    handleDecreaseClick(){
        this.setState({
            list: this.state.list.slice(1)
        });
    }

    handleChangeClick() {
        this.setState({
            list: this.state.list.slice(0, this.state.list.length - 1).concat([2])
        });
    }

    handleListDomShow(index, dom) {
        console.log('--------------------------');
        console.log(`index: ${index}`);
        console.log('dom:', dom);
        console.log('--------------------------');
    }

}


ReactDOM.render(<Test />, document.getElementById('app'));