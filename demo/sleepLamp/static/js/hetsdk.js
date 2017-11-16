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

	module.exports = __webpack_require__(8);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(9); // iOS最新框架补丁
	__webpack_require__(10);

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Hetsdk iOS-patch v1.0.1
	 * Copyright: Shenzhen H&T Intelligent Control Co., Ltd.
	 * Date: 2016-11-31
	 */

	;(function () {
	    if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.bindJavaScript && window.webkit.messageHandlers.bindJavaScript.postMessage) {
	        (function () {
	            var callOC = function callOC(func, params) {
	                var url = 'func=' + func + ':';
	                for (var i = 0; i < params.length; i++) {
	                    url = url + '&' + params[i].key + '=' + encodeURIComponent(params[i].value);
	                }
	                window.webkit.messageHandlers.bindJavaScript.postMessage(url);
	            };

	            window.bindJavaScript = {
	                config: function config(data) {
	                    var data = [{ key: 'data', value: data }];
	                    callOC('config', data);
	                },
	                send: function send(dataString, sucCallbackId, errCallbackId) {
	                    var data = [{ key: 'data', value: dataString }, { key: 'sucCallbackId', value: sucCallbackId }, { key: 'errCallbackId', value: errCallbackId }];
	                    callOC('send', data);
	                },
	                setTitle: function setTitle(title) {
	                    var data = [{ key: 'data', value: title }];
	                    callOC('setTitle', data);
	                },
	                tips: function tips(msg) {
	                    var data = [{ key: 'data', value: msg }];
	                    callOC('tips', data);
	                },
	                relProxyHttp: function relProxyHttp(path, dataString, type, sucCallbackId, errCallbackId, needSign) {
	                    var data = [{ key: 'url', value: path }, { key: 'data', value: dataString }, { key: 'type', value: type }, { key: 'sucCallbackId', value: sucCallbackId }, { key: 'errCallbackId', value: errCallbackId }, { key: 'needSign', value: needSign }];
	                    callOC('relProxyHttp', data);
	                },
	                absProxyHttp: function absProxyHttp(path, dataString, type, sucCallbackId, errCallbackId) {
	                    var data = [{ key: 'url', value: path }, { key: 'data', value: dataString }, { key: 'type', value: type }, { key: 'sucCallbackId', value: sucCallbackId }, { key: 'errCallbackId', value: errCallbackId }];
	                    callOC('absProxyHttp', data);
	                }
	            };
	        })();
	    }
	})();

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	/**
	 * Hetsdk v1.2
	 * Copyright: Shenzhen H&T Intelligent Control Co., Ltd.
	 * Date: 2016-05-06
	 */

	window.het = function () {
	    'use strict';

	    var appInterfaceNS = 'bindJavaScript'; // app注入接口的命名空间
	    var webInterfaceNS = 'webInterface'; // web暴露给app调用接口的命名空间
	    function HET() {
	        // 默认配置
	        var settings = {
	            callbackExpire: 30000, // 回调函数超时时间，
	            torporTime: 5000, // 迟钝时间，当调用send方法之后，忽略所有在该时间内接收到的repaint请求
	            webDataMap: {}, // web <-> app数据映射表，缺省不映射
	            useUpdateFlag: false, // （该参数将弃用，为兼容旧版，暂时保留）是否自动添加updateFlag标记，缺省不添加
	            updateFlagMap: {}, // 配置updateFlag标记映射表，缺省为空
	            onceConfigData: true, // 只接受一次控制数据
	            renderConfigData: false, // 控制数据是否用于页面渲染，缺省不渲染
	            filter: {}, // 过滤器
	            debugMode: '' // 开启debug，缺省不开启，目前可选模式为print
	        };
	        var $this = this;
	        var __AppInterface = window[appInterfaceNS] || {}; // 接入APP接口
	        var readyFuncList = []; // 准备就绪后将执行的函数列表
	        var repaintFuncList = []; // 响应repaint请求的函数列表
	        var callbackList = {}; // 回调函数表
	        var defaultCallbackId = register(print, true); // 缺省回调ID
	        var appCommandData = {}; // app控制数据，send接口采用此格式发送数据
	        var appCommandTime = 0; // app控制数据计时器，配合settings.torporTime使用

	        /**
	         * 通知app开始初始化
	         * @param  {json}     options 配置信息及提交给app的初始化信息
	         * @return {Function}         返回值由app决定，该值为非必须值
	         */
	        $this.config = function (options) {
	            var data = {};
	            for (var k in options) {
	                if (typeof settings[k] !== 'undefined') {
	                    settings[k] = options[k]; // 检出本地配置信息
	                } else {
	                    data[k] = options[k]; // 非本地配置信息，发送至APP
	                }
	            }
	            data = JSON.stringify(data);
	            return typeof __AppInterface.config === 'function' && __AppInterface.config(data);
	        };

	        /**
	         * 准备就绪时将执行该方法登记的函数
	         * @param  {Function} callback 欲登记的回调函数
	         */
	        $this.ready = function (callback) {
	            readyFuncList.push(register(callback, true));
	        };

	        /**
	         * 登记网页加载完成时调用的函数
	         * @param {Function} callback 欲登记的回调函数
	         */
	        $this.domReady = function (callback) {
	            document.addEventListener('DOMContentLoaded', callback);
	        };

	        /**
	         * 登记接收APP方repaint推送数据的函数
	         * @param  {Function} callback 回调函数
	         */
	        $this.repaint = function (callback) {
	            repaintFuncList.push(register(callback, true));
	        };

	        /**
	         * 发送数据至app
	         * @param  {json}     data        要提交给app的数据，json格式
	         * @param  {function} sucCallback 可选，app处理成功时的回调函数
	         * @param  {function} errCallback 可选，app处理异常时的回调函数
	         * @return {Function}             返回值由app决定，该值为非必须值
	         */
	        $this.send = function (data, sucCallback, errCallback) {
	            if (typeof appCommandData.updateFlag !== 'undefined') {
	                appCommandData.updateFlag = 0; // updateFlag清零以便重新计算
	            }
	            var sucCallbackId = register(sucCallback); // 登记成功时的回调
	            var errCallbackId = register(errCallback); // 登记异常时的回调
	            var dataString = JSON.stringify(commandData(data, true)); // 把运行数据替换为控制数据发送
	            appCommandTime = +new Date(); // 重置控制数据计时器
	            if (settings.debugMode == 'print') {
	                print('send:', dataString);
	            }
	            return typeof __AppInterface.send === 'function' && dataString != '{}' && __AppInterface.send(dataString, sucCallbackId, errCallbackId);
	        };

	        /**
	         * 请求app代理get方式的http请求
	         * @param    {string}   url         请求地址
	         * @param    {json}     data        可选，发送的数据，要求json格式
	         * @param    {function} sucCallback 可选，成功时的回调函数
	         * @param    {function} errCallback 可选，失败时的回调函数
	         * @param    {integer}  needSign    可选，接口是否需要签名
	         */
	        $this.get = function (url, data, sucCallback, errCallback, needSign) {
	            proxyHttp(url, data, 'GET', sucCallback, errCallback, needSign);
	        };

	        /**
	         * 请求app代理post方式的http请求
	         * 参数说明同$this.get
	         */
	        $this.post = function (url, data, sucCallback, errCallback, needSign) {
	            proxyHttp(url, data, 'POST', sucCallback, errCallback, needSign);
	        };

	        /**
	         * 与控制数据进行对比
	         * @param    {json}   jsonData 接收格式形为：{key1:value1,key2:value2,...}
	         * @return   {json}            返回对比后的差集
	         */
	        $this.diff = function (jsonData) {
	            var data = webToAppData(jsonData);
	            var result = {};
	            for (var k in data) {
	                if (typeof appCommandData[k] !== 'undefined' && data[k] != appCommandData[k]) {
	                    result[k] = data[k];
	                }
	            }
	            return appToWebData(result);
	        };

	        /**
	         * 设置页面标题
	         * @param {string} title 标题
	         */
	        $this.setTitle = function (title) {
	            if (typeof __AppInterface.setTitle === 'function') {
	                __AppInterface.setTitle(title);
	            }
	            document.title = title;
	        };

	        /**
	         * 计算updateFlag值
	         * @param  {Integer} offset 偏移量（二进制位）
	         * @return {Integer}        返回十进制计算结果
	         */
	        $this.calcUpdateFlag = function (offset) {
	            return Math.pow(2, offset - 1);
	        };

	        /**
	         * 计算16进制updateFlag值
	         * @param    {integer}   index        功能位索引值
	         * @param    {integer}   length       功能字节长度
	         * @param    {integer}   upLength     upFlag字节长度
	         * @param    {string}    originUpFlag 可选，原始updateFlag值
	         * @return   {string}                 16进制字符串
	         */
	        $this.hexUpFlag = function (index, length, upLength, originUpFlag) {
	            var upHex = (originUpFlag || 0).toString(16).replace(/(?=\b\w\b)/, '0'); // 确保upFlag为16进制
	            var upArr = []; // 原始upFlag的decArray表达
	            var orBin = ''; // 用于或运算的二进制字符串
	            var orArr; // orBin的decArray表达
	            var reArr = []; // 计算结果的decArray表达
	            length = length || 1;
	            upLength = upLength || 4;
	            // 计算原始upFlag的decArray表达
	            for (var h = 0; h < upHex.length; h += 2) {
	                upArr.push(parseInt(upHex.substring(h, h + 2), 16));
	            }
	            // 移位
	            for (var i = 0; i < index; i++) {
	                orBin = '0' + orBin;
	            }
	            // 填1
	            for (var j = 0; j < length; j++) {
	                orBin = '1' + orBin;
	            }
	            orArr = bin2DecArray(orBin);
	            // 开始计算
	            for (var k = 0; k < upArr.length || k < orArr.length || k < upLength; k++) {
	                reArr.push((upArr[k] || 0) | (orArr[k] || 0));
	            }
	            return decArray2Hex(reArr);
	        };

	        /**
	         * 调用系统toast
	         * @param    {string}   msg 提示信息
	         * @return   {[type]}       返回值由app决定
	         */
	        $this.toast = function (msg) {
	            return typeof __AppInterface.tips === 'function' ? __AppInterface.tips(msg) : alert(msg);
	        };

	        /**
	         * 登记回调函数，以供jssdk回调
	         * @param  {Function} callback 需要登记的回调函数
	         * @param  {boolean}  persist  可选，是否永久回调，缺省为false
	         * @param  {Integer}  expire   可选，指定临时回调有效期，以便回收，缺省为30秒
	         *                             注：该有效期用于回收从未被调用过的临时回调
	         * @return {string}            登记后返回一个唯一的ID
	         */
	        function register(callback, persist, expire) {
	            var timestamp = +new Date();
	            var id = 'CB_' + timestamp.toString().slice(5) + Math.floor(Math.random() * 10000);
	            if (typeof callback === 'function') {
	                persist = persist || false;
	                expire = typeof expire === 'undefined' ? settings.callbackExpire : expire;
	                callbackList[id] = {
	                    fun: callback,
	                    persist: persist,
	                    expire: persist ? 0 : timestamp + expire
	                };
	                return id;
	            } else {
	                return defaultCallbackId;
	            }
	        }

	        /**
	         * 执行回调函数
	         * @param  {string}   id   之前已通过register登记的回调函数id
	         * @param  {array}    args 参数数组
	         * @return {Function}      调用登记过的回调函数并返回结果
	         */
	        function execCallback(id, args) {
	            var result;
	            var timestamp = +new Date();
	            if (_typeof(callbackList[id]) === 'object') {
	                if ((callbackList[id].persist ? true : callbackList[id].expire > timestamp) && typeof callbackList[id].fun === 'function') {
	                    result = callbackList[id].fun.apply(null, args);
	                } else {
	                    print('%cError: Callback Time-out', 'color:red');
	                }
	                delCallback(id); // 临时回调只调用一次
	            }
	            gc();
	            return result;
	        }

	        /**
	         * 执行$this.ready方法登记的函数
	         */
	        function execReadyFuncList(data) {
	            while (readyFuncList.length) {
	                execCallback(readyFuncList.shift(), [data]);
	            }
	            return true;
	        }

	        /**
	         * 执行$this.repaint方法登记的函数
	         */
	        function execRepaintFuncList(type, data) {
	            type = typeof type !== 'undefined' ? parseInt(type) : 1; // 默认为运行数据
	            commandData(data); // 缓存控制数据
	            data = filter(type, data); // 过滤数据
	            // 若不渲染控制数据，或数据为空，则退出
	            if (type === 0 && !settings.renderConfigData || isEmpty(data)) {
	                return false;
	            }
	            for (var i in repaintFuncList) {
	                execCallback(repaintFuncList[i], [data, type]);
	            }
	            return true;
	        }

	        /**
	         * 删除登记过的临时回调函数
	         * @param  {string} id 登记的回调函数id
	         * @return {boolean}   删除永久回调函数将返回false
	         */
	        function delCallback(id) {
	            if (callbackList[id] && !callbackList[id].persist) {
	                return delete callbackList[id].fun && delete callbackList[id].persist && delete callbackList[id].expire && delete callbackList[id];
	            } else {
	                return false;
	            }
	        }

	        /**
	         * app代理发起http请求
	         * @param    {string}   url         请求地址
	         * @param    {json}     data        发送的数据，要求json格式
	         * @param    {string}   type        请求类型，GET / POST
	         * @param    {function} sucCallback 成功时的回调函数
	         * @param    {function} errCallback 失败时的回调函数
	         * @param    {integer}  needSign    接口是否需要签名，1-需要，0-不需要
	         */
	        function proxyHttp(url, data, type, sucCallback, errCallback, needSign) {
	            var isRelativePath = url.indexOf('/') === 0 ? true : false; // 仅当“/”开头时，做为相对地址发起请求
	            var requestData = makeHttpRequestData(data);
	            var sucCallbackId = register(sucCallback); // 登记成功时的回调
	            var errCallbackId = register(errCallback); // 登记异常时的回调
	            var dataString;
	            var path;
	            needSign = needSign ? 1 : 0; // 缺省为不需要签名
	            if (type === 'GET' && !isRelativePath) {
	                // GET方式请求需重新拼装url
	                path = packRequestUrl(url, requestData);
	                dataString = '{}';
	            } else {
	                path = url.replace(/\?.+$/, '');
	                dataString = packDataString(data, url);
	            }
	            if (isRelativePath && typeof __AppInterface.relProxyHttp === 'function') {
	                __AppInterface.relProxyHttp(path, dataString, type, sucCallbackId, errCallbackId, needSign);
	            } else if (typeof __AppInterface.absProxyHttp === 'function') {
	                __AppInterface.absProxyHttp(path, dataString, type, sucCallbackId, errCallbackId);
	            } else {
	                ajax(url, requestData, type, sucCallbackId, errCallbackId); // 无app代理，调用ajax执行请求
	            }
	        }

	        /**
	         * ajax请求函数
	         * @param    {string}   url         请求地址
	         * @param    {string}   data        发送的数据，格式为：name=张三&age=21
	         * @param    {string}   type        请求类型，GET / POST
	         * @param    {function} sucCallbackId 成功时的回调函数id
	         * @param    {function} errCallbackId 失败时的回调函数id
	         */
	        function ajax(url, data, type, sucCallbackId, errCallbackId) {
	            var xhr = new XMLHttpRequest();
	            xhr.onreadystatechange = function () {
	                if (xhr.readyState === 4) {
	                    if (xhr.status === 200 || xhr.status === 304) {
	                        execCallback(sucCallbackId, [xhr.responseText]);
	                    } else {
	                        execCallback(errCallbackId, ['Request failed! Status code: ' + xhr.status]);
	                    }
	                }
	            };
	            xhr.open(type, url, true);
	            // xhr.withCredentials = true;
	            if (type === 'POST') {
	                xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	            }
	            xhr.send(data);
	        }

	        /**
	         * 拼装get方式的url
	         * @param    {string}   url     请求地址
	         * @param    {string}   strData 要发送的数据，格式为：name=张三&age=21
	         * @return   {string}           拼接后的地址
	         */
	        function packRequestUrl(url, strData) {
	            var patt = /^([^\?#]+)(\?[^#]+)?(#.+)?$/;
	            var urls = patt.exec(url);
	            var path = urls[1];
	            var search = urls[2] ? '&' + urls[2].substring(1) : '';
	            var hash = urls[3] || '';
	            return path + '?' + strData + search + hash;
	        }

	        /**
	         * 检出url里的data数据，并拼装到data部分
	         * @param    {json}     data 现有json格式的data
	         * @param    {string}   url  可能含data的url
	         * @return   {string}        拼装后，并转化成string格式的data
	         */
	        function packDataString(data, url) {
	            var patt = /(?:\?|&)(\w+)=([^&]*)/g;
	            var mat;
	            while ((mat = patt.exec(url)) != null) {
	                data[mat[1]] = mat[2];
	            }
	            return JSON.stringify(data);
	        }

	        /**
	         * 转换json数据为http请求数据格式
	         * @param    {json}   data json格式的数据
	         * @return   {string}      返回http请求数据格式(形如：name=张三&age=21)
	         */
	        function makeHttpRequestData(data) {
	            var dataString = '';
	            for (var k in data) {
	                dataString += k + '=' + encodeURI(data[k]) + '&';
	            }
	            return dataString.slice(0, -1);
	        }

	        /**
	         * 筛查接收到的数据，以检出控制数据(type=0为控制数据)
	         * @param  {json} data 接收到的数据
	         * @return {json}      返回可直接使用的数据
	         */
	        function detectData(data) {
	            if (data.data) {
	                if (parseInt(data.type) === 0) {
	                    resetCommandData(data.data);
	                }
	                return appToWebData(data.data);
	            } else {
	                resetCommandData(data);
	                return appToWebData(data);
	            }
	        }

	        /**
	         * 重置/生成控制数据
	         * @param  {json} data 新的控制数据
	         */
	        function resetCommandData(data) {
	            var len = 0;
	            for (var i in appCommandData) {
	                len++;
	            }
	            if (!settings.onceConfigData || len <= 1) {
	                appCommandData = data;
	            }
	        }

	        /**
	         * 将要发送的数据转换成控制数据，以便发送
	         * @param  {json}    data           将要发送的数据
	         * @param  {boolean} calcUpdateFlag 是否计算updateFlag
	         * @return {json}                   返回可直接发送的控制数据
	         */
	        function commandData(data, calcUpdateFlag) {
	            data = typeof data === 'string' ? JSON.parse(data) : data;
	            data = webToAppData(data);
	            var updateFlagMap = webToAppData(settings.updateFlagMap);
	            for (var k in appCommandData) {
	                if (typeof data[k] !== 'undefined' && appCommandData[k] !== data[k]) {
	                    if (k === 'updateFlag' && typeof data[k] !== 'string') {
	                        appCommandData[k] |= data[k];
	                    } else {
	                        appCommandData[k] = data[k];
	                    }
	                    if (calcUpdateFlag && updateFlagMap[k]) {
	                        appCommandData.updateFlag = appCommandData.updateFlag || 0; // 强制添加updateFlag
	                        appCommandData.updateFlag |= Math.pow(2, updateFlagMap[k] - 1);
	                    }
	                }
	            }
	            // 添加updateFlag标记（已弃用，为兼容旧版，暂时保留）
	            if (settings.useUpdateFlag && typeof appCommandData.updateFlag === 'undefined') {
	                appCommandData.updateFlag = 0;
	            }
	            return appCommandData;
	        }

	        /**
	         * 将Web端的数据格式映射成App端的数据格式
	         * @param  {json} data Web端提交的数据
	         * @return {json}      返回按App端数据格式重新封装的数据
	         */
	        function webToAppData(data, m) {
	            var rData = {};
	            m = m || settings.webDataMap;
	            for (var k in data) {
	                if (typeof m[k] !== 'undefined') {
	                    rData[m[k]] = data[k];
	                } else {
	                    rData[k] = data[k];
	                }
	            }
	            return rData;
	        }

	        /**
	         * 将App端的数据格式映射成Web端的数据格式
	         * @param  {json} data App端提交的数据
	         * @return {json}      返回按Web端数据格式重新封装的数据
	         */
	        function appToWebData(data) {
	            var oldMap = settings.webDataMap;
	            var revMap = {};
	            for (var i in oldMap) {
	                revMap[oldMap[i]] = i;
	            }
	            return webToAppData(data, revMap);
	        }

	        /**
	         * 根据过滤配置进行数据过滤
	         * @param    {integer}   type 数据类型（控制/运行）
	         * @param    {object}    data 将处理的数据
	         * @return   {object}         处理完成的数据
	         */
	        function filter(type, data) {
	            for (var k in settings.filter) {
	                try {
	                    switch (settings.filter[k]) {
	                        case 0:
	                            // 只取控制数据
	                            if (type !== 0) {
	                                delete data[k];
	                            }
	                            break;
	                        case 1:
	                            // 只取运行数据
	                            if (type !== 1) {
	                                delete data[k];
	                            }
	                            break;
	                        default:
	                            if (!settings.filter[k](type, data)) {
	                                delete data[k];
	                            }
	                    }
	                } catch (err) {
	                    // console.log(err);
	                }
	            }
	            return data;
	        }

	        /**
	         * 垃圾回收函数，目前主要用于回收登记的临时回调函数
	         * @return {boolean} 发生异常时返回false
	         */
	        function gc() {
	            var timestamp = +new Date();
	            try {
	                for (var id in callbackList) {
	                    if (!callbackList[id].persist && callbackList[id].expire < timestamp) {
	                        delete callbackList[id].fun;
	                    }
	                }
	                return true;
	            } catch (e) {
	                return false;
	            }
	        }

	        /**
	         * 二进制字符串转为10进制数组
	         * @param    {string}   binString 二进制字符串
	         * @return   {array}              以字节为单位的10进制数组
	         */
	        function bin2DecArray(binString) {
	            var arr = [],
	                matt = /^(\d*)(\d{8})$|^\d{1,7}$/,
	                str = binString.replace(/[^01]/g, '');
	            while (str.length) {
	                str = str.replace(matt, pd);
	            }
	            function pd(a, b, c) {
	                var dec = parseInt(typeof c === 'undefined' ? a : c, 2);
	                arr.push(dec);
	                return typeof b !== 'undefined' ? b : '';
	            }
	            return arr;
	        }

	        /**
	         * 10进制数组转为16进制字符串
	         * @param    {array}   decArr 以字节为单位的10进制数组
	         * @return   {string}         16进制字符串
	         */
	        function decArray2Hex(decArr) {
	            var hex = '';
	            for (var i = 0; i < decArr.length; i++) {
	                hex += decArr[i].toString(16).replace(/(?=\b\w\b)/, '0');
	            }
	            return hex;
	        }

	        /**
	         * 判断对象是否为空
	         * @param    {object}   obj 对象或数组
	         * @return   {Boolean}      为空返回true
	         */
	        function isEmpty(obj) {
	            var n = 0;
	            if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') {
	                return false;
	            }
	            for (var i in obj) {
	                n++;
	            }
	            return !n;
	        }

	        /**
	         * 打印日志，调用console.log方法
	         */
	        function print() {
	            var d = new Date(),
	                t = (d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ' ' + d.getMilliseconds()).replace(/(?=\b\d\b)|(?=\b\d\d$)/g, '0'),
	                args = [].slice.call(arguments);
	            if (!/%c/.test(args[0])) {
	                [].splice.call(args, 0, 0, '[' + t + ']');
	            }
	            if (typeof console !== 'undefined') {
	                console.log.apply(console, args);
	            }
	        }

	        /**
	         * 供app调用的接口
	         * .ready   {function} app准备就绪时调用该方法，交互由$this.config发起
	         * .success {function} app处理成功时调用该方法，交互由$this.send发起
	         * .error   {function} app处理异常时调用该方法，交互由$this.send发起
	         * .httpResponse {function} app代理http请求响应时调用该方法，交互由$this.get或$this.post发起
	         * .repaint {function} app单方向推送消息给web时调用该方法
	         */
	        var web = {
	            ready: function ready(data) {
	                data = typeof data === 'string' ? JSON.parse(data) : data;
	                return execReadyFuncList(data);
	            },
	            success: function success(data, callbackId) {
	                appCommandTime = 0; // 解除迟钝时间
	                data = !data ? data : typeof data === 'string' ? JSON.parse(data) : data;
	                return execCallback(callbackId, Array.prototype.slice.call(arguments, 0, -1));
	            },
	            error: function error(data, callbackId) {
	                // data = typeof data === "string" ? JSON.parse(data) : data;
	                return execCallback(callbackId, Array.prototype.slice.call(arguments, 0, -1));
	            },
	            httpResponseSuccess: function httpResponseSuccess(data, callbackId) {
	                return execCallback(callbackId, Array.prototype.slice.call(arguments, 0, -1));
	            },
	            httpResponseError: function httpResponseError(data, callbackId) {
	                return execCallback(callbackId, Array.prototype.slice.call(arguments, 0, -1));
	            },
	            repaint: function repaint(data) {
	                if (settings.debugMode == 'print') {
	                    print('repaint:', typeof data === 'string' ? data : JSON.stringify(data));
	                }
	                // alert(typeof data === "string" ? data : JSON.stringify(data));
	                data = typeof data === 'string' ? JSON.parse(data) : data;
	                if (+new Date() - appCommandTime < settings.torporTime) {
	                    // 请求发生在迟钝时间内，忽略该请求！
	                    print('%cWarning: torpid time', 'color:#5f3e05');
	                    return false;
	                }
	                return execRepaintFuncList(data.type, detectData(data));
	            }
	        };
	        window[webInterfaceNS] = web; // 暴露web接口给app调用
	    }
	    return new HET();
	}();

/***/ }
/******/ ]);