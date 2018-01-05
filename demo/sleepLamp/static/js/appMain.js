/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _BaseComponentClass = __webpack_require__(2);

	var _Actions = __webpack_require__(4);

	var _Store = __webpack_require__(5);

	var _range = __webpack_require__(8);

	var _range2 = _interopRequireDefault(_range);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // import {Funs} from '../../../common/src/fun.es6';


	var _ReactRouter = ReactRouter;
	var Router = _ReactRouter.Router;
	var Route = _ReactRouter.Route;
	var hashHistory = _ReactRouter.hashHistory;


	var dataTimer = 0;

	// 接收app推送数据
	het.repaint(function (data) {
	    // var appData = Funs._extends({}, appData, data);
	    _Actions.Actions.repaint(data);
	});

	het.domReady(function () {
	    // 配置sdk
	    het.config({
	        debugMode: 'print', // 打印调试数据
	        updateFlagMap: {
	            'switchStatus': 1,
	            'sceneMode': 2,
	            'wakeMode': 3,
	            'colorTemp': 4,
	            'lightness': 5
	        },
	        renderConfigData: true
	    });
	});

	// 创建React组件

	var App = function (_BaseComponent) {
	    _inherits(App, _BaseComponent);

	    function App(props) {
	        _classCallCheck(this, App);

	        var _this2 = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

	        var isAndroid = !!(navigator.userAgent.indexOf('Android') + 1);
	        _this2.state = {
	            headerTop: isAndroid ? 73 : 64,
	            lightness: 0,
	            colorTemp: 1,
	            toastShow: false,
	            switchStatus: ''
	        };
	        _this2.listenStore(_Store.Store); // 监听Store
	        return _this2;
	    }

	    _createClass(App, [{
	        key: 'componentDidMount',
	        value: function componentDidMount() {
	            // 灯泡图片缓存处理
	            setTimeout(function () {
	                for (var i = 0; i < 14; i++) {
	                    new Image().src = '../static/img/lights/iv_led_' + i + '.png';
	                }
	            }, 500);
	        }
	    }, {
	        key: 'changeSwitch',
	        value: function changeSwitch(e) {
	            e.preventDefault();
	            var value = this.state.switchStatus == 90 ? 165 : 90; // 开关状态（90-关，165-开）
	            _Actions.Actions.changeSwitch(value);
	        }
	    }, {
	        key: 'changeMode',
	        value: function changeMode(val, e) {
	            e.preventDefault();
	            if (!this.isRunning()) return;
	            _Actions.Actions.changeMode(val);
	        }
	    }, {
	        key: 'changeLight',
	        value: function changeLight(value) {
	            if (!this.isRunning()) return;
	            _Actions.Actions.changeLight(value);
	        }
	    }, {
	        key: 'changeColor',
	        value: function changeColor(value) {
	            if (!this.isRunning()) return;
	            _Actions.Actions.changeColor(value);
	        }
	    }, {
	        key: 'closeTips',
	        value: function closeTips() {
	            this.setState({ tipsShow: false });
	        }
	    }, {
	        key: 'getRGBA',
	        value: function getRGBA(colorTemp, lightness) {
	            var rgbs = [[0, 0, 0], [255, 0, 0], [255, 255, 0], [0, 255, 0], [0, 200, 0], [0, 180, 0], [0, 255, 255], [0, 180, 255], [0, 140, 220], [0, 60, 230], [100, 0, 220], [255, 0, 255], [200, 0, 200], [100, 160, 255]];
	            var rgb = rgbs[colorTemp || 0];
	            lightness = !colorTemp ? 0 : lightness; // 当色温为0时，亮度也为零
	            return 'rgba(' + rgb + ', ' + (lightness || 0) / 10 + ')';
	        }
	    }, {
	        key: 'isRunning',
	        value: function isRunning() {
	            return this.state.switchStatus == 165; // 开关状态（90-关，165-开）
	        }
	    }, {
	        key: 'showToast',
	        value: function showToast() {
	            var _this = this;
	            clearTimeout(window.timer);
	            if (this.state.sceneMode == 1) {
	                this.setState({
	                    toastShow: true
	                });
	                window.timer = setTimeout(function () {
	                    _this.setState({
	                        toastShow: false
	                    });
	                }, 3000);
	            };
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var isRunning = this.isRunning();
	            var cssColor = isRunning ? this.getRGBA(this.state.colorTemp, this.state.lightness) : 'rgba(255, 255, 255, 0)';
	            var imgIndex = isRunning ? this.state.lightness == '0' ? 0 : isRunning && this.state.sceneMode == 1 ? 0 : this.state.colorTemp : 0;
	            return React.createElement(
	                'div',
	                null,
	                React.createElement(
	                    'header',
	                    { style: { paddingTop: this.state.headerTop + 'px' } },
	                    React.createElement(
	                        'p',
	                        { className: 'tips', style: { visibility: this.state.tips && this.state.tipsShow ? 'visible' : 'hidden' }, onTouchStart: this.closeTips.bind(this) },
	                        this.state.tips
	                    ),
	                    React.createElement(
	                        'figure',
	                        null,
	                        React.createElement('img', { src: '../static/img/lights/iv_led_' + imgIndex + '.png' }),
	                        React.createElement('img', { className: 'light_img', style: { opacity: 1 - this.state.lightness / 10 }, src: '../static/img/lights/iv_led_0.png' })
	                    ),
	                    React.createElement('a', { href: '#', onTouchStart: this.changeSwitch.bind(this), className: 'switch' })
	                ),
	                React.createElement(
	                    'section',
	                    { className: 'flex fn-wrap' },
	                    React.createElement(
	                        'a',
	                        { href: '#', 'data-val': '1', onTouchStart: this.changeMode.bind(this, 0), className: 'flex-cell fn-read ' + (isRunning && this.state.sceneMode == 1 ? 'active' : '') },
	                        '\u9605\u8BFB'
	                    ),
	                    React.createElement(
	                        'a',
	                        { href: '#', 'data-val': '2', onTouchStart: this.changeMode.bind(this, 1), className: 'flex-cell fn-rest ' + (isRunning && this.state.sceneMode == 2 ? 'active' : '') },
	                        '\u4F11\u606F'
	                    ),
	                    React.createElement(
	                        'a',
	                        { href: '#', 'data-val': '3', onTouchStart: this.changeMode.bind(this, 2), className: 'flex-cell fn-light ' + (isRunning && this.state.sceneMode == 3 ? 'active' : '') },
	                        '\u591C\u706F'
	                    )
	                ),
	                React.createElement(
	                    'h2',
	                    null,
	                    '\u4EAE\u5EA6'
	                ),
	                React.createElement(
	                    'section',
	                    { className: 'flex light-range-wrap' },
	                    React.createElement('i', { className: 'l-low' }),
	                    React.createElement(
	                        'div',
	                        { className: 'flex-cell' },
	                        React.createElement(_range2.default, { disabled: !isRunning, value: this.state.lightness, max: '10', min: '0', fnFeedback: this.changeLight.bind(this) })
	                    ),
	                    React.createElement('i', { className: 'l-high' })
	                ),
	                React.createElement(
	                    'h2',
	                    null,
	                    '\u989C\u8272'
	                ),
	                React.createElement(
	                    'section',
	                    { className: 'color-range-wrap' + (this.state.sceneMode == 1 ? ' off' : ''), onTouchEnd: this.showToast.bind(this) },
	                    React.createElement(_range2.default, { disabled: !isRunning || this.state.sceneMode == 1, value: this.state.colorTemp, max: '13', min: '1', fnFeedback: this.changeColor.bind(this) })
	                ),
	                React.createElement('div', { className: isRunning ? '' : 'shutdownFace' }),
	                React.createElement(
	                    'div',
	                    { style: { display: this.state.toastShow ? 'block' : 'none' }, className: 'toast-cover' },
	                    React.createElement(
	                        'div',
	                        { className: 'toast' },
	                        '\u9605\u8BFB\u6A21\u5F0F\u989C\u8272\u4E0D\u80FD\u8C03\u8282\u54E6'
	                    )
	                )
	            );
	        }
	    }]);

	    return App;
	}(_BaseComponentClass.BaseComponent);

	// 开始渲染


	het.domReady(function () {
	    het.setTitle('舒眠灯');
	    // 无路由方式
	    // ReactDOM.render(<App />, document.getElementById('ROOT'));

	    // 路由方式
	    ReactDOM.render(React.createElement(
	        Router,
	        { history: hashHistory },
	        React.createElement(Route, { path: '/', component: App })
	    ), document.getElementById('ROOT'));
	});

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _BaseComponentClass = __webpack_require__(3);

	Object.defineProperty(exports, 'BaseComponent', {
	  enumerable: true,
	  get: function get() {
	    return _BaseComponentClass.BaseComponent;
	  }
	});

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var BaseComponent = exports.BaseComponent = function (_React$Component) {
	    _inherits(BaseComponent, _React$Component);

	    function BaseComponent(props) {
	        _classCallCheck(this, BaseComponent);

	        var _this = _possibleConstructorReturn(this, (BaseComponent.__proto__ || Object.getPrototypeOf(BaseComponent)).call(this, props));

	        var originComponentDidMount = _this.componentDidMount; // 接管子类方法
	        var originComponentWillUnmount = _this.componentWillUnmount; // 接管子类方法
	        _this.state = {};
	        _this._isMounted = false;
	        // 重定义子类componentDidMount
	        _this.componentDidMount = function () {
	            _this.superComponentDidMount();
	            if (typeof originComponentDidMount === 'function') {
	                originComponentDidMount.call(_this);
	            }
	        };
	        // 重定义子类componentWillUnmount
	        _this.componentWillUnmount = function () {
	            _this.superComponentWillUnmount();
	            if (typeof originComponentWillUnmount === 'function') {
	                originComponentWillUnmount.call(_this);
	            }
	        };
	        return _this;
	    }

	    /**
	     * 监听Store通用方法
	     * @param    {object}   store   Reflux之Store对象
	     */


	    _createClass(BaseComponent, [{
	        key: 'listenStore',
	        value: function listenStore(store) {
	            var _this2 = this;

	            store.listen(function (data) {
	                if (_this2.isMounted()) {
	                    _this2.setState(data);
	                }
	            });
	        }
	        // 基类DidMount方法

	    }, {
	        key: 'superComponentDidMount',
	        value: function superComponentDidMount() {
	            this._isMounted = true;
	        }
	        // 基类WillUnmount方法

	    }, {
	        key: 'superComponentWillUnmount',
	        value: function superComponentWillUnmount() {
	            this._isMounted = false;
	        }
	        // 判断组件是否已挂载

	    }, {
	        key: 'isMounted',
	        value: function isMounted() {
	            return this._isMounted;
	            // exceptions for flow control :(
	            /*if (!this._isMounted) {
	                try {
	                    ReactDOM.findDOMNode(this);
	                    this._isMounted = true;
	                } catch (e) {
	                    // Error: Invariant Violation: Component (with keys: props,context,state,refs,_reactInternalInstance) contains `render` method but is not mounted in the DOM
	                    this._isMounted = false;
	                } 
	            }
	            return this._isMounted;*/
	        }
	    }]);

	    return BaseComponent;
	}(React.Component);

	;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	/**
	 * 公共Actions，所有action均需统一在此文件登记，以防重名造成store冲突
	 * @type {actions}
	 */

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var Actions = exports.Actions = Reflux.createActions(['repaint', // 拉取数据
	'changeSwitch', // 调节模式
	'changeMode', // 调节模式
	'changeLight', // 调节亮度
	'changeColor']);

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * 公共store，建议所有store事件都在此文件定义
	 * ! 注意，Store方法不能使用箭头函数，否则将报this未定义
	 * @type {store}
	 */

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Store = undefined;

	var _Actions = __webpack_require__(4);

	var _fun = __webpack_require__(6);

	// 数据过滤计时器
	var dataFilterTimers = {
	    switchStatus: 0,
	    sceneMode: 0,
	    lightness: 0,
	    colorTemp: 0
	};
	var lightTimer = 0; // 亮度计时器，防止操作过频繁
	var colorTimer = 0; // 色温计时器，防止操作过频繁

	// 返回过滤后的数据
	function dataFilter(data) {
	    var time = new Date().getTime();
	    var result = {};
	    for (var k in data) {
	        if (typeof dataFilterTimers[k] !== 'undefined') {
	            if (dataFilterTimers[k] < time) {
	                dataFilterTimers[k] = 0;
	                result[k] = data[k];
	            }
	        } else {
	            result[k] = data[k];
	        }
	    }
	    return result;
	}

	// 设置过滤器过期时间
	function setDataTimer() {
	    var time = new Date().getTime() + 10e3; // 10秒内不接收新数据

	    for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {
	        keys[_key] = arguments[_key];
	    }

	    for (var i in keys) {
	        dataFilterTimers[keys[i]] = time;
	    }
	}

	var Store = exports.Store = Reflux.createStore({
	    listenables: [_Actions.Actions],
	    onRepaint: function onRepaint(data) {
	        if (data) {
	            data.tips = '';
	            data.tipsShow = false;
	            if (data.onlineStatus && data.onlineStatus != 0) {
	                data.tips = '设备不在线';
	                data.tipsShow = true;
	            }
	            this.trigger(dataFilter(data));
	        } else if (data.msg) {
	            this.trigger({ tips: json.msg, tipsShow: true });
	        }
	    },
	    onChangeSwitch: function onChangeSwitch(value) {
	        setDataTimer('switchStatus');
	        this.trigger({ switchStatus: value });
	        het.send({ switchStatus: value }, function (res) {

	            if (res.code === 0) {
	                console.log('调节开关成功');
	            }
	        });
	    },
	    onChangeMode: function onChangeMode(value) {
	        var modes = [{ colorTemp: 0, lightness: 10, sceneMode: 1 }, { colorTemp: 2, lightness: 8, sceneMode: 2 }, { colorTemp: 1, lightness: 2, sceneMode: 3 }];
	        setDataTimer('colorTemp', 'lightness', 'sceneMode');
	        this.trigger(modes[value]);
	        het.send(modes[value], function (res) {
	            if (res.code === 0) {
	                console.log('调节模式成功');
	            }
	        });
	    },
	    onChangeLight: function onChangeLight(value) {
	        clearTimeout(lightTimer);
	        lightTimer = setTimeout(function () {
	            het.send({ lightness: value }, function (res) {
	                if (res.code === 0) {
	                    console.log('调节亮度成功');
	                }
	            });
	        }, 600);
	        setDataTimer('lightness');
	        this.trigger({ lightness: value });
	    },
	    onChangeColor: function onChangeColor(value) {
	        clearTimeout(colorTimer);
	        colorTimer = setTimeout(function () {
	            het.send({ colorTemp: value }, function (res) {
	                if (res.code === 0) {
	                    console.log('调节色温成功');
	                }
	            });
	        }, 600);
	        setDataTimer('colorTemp');
	        this.trigger({ colorTemp: value });
	    }
	});

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Funs = undefined;

	var _fun = __webpack_require__(7);

	var _fun2 = _interopRequireDefault(_fun);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.Funs = _fun2.default;

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	var Funs = {
	    /*
	        * 获取url参数
	        * sName ：参数名
	        * return : 返回参数值（没有的时候返回空）
	        */
	    getUrlParam: function getUrlParam(sName) {
	        var reg = new RegExp("(^|&)" + sName + "=([^&]*)(&|$)", "i");
	        var r = window.location.search.substr(1).match(reg);
	        if (r != null) return decodeURIComponent(r[2]); // (r[2]);
	        return "";
	    },

	    /**
	     * 合并对象
	     * target  target 对象
	     * return 合并后对象 
	     */
	    _extends: function _extends(target) {
	        for (var i = 1; i < arguments.length; i++) {
	            var source = arguments[i];
	            for (var key in source) {
	                if (Object.prototype.hasOwnProperty.call(source, key)) {
	                    target[key] = source[key];
	                }
	            }
	        }
	        return target;
	    }, // 公共函数模块
	    /**
	     * 格式化时间函数
	     * @param    {string}   date   日期字符串或时间戳
	     * @param    {string}   format 格式，缺省为：yyyy-MM-dd hh:mm:ss
	     * @param    {Boolean}  isUTC  是否UTC时间，如传入为UTC时间，将自动转为本地时间
	     * @return   {string}          按format格式输出日期
	     */
	    dateFormat: function dateFormat(date, format, isUTC) {
	        var timezoneOffset = 0;
	        var dateObj = new Date(date);
	        var patt = /^(?:(\d+)-(\d+)-(\d+))?\s?(?:(\d+):(\d+):(\d+))?$/;
	        var dateArr;
	        var now = new Date();
	        // IOS 解析失败时尝试手动解析
	        if (dateObj.toString() === 'Invalid Date' && typeof date === 'string') {
	            dateArr = date.match(patt) || [];
	            dateObj = new Date(dateArr[1] || now.getFullYear(), dateArr[2] - 1 || now.getMonth(), dateArr[3] || now.getDate(), dateArr[4] || now.getHours(), dateArr[5] || now.getMinutes(), dateArr[6] || now.getSeconds());
	        }
	        format = format || 'yyyy-MM-dd hh:mm:ss';
	        if (isUTC) {
	            // 处理utc时间
	            timezoneOffset = new Date().getTimezoneOffset();
	            dateObj.setMinutes(dateObj.getMinutes() - timezoneOffset);
	        }
	        var map = {
	            'M': dateObj.getMonth() + 1, //月份 
	            'd': dateObj.getDate(), //日 
	            'h': dateObj.getHours(), //小时 
	            'm': dateObj.getMinutes(), //分 
	            's': dateObj.getSeconds(), //秒 
	            'q': Math.floor((dateObj.getMonth() + 3) / 3), //季度 
	            'S': dateObj.getMilliseconds() //毫秒 
	        };
	        format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
	            var v = map[t];
	            if (v !== undefined) {
	                if (all.length > 1) {
	                    v = '0' + v;
	                    v = v.substr(v.length - 2);
	                }
	                return v;
	            } else if (t === 'y') {
	                return (dateObj.getFullYear() + '').substr(4 - all.length);
	            }
	            return all;
	        });
	        return format;
	    },
	    /**
	     * [dateFormatFull description]
	     * @param  {[type]} dateTime [时间戳]
	     * @param  {[type]} type     [“-”] 返回2016-07-30   [“month”] 返回2016-07    [“day”] 返回 日   
	     * @param  {[type]} flag     [1]  返回12：30
	     * @return {[type]}          [description]
	     */
	    dateFormatFull: function dateFormatFull(dateTime, type, flag) {
	        var d = new Date(dateTime * 1000),
	            y = d.getFullYear(),
	            m = d.getMonth() + 1,
	            day = d.getDate(),
	            h = d.getHours(),
	            mn = d.getMinutes(),
	            s = d.getSeconds(),
	            res;
	        m = m > 9 ? m : '0' + m;
	        day = day > 9 ? day : '0' + day;
	        h = h > 9 ? h : '0' + h;
	        mn = mn > 9 ? mn : '0' + mn;
	        s = s > 9 ? s : '0' + s;
	        if (type === '-') {
	            res = y + '-' + m + '-' + day;
	            if (flag) {
	                res = h + ':' + mn;
	            }
	        } else if (type === 'month') {
	            res = y + '-' + m;
	        } else if (type === 'day') {
	            res = d.getDate();
	        } else if (type === 'full') {
	            res = y + '-' + m + '-' + day + " " + h + ':' + mn;
	        }
	        return res;
	    },
	    /**
	     * [utcToLocal utc时间转换为本地时间]
	     * @param  {[type]} utc [utc 时间 格式为‘2016-06-06 12:12:12’]
	     * @param  {[type]} type [返回格式  1：时+分 ]
	     * @return {[type]}     [description]
	     */
	    utcToLocal: function utcToLocal(utc, type) {
	        var utcDay = utc.split(' '),
	            utcDate = utcDay[0].split('-'),
	            utcTime = utcDay[1].split(':'),
	            timestamp = Math.round(Date.UTC(utcDate[0], utcDate[1] - 1, utcDate[2], utcTime[0], utcTime[1], utcTime[2]) / 1000),
	            time = this.dateFormatFull(timestamp, "full");
	        if (type == 1) {
	            time = this.dateFormatFull(timestamp, "-", 1);
	        }
	        return time;
	    },
	    timestampToUtc: function timestampToUtc(timestamp, type) {
	        var d = new Date(timestamp * 1000),
	            y = d.getUTCFullYear(),
	            m = d.getUTCMonth() + 1,
	            day = d.getUTCDate(),
	            h = d.getUTCHours(),
	            mn = d.getUTCMinutes(),
	            s = d.getUTCSeconds(),
	            res;
	        m = m > 9 ? m : '0' + m;
	        day = day > 9 ? day : '0' + day;
	        h = h > 9 ? h : '0' + h;
	        mn = mn > 9 ? mn : '0' + mn;
	        s = s > 9 ? s : '0' + s;
	        if (type === '-') {
	            res = y + '-' + m + '-' + day + " " + h + ':' + mn + ':' + s;
	        }
	        return res;
	    },
	    // 设置cookies
	    setCookie: function setCookie(name, value) {
	        var Days = 30;
	        var exp = new Date();
	        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
	        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
	    },
	    // 获取cookies
	    getCookie: function getCookie(name) {
	        var arr,
	            reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	        if (arr = document.cookie.match(reg)) return unescape(arr[2]);else return null;
	    },
	    // 删除cookies
	    delCookie: function delCookie(name) {
	        var exp = new Date();
	        exp.setTime(exp.getTime() - 1);
	        var cval = getCookie(name);
	        if (cval !== null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/";
	    }
	};
	module.exports = Funs;

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * 滑动选择器组件
	 * @prop {integer}  value       传入初始值
	 * @prop {function} fnFeedback  用于接收处理结果的函数
	 * @prop {integer}  min         可选，最小值，缺省为0
	 * @prop {integer}  max         可选，最大值，缺省为100
	 * @prop {boolean}  disabled    可选，是否可以点击
	 */
	var Range = React.createClass({
	    displayName: "Range",

	    getInitialState: function getInitialState() {
	        return {};
	    },
	    min: function min() {
	        return this.props.min || "0";
	    },
	    max: function max() {
	        return this.props.max || "100";
	    },
	    // 定位
	    pos: function pos(value) {
	        var wrap = ReactDOM.findDOMNode(this.refs["wrap"]);
	        var cursor = ReactDOM.findDOMNode(this.refs["cursor"]);
	        var rate = (value - this.min()) / (this.max() - this.min()); // 比率
	        var left = (wrap.offsetWidth - cursor.offsetWidth) / 100 * rate * 100;
	        cursor.style.left = left + "px";
	    },
	    handlerChange: function handlerChange(e) {
	        var value = parseInt(e.target.value);
	        this.setState({ value: value });
	        if (typeof this.props.fnFeedback === "function") {
	            this.props.fnFeedback(value); // 反馈处理结果
	        }
	    },
	    componentDidUpdate: function componentDidUpdate() {
	        var value = typeof this.state.value !== "undefined" && this.oldPropValue === this.props.value ? this.state.value : this.props.value;
	        this.oldPropValue = this.props.value; // oldPropValue用于比较prop修改时的状态
	        this.state.value = value; // 强行保持state与value同步
	        this.pos(value);
	    },
	    componentDidMount: function componentDidMount() {
	        this.componentDidUpdate();
	    },
	    render: function render() {
	        var value = typeof this.state.value !== "undefined" && this.oldPropValue === this.props.value ? this.state.value : this.props.value;
	        return React.createElement(
	            "div",
	            { className: "__range" },
	            React.createElement(
	                "label",
	                { ref: "wrap" },
	                React.createElement("input", { type: "range", min: this.min(), max: this.max(), onChange: this.handlerChange, value: value, disabled: this.props.disabled ? "disabled" : "" }),
	                React.createElement(
	                    "i",
	                    { ref: "cursor", className: "cursor" },
	                    value
	                )
	            )
	        );
	    }
	});

	module.exports = Range;

/***/ }
/******/ ]);