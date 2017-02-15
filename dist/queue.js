"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var Queue = function () {

    /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * 初期化
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */
    function Queue() {_classCallCheck(this, Queue);
        this._queue = [];
        this._queuehistory = [];
    }

    /**
       * URLを追加する
       * @param key
       */_createClass(Queue, [{ key: "add", value: function add(
        key) {
            if (this.find(key) === false) {
                this._queue.push(key);
                this._queuehistory.push(key);
            }
        }

        /**
           * URLを削除する
           * @param key
           */ }, { key: "remove", value: function remove(
        key) {var _this = this;
            this._queue.forEach(function (data, datakey) {
                if (data === key) {
                    _this._queue.splice(datakey, 1);
                    return false;
                }
            });
        }

        /**
           * keyを探し、あった場合には添字を返す
           *
           * @param key
           * @returns {*} boolean or int
           */ }, { key: "find", value: function find(
        key) {
            for (var i = 0; i < this._queue.length; i++) {
                if (key === this._queue[i]) {
                    return i;
                }
            }
            return false;
        }

        /**
           * 次のURLを返す
           * @returns {*}
           */ }, { key: "next", value: function next()
        {
            return this._queue.pop();
        } }]);return Queue;}();exports.default = Queue;