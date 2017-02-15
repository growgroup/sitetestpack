'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();var _request = require('request');var _request2 = _interopRequireDefault(_request);
var _cheerio = require('cheerio');var _cheerio2 = _interopRequireDefault(_cheerio);
var _urlParse = require('url-parse');var _urlParse2 = _interopRequireDefault(_urlParse);
var _config = require('./config.js');var _config2 = _interopRequireDefault(_config);
var _fsExtra = require('fs-extra');var _fsExtra2 = _interopRequireDefault(_fsExtra);
var _linkqueue = require('./linkqueue.js');var _linkqueue2 = _interopRequireDefault(_linkqueue);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}
var pages = _config2.default.pages;
var options = _config2.default.getlinks;var

GetLinks = function () {

    /**
                         * Constructor
                         * @param startUrl
                         * @param keyword
                         */
    function GetLinks(startUrl, keyword, number, ignore) {var _this = this;_classCallCheck(this, GetLinks);

        this.ignoreUrl = ignore;
        this.startUrl = startUrl;
        this.searchKeyword = keyword;
        this.maxPages = number;
        this.countVisitedPage = 0;

        this.url = new _urlParse2.default(this.startUrl);
        this.baseUrl = this.url.protocol + "//" + this.url.hostname;
        this.listurls = [];

        this.queue = new _linkqueue2.default();
        this.queue.add(this.startUrl);

        this.visitPage = this.visitPage.bind(this);
        this.crawl = this.crawl.bind(this);
        this.checkURL = this.checkURL.bind(this);
        return new Promise(function (resolve, reject) {
            _this._resolve = resolve;
            _this.crawl();
        });
    }

    /**
       * URLを巡回する
       */_createClass(GetLinks, [{ key: 'crawl', value: function crawl()
        {

            if (this.countVisitedPage >= this.maxPages) {
                console.log("最大取得数に達しました");
                this._resolve(this.listurls);
                this.output();
                return this.queue;
            }

            var nextPage = this.queue.next();

            if (typeof nextPage === "undefined") {
                this._resolve(this.listurls);
                this.output();
                return this.queue;
            }

            if (this.queue.find(nextPage) > 0) {
                this.crawl();
            } else {

                this.visitPage(nextPage, this.crawl);
            }

        }

        /**
           * ページを取得する
           */ }, { key: 'visitPage', value: function visitPage(
        url, callback) {
            this.countVisitedPage++;
            var self = this;
            console.log("" + url);
            (0, _request2.default)(url, function (error, response, body) {
                if (response.statusCode !== 200) {
                    callback();
                    return;
                }
                var $ = _cheerio2.default.load(body);
                self.listurls.push({ url: url, title: $("title").text() });
                if (self.searchKeyword) {
                    var isWordFound = self.searchForWord($, self.searchKeyword);
                    if (isWordFound) {
                        console.log('検索している単語が見つかりました: ' + self.searchKeyword + ' URL: ' + url);
                    } else {
                        self.collectInternalLinks($);
                        callback();
                    }
                } else {
                    self.collectInternalLinks($);
                    callback();
                }

            });
        }

        /**
           * リンクをし、queue へ格納する
           */ }, { key: 'collectInternalLinks', value: function collectInternalLinks(
        $) {
            var relativeLinks = $("a[href^='/'],a[href^='http']");
            var self = this;
            relativeLinks.each(function () {
                if (!self.checkURL($(this).attr('href'))) {
                    return true;
                }
                if ($(this).attr('href').substr(0, 1) === "/") {
                    self.queue.add(self.baseUrl + $(this).attr('href'));
                } else {
                    if ($(this).attr('href').match(self.url.hostname)) {
                        self.queue.add($(this).attr('href'));
                    }
                }
            });
        }

        /**
           * キーワードを検索する
           */ }, { key: 'searchForWord', value: function searchForWord(
        $, word) {
            var bodyText = $('html > body').text().toLowerCase();
            return bodyText.indexOf(word.toLowerCase()) !== -1;
        }

        /**
           * URLをチェックする
           * @param url string
           */ }, { key: 'checkURL', value: function checkURL(
        url) {

            // 除外パターンかどうか調査
            if (url.match(new RegExp(this.ignoreUrl, "g"))) {
                return false;
            }

            // ハッシュ、またはクエリストリングで生成されたURLかどうか調査
            if (url.match(/(?:#|\?)/g)) {
                return false;
            }

            // urlが画像ファイルの場合除外
            if (url.match(/(?:\.png|\.jpg|\.jpeg|.\.gif)/g)) {
                return false;
            }

            if (url[0] === "/") {
                var url = this.url.href + url;
            }

            // 自身のドメインか調査
            var _url = this.url.hostname.replace(/[\-|\.|\_]/g, function (match) {
                return "\\" + match;
            });

            var reg = new RegExp("^https?:\/\/" + _url + ".*?[^?].*", "g");
            var match = url.match(reg);

            return !(match == null);
        }

        /**
           * CSVに出力する
           */ }, { key: 'output', value: function output()
        {
            var lineArray = [];
            var headers = ["ID", "url", "title"];
            lineArray.push(headers);
            this.listurls.forEach(function (infoArray, index) {
                var _infoArray = [index, infoArray.url, infoArray.title];
                var line = _infoArray.join(",");
                lineArray.push(line);
            });
            var csvContent = lineArray.join("\n");
            _fsExtra2.default.outputFile(options.csv, csvContent, function (err, data) {
                if (err) {
                    console.log(err);
                }
            });
        } }]);return GetLinks;}();exports.default = GetLinks;