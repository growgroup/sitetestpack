"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();var _queue = require("./queue.js");var _queue2 = _interopRequireDefault(_queue);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var

LinkQueue = function (_Queue) {_inherits(LinkQueue, _Queue);

    function LinkQueue() {_classCallCheck(this, LinkQueue);return _possibleConstructorReturn(this, (LinkQueue.__proto__ || Object.getPrototypeOf(LinkQueue)).call(this));

    }

    /**
       * URLを追加する
       * @param key
       */_createClass(LinkQueue, [{ key: "add", value: function add(
        key) {
            if (!key) {
                return false;
            }
            if (key.slice(-1) !== "/") {
                key += "/";
            }
            var _url = key;
            if (this.find(_url) === false && this.isVisited(_url) === false) {
                this._queue.push(_url);
                this._queuehistory.push(_url);
            }
        }

        /**
           * すでに訪れたことがあるか判断
           * @param url
           * @returns {boolean}
           */ }, { key: "isVisited", value: function isVisited(
        url) {
            for (var i = 0; i < this._queuehistory.length; i++) {
                if (url === this._queuehistory[i]) {
                    return true;
                }
            }
            return false;
        } }]);return LinkQueue;}(_queue2.default);exports.default = LinkQueue;