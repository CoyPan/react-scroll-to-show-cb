import React from 'react';
import ytool from 'ytool';
import { findDOMNode } from 'react-dom';

const REACT_BOUNDARY_VER = 16;

class ReactScrollToShowCb extends React.Component {
    constructor(props) {
        super(props);

        this.scrollToShowCb = props.scrollToShowCb;
        this.once = props.once === undefined ? true : props.once;
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
        this.domObjArr.forEach(item => {
            item.offsetTop = ytool.getOffetTop(item.dom);
            item.offsetHeight = window.parseFloat(window.getComputedStyle(item.dom)['height']);
        });
        this.checkListIsInView.call(this);
        window.addEventListener('scroll', this.handlScroll);
    }

    handlScroll() {
        if (this.once && this.showedDomCount === this.domObjArr.length) {  
            return this.destoryScrollEvent();
        }
        this.checkListIsInView.call(this);
    }

    checkListIsInView() {
        this.domObjArr.forEach((item, idx) => {
            if (this.once) {
                if (this.checkItemIsInView(item) && !item.isShowed) {
                    item.isShowed = true;
                    this.showedDomCount++;
                    this.scrollToShowCb && this.scrollToShowCb(idx);
                }
            } else {
                if (this.checkItemIsInView(item)) {
                    this.scrollToShowCb && this.scrollToShowCb(idx);
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
        this.handlScroll = null;
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
        if (!firstChild) {
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