import React from 'react';
import ytool from 'ytool';
import { findDOMNode } from 'react-dom';

const REACT_BOUNDARY_VER = 16;
const DOM_ATTRIBUTE_KEY = 'data-rstsc-showed';

class ReactScrollToShowCb extends React.Component {
    constructor(props) {
        super(props);

        this.scrollToShowCb = props.scrollToShowCb;
        this.once = props.once === undefined ? true : props.once;
        this.update = props.update === undefined ? false : props.update;
        this.wait = props.wait || 500;
        this.domObjArr = [];
        this.showedDomCount = 0;

        this.reactVersion = React.version &&
            window.parseInt(React.version.split('.')[0]) || REACT_BOUNDARY_VER;

        this.handleRef = this.handleRef.bind(this);
        this.handlScroll = ytool.throttle(this.handlScroll, this.wait).bind(this);
        this.checkIsSameTypeChild();
        
    }


    componentDidMount() {
        this.initScrollEvent();
    }

    componentDidUpdate(prevProps, prevState) {
        if (React.Children.count(prevProps.children) !== React.Children.count(this.props.children)) {
            this.destoryScrollEvent();
            this.initScrollEvent();
        }
    }

    componentWillUnmount() {
        this.destoryScrollEvent();
    }

    renderChildern() {
        return React.Children.map(this.props.children, (element, idx) => {
            return React.cloneElement(element, {
                ref: this.handleRef
            });
        });
    }

    render() {
        if (this.reactVersion < REACT_BOUNDARY_VER) {
            return <div className="react-scroll-to-show-cb-wrapper">
                {this.renderChildern()}
            </div>
        } else {
            return this.renderChildern();
        }
    }

    initScrollEvent() {
        this.showedDomCount = 0;
        this.domObjArr = this.updateDomArr(this.domObjArr);
        this.checkListIsInView.call(this);
        window.addEventListener('scroll', this.handlScroll);
    }

    handlScroll() {
        if (this.once && this.showedDomCount >= this.domObjArr.length) {  
            return this.destoryScrollEvent();
        }
        this.checkListIsInView.call(this);
    }

    updateDomArr(oldArr) {
        return oldArr.reduce((sum, item) => {
            if (item.dom && document.body.contains(item.dom)) {
                const offsetTop = ytool.getOffetTop(item.dom);
                const offsetHeight = window.parseFloat(window.getComputedStyle(item.dom)['height']);
                const isShowed = window.parseInt(item.dom.getAttribute(DOM_ATTRIBUTE_KEY), 10) === 1;
                isShowed && this.showedDomCount++;
                sum.push({
                    dom: item.dom,
                    offsetTop,
                    offsetHeight,
                    isShowed
                });
            }
            return sum;
        }, []);
    }

    checkListIsInView() {
        this.domObjArr.forEach((item, idx) => {
            if (this.once) {
                if (this.checkItemIsInView(item) && !item.isShowed) {
                    item.isShowed = true;
                    item.dom.setAttribute(DOM_ATTRIBUTE_KEY, 1);
                    this.showedDomCount++;
                    this.scrollToShowCb && this.scrollToShowCb(idx, item.dom);
                }
            } else {
                if (this.checkItemIsInView(item)) {
                    this.scrollToShowCb && this.scrollToShowCb(idx, item.dom);
                }
            }
        });
    }

    checkItemIsInView(item) {
        const scrollY = window.scrollY;
        const windowY = window.innerHeight;
        if (scrollY > item.offsetHeight + item.offsetTop || scrollY + windowY < item.offsetTop) {
            return false;
        }
        return true;
    }

    destoryScrollEvent() {
        window.removeEventListener('scroll', this.handlScroll);
    }


    handleRef(e) {
        let dom = null;
        if (Object.prototype.toString.call(e) === '[object Object]') {
            dom = findDOMNode(e);
        } else {
            dom = e;
        }
        dom && this.domObjArr.push({
            isShowed: false,
            dom
        });
    }

    checkIsSameTypeChild() {
        const children = React.Children.toArray(this.props.children);
        const firstChild = children[0];
        if (!firstChild && this.update === false) {
            return this.warn('Children should not be empty');
        }
        const isSameTypeChild = children.every(child => {
            return child.type === firstChild.type;
        });
        if (!isSameTypeChild) {
            return this.warn('Every child should be the same type');
        }
    }

    warn(msg) {
        throw (`react-scroll-to-show-cb: ${msg}`);
    }
}

export default ReactScrollToShowCb;