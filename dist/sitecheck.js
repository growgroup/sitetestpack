'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();var _cheerio = require('cheerio');var _cheerio2 = _interopRequireDefault(_cheerio);
var _request = require('request');var _request2 = _interopRequireDefault(_request);
var _fsExtra = require('fs-extra');var _fsExtra2 = _interopRequireDefault(_fsExtra);
var _util = require('./util.js');
var _config = require('./config.js');var _config2 = _interopRequireDefault(_config);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}

// ページ一覧
var defaultPages = _config2.default.pages;
// オプション
var options = _config2.default.sitecheck;var

SiteCheck = function () {

    /**
                          * @param pages チェックするページ一覧
                          */
    function SiteCheck(pages) {var _this = this;_classCallCheck(this, SiteCheck);

        // チェックするページ
        this.checkPages = defaultPages;
        if (typeof pages !== "undefined") {
            this.checkPages = pages;
        }
        this.data = [];
        this.data.push(this.getHeaders());
        this.currentPageId = 0;
        this.maxPageLength = this.checkPages.length;

        return new Promise(function (resolve, reject) {
            _this._resolve = resolve;
            _this.put();
        });
    }

    /**
       * CSVのヘッダーを返す
       * @returns {[string,string,string,string,string,string,string,string]}
       */_createClass(SiteCheck, [{ key: 'getHeaders', value: function getHeaders()
        {
            return ["id", "url", "title", "description", "h1", "h2", "tel&fax", "tel link"];
        }


        /**
           * Arrayを拡張したオブジェクトを準備する
           * @returns {Array}
           */ }, { key: 'getDefaultDataArray', value: function getDefaultDataArray()
        {
            var data = [];
            data.__proto__.pushData = function (selector, defaults, callback) {
                this.push(SiteCheck.parse(selector, defaults, callback));
            };
            return data;
        }

        /**
           * URLからrequestを送信し、
           * 調査項目を data プロパティへ保管する
           *
           * @returns {boolean}
           */ }, { key: 'put', value: function put()
        {var _this2 = this;

            var currentUrl = this.checkPages[this.currentPageId];

            if (this.currentPageId === this.maxPageLength) {
                this.output(this.data);
                return false;
            }

            /**
               * URLを取得
               */
            (0, _request2.default)(currentUrl, function (error, response, body) {
                var url = currentUrl;
                var _data = _this2.getDefaultDataArray();
                var $ = _cheerio2.default.load(body);

                _data.push(_this2.currentPageId);
                _data.push(url);

                // タイトル
                _data.pushData($("title"), "タイトルが設定されていません");

                // 説明文
                _data.pushData($("meta[name='description']"), "説明文が設定されていません", function (data) {
                    return data.attr("content");
                });

                // h1
                _data.pushData($("h1"), "h1が設定されていません", function (data) {
                    if (data.find("img")) {
                        return data.find("img").attr("alt");
                    }
                    return data.text();
                });

                // h2
                _data.pushData($("h2"), "h2が設定されていません", function (data) {
                    return data.text().replace(/\r?\n/g, "").trim();
                });

                // tel
                _data.pushData(body, "電話番号がありません", function (data) {
                    var telMatch = data.match(/0\d{1,3}-\d{2,4}-\d{4}/g);
                    if (telMatch && telMatch.length >= 1) {
                        return telMatch.join(",");
                    }
                });

                // 電話番号リンク
                _data.pushData($("a[href^='tel:']"), "なし", function (telLinks) {
                    var tellinkstext = "なし";
                    if (telLinks && telLinks.length >= 1 && typeof telLinks.join !== "undefined") {
                        tellinkstext = telLinks.join(",");
                    }
                    return tellinkstext;
                });

                _this2.data.push(_data);
                _this2.put(_this2.currentPageId++);
            });
        }

        /**
           * データをCSVで出力
           * @param data
           */ }, { key: 'output', value: function output()
        {var _this3 = this;
            var lineArray = [];
            this.data.forEach(function (infoArray, index) {
                var line = infoArray.join(",");
                lineArray.push(line);
            });
            var csvContent = lineArray.join("\n");
            _fsExtra2.default.outputFile(options.csv, csvContent, function (err, data) {
                if (err) {
                    console.log(err);
                }

                _this3._resolve(_this3);
                (0, _util.log)("sitecheck_results.csv へエクスポートしました");
            });
        }

        /**
           * chelio オブジェクトを拡張
           * @param selector
           * @param defaults
           * @param callback
           * @returns {*}
           */ }], [{ key: 'parse', value: function parse(
        selector, defaults, callback) {
            var data = "";
            var parsecallback, defaultValue;
            if (typeof defaults === "function") {
                parsecallback = defaults;
            }

            if (typeof callback === "string") {
                defaultValue = callback;
            }
            if (typeof callback === "function") {
                parsecallback = callback;
            }

            if (typeof defaultValue !== "undefined") {
                data = defaultValue;
            }
            var $selector = selector;

            if (typeof parsecallback === "function") {
                data = parsecallback($selector);
            } else {
                if (typeof $selector.text === "function") {
                    data = $selector.text().replace(/\r?\n/g, "").trim();
                }
            }

            if (typeof data === "undefined") {
                return "";
            }
            return data.replace(/(",)/g, "\\$1");
        } }]);return SiteCheck;}();exports.default = SiteCheck;