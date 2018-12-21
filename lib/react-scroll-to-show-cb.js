import React from 'react';
import ytool from 'ytool';
import { findDOMNode } from 'react-dom';

const REACT_BOUNDARY_VER = 16;
const DOM_ATTRIBUTE_KEY = 'data-rstsc-showed';

class ReactScrollToShowCb extends React.Component {

    static Update(instance) {
        instance 
            && instance.refresh 
            && instance.refresh.call(instance);
    }

    constructor(props) {
        super(props);
        
        this.onInitEnd = props.onInitEnd;
        this.onScrollToShow = props.onScrollToShow;

        this.once = props.once === undefined ? true : props.once;
        this.async = props.async === undefined ? false : props.async;
        this.wait = props.wait || 500;
        this.domObjArrLock = false;
        this.domObjArr = [];
        this.originDomObjArr = [];
        this.showedDomCount = 0;

        this.reactVersion = React.version &&
            window.parseInt(React.version.split('.')[0]) || REACT_BOUNDARY_VER;

        this.handleRef = this.handleRef.bind(this);
        this.handlScroll = ytool.throttle(this.handlScroll, this.wait).bind(this);
        
    }


    componentDidMount() {
        this.updateDomArr(this.domObjArr);
        this.initScrollEvent();
        this.onInitEnd && this.onInitEnd(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.async === true 
                && React.Children.count(prevProps.children) === 0 
                && React.Children.count(this.props.children) !== 0) {
            this.destoryScrollEvent();
            this.updateDomArr(this.domObjArr);
            this.initScrollEvent();
        } else {
            this.destoryScrollEvent();
        }
        this.domObjArrLock = true;
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
        this.checkIsSameTypeChild();
        this.showedDomCount = 0;
        this.domObjArr = oldArr.reduce((sum, item) => {
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
                    this.onScrollToShow && this.onScrollToShow(idx, item.dom);
                }
            } else {
                if (this.checkItemIsInView(item)) {
                    this.onScrollToShow && this.onScrollToShow(idx, item.dom);
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

    refresh() {
        this.updateDomArr(this.originDomObjArr);
        this.initScrollEvent();
    }

    handleRef(e) {
        let dom = null;
        if (Object.prototype.toString.call(e) === '[object Object]') {
            dom = findDOMNode(e);
        } else {
            dom = e;
        }
        dom && this.originDomObjArr.push({
            dom
        });
        this.domObjArrLock === false && dom && this.domObjArr.push({
            isShowed: false,
            dom
        });
    }

    checkIsSameTypeChild() {
        const children = React.Children.toArray(this.props.children);
        const firstChild = children[0];
        if (!firstChild && this.async === false) {
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