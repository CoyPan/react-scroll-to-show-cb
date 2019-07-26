'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ytool = require('ytool');

var _ytool2 = _interopRequireDefault(_ytool);

var _reactDom = require('react-dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var REACT_BOUNDARY_VER = 16;
var DOM_ATTRIBUTE_KEY = 'data-rstsc-showed';

var ReactScrollToShowCb = function (_React$Component) {
    (0, _inherits3.default)(ReactScrollToShowCb, _React$Component);
    (0, _createClass3.default)(ReactScrollToShowCb, null, [{
        key: 'Update',
        value: function Update(instance) {
            instance && instance.refresh && instance.refresh.call(instance);
        }
    }]);

    function ReactScrollToShowCb(props) {
        (0, _classCallCheck3.default)(this, ReactScrollToShowCb);

        var _this = (0, _possibleConstructorReturn3.default)(this, (ReactScrollToShowCb.__proto__ || (0, _getPrototypeOf2.default)(ReactScrollToShowCb)).call(this, props));

        _this.onInitEnd = props.onInitEnd;
        _this.onScrollToShow = props.onScrollToShow;

        _this.once = props.once === undefined ? true : props.once;
        _this.async = props.async === undefined ? false : props.async;
        _this.wait = props.wait || 500;
        _this.domObjArrLock = false;
        _this.domObjArr = [];
        _this.originDomObjArr = [];
        _this.showedDomCount = 0;

        _this.reactVersion = _react2.default.version && parseInt(_react2.default.version.split('.')[0]) || REACT_BOUNDARY_VER;

        _this.handleRef = _this.handleRef.bind(_this);
        _this.handlScroll = _ytool2.default.throttle(_this.handlScroll, _this.wait).bind(_this);

        return _this;
    }

    (0, _createClass3.default)(ReactScrollToShowCb, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.updateDomArr(this.domObjArr);
            this.initScrollEvent();
            this.onInitEnd && this.onInitEnd(this);
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps, prevState) {
            if (this.async === true && _react2.default.Children.count(prevProps.children) === 0 && _react2.default.Children.count(this.props.children) !== 0) {
                this.destoryScrollEvent();
                this.updateDomArr(this.domObjArr);
                this.initScrollEvent();
            } else {
                this.destoryScrollEvent();
            }
            this.domObjArrLock = true;
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.destoryScrollEvent();
        }
    }, {
        key: 'renderChildern',
        value: function renderChildern() {
            var _this2 = this;

            return _react2.default.Children.map(this.props.children, function (element, idx) {
                return _react2.default.cloneElement(element, {
                    ref: _this2.handleRef
                });
            });
        }
    }, {
        key: 'render',
        value: function render() {
            if (this.reactVersion < REACT_BOUNDARY_VER) {
                return _react2.default.createElement(
                    'div',
                    { className: 'react-scroll-to-show-cb-wrapper' },
                    this.renderChildern()
                );
            } else {
                return this.renderChildern();
            }
        }
    }, {
        key: 'initScrollEvent',
        value: function initScrollEvent() {
            this.checkListIsInView.call(this);
            window.addEventListener('scroll', this.handlScroll);
        }
    }, {
        key: 'handlScroll',
        value: function handlScroll() {
            if (this.once && this.showedDomCount >= this.domObjArr.length) {
                return this.destoryScrollEvent();
            }
            this.checkListIsInView.call(this);
        }
    }, {
        key: 'updateDomArr',
        value: function updateDomArr(oldArr) {
            var _this3 = this;

            this.checkIsSameTypeChild();
            this.showedDomCount = 0;
            this.domObjArr = oldArr.reduce(function (sum, item) {
                if (item.dom && document.body.contains(item.dom)) {
                    var offsetTop = _ytool2.default.getOffetTop(item.dom);
                    var offsetHeight = window.parseFloat(window.getComputedStyle(item.dom)['height']);
                    var isShowed = window.parseInt(item.dom.getAttribute(DOM_ATTRIBUTE_KEY), 10) === 1;
                    isShowed && _this3.showedDomCount++;
                    sum.push({
                        dom: item.dom,
                        offsetTop: offsetTop,
                        offsetHeight: offsetHeight,
                        isShowed: isShowed
                    });
                }
                return sum;
            }, []);
        }
    }, {
        key: 'checkListIsInView',
        value: function checkListIsInView() {
            var _this4 = this;

            this.domObjArr.forEach(function (item, idx) {
                if (_this4.once) {
                    if (_this4.checkItemIsInView(item) && !item.isShowed) {
                        item.isShowed = true;
                        item.dom.setAttribute(DOM_ATTRIBUTE_KEY, 1);
                        _this4.showedDomCount++;
                        _this4.onScrollToShow && _this4.onScrollToShow(idx, item.dom);
                    }
                } else {
                    if (_this4.checkItemIsInView(item)) {
                        _this4.onScrollToShow && _this4.onScrollToShow(idx, item.dom);
                    }
                }
            });
        }
    }, {
        key: 'checkItemIsInView',
        value: function checkItemIsInView(item) {
            var scrollY = window.scrollY;
            var windowY = window.innerHeight;
            if (scrollY > item.offsetHeight + item.offsetTop || scrollY + windowY < item.offsetTop) {
                return false;
            }
            return true;
        }
    }, {
        key: 'destoryScrollEvent',
        value: function destoryScrollEvent() {
            window.removeEventListener('scroll', this.handlScroll);
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            this.updateDomArr(this.originDomObjArr);
            this.initScrollEvent();
        }
    }, {
        key: 'handleRef',
        value: function handleRef(e) {
            var dom = null;
            if (Object.prototype.toString.call(e) === '[object Object]') {
                dom = (0, _reactDom.findDOMNode)(e);
            } else {
                dom = e;
            }
            dom && this.originDomObjArr.push({
                dom: dom
            });
            this.domObjArrLock === false && dom && this.domObjArr.push({
                isShowed: false,
                dom: dom
            });
        }
    }, {
        key: 'checkIsSameTypeChild',
        value: function checkIsSameTypeChild() {
            var children = _react2.default.Children.toArray(this.props.children);
            var firstChild = children[0];
            if (!firstChild && this.async === false) {
                return this.warn('Children should not be empty');
            }
            var isSameTypeChild = children.every(function (child) {
                return child.type === firstChild.type;
            });
            if (!isSameTypeChild) {
                return this.warn('Every child should be the same type');
            }
        }
    }, {
        key: 'warn',
        value: function warn(msg) {
            throw 'react-scroll-to-show-cb: ' + msg;
        }
    }]);
    return ReactScrollToShowCb;
}(_react2.default.Component);

exports.default = ReactScrollToShowCb;
