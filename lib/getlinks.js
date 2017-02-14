import request from "request"
import cheerio from 'cheerio'
import URL from 'url-parse';
import config from "../config.js"
import fsextra from "fs-extra"
const pages = config.pages
const options = config.getlinks


class Queue {

    /**
     * 初期化
     */
    constructor() {
        this._queue = []
        this._listhistory = []
    }

    /**
     * URLを追加する
     * @param url
     */
    add(url) {
        if ( this.find(url) === false && this.isVisited(url) === false ) {
            this._queue.push(url)
            this._listhistory.push(url)
        }
    }

    /**
     * URLを削除する
     * @param url
     */
    remove(url) {
        this._queue.forEach((data, key) => {
            if (data === url) {
                this._queue.splice(key, 1)
                return false;
            }
        })
    }

    /**
     * URLを探し、あった場合には添字を返す
     *
     * @param url
     * @returns {*} boolean or int
     */
    find(url) {
        for (var i = 0; i < this._queue.length; i++) {
            if (url === this._queue[i]) {
                return i;
            }
        }
        return false;
    }

    /**
     * すでに訪れたことがあるか判断
     * @param url
     * @returns {boolean}
     */
    isVisited(url){
        for (var i = 0; i < this._listhistory.length; i++) {
            if (url === this._listhistory[i]) {
                return true;
            }
        }
        return false;
    }

    /**
     * 次のURLを返す
     * @returns {*}
     */
    next() {
        return this._queue.pop()
    }
}

export default class GetLinks {

    /**
     * Constructor
     * @param startUrl
     * @param keyword
     */
    constructor(startUrl, keyword, number, ignore) {


        this.ignoreUrl = ignore
        // 基点となるURL
        this.startUrl = startUrl
        this.searchKeyword = keyword
        this.maxPages = number

        this.countVisitedPage = 0;

        this.url = new URL(this.startUrl)
        this.baseUrl = this.url.protocol + "//" + this.url.hostname;
        this.listurls = []

        this.queue = new Queue();
        this.queue.add(this.startUrl);

        this.visitPage = this.visitPage.bind(this)
        this.crawl = this.crawl.bind(this)
        this.checkUrl = this.checkUrl.bind(this)

        return new Promise((resolve, reject) => {
            this._resolve = resolve;
            this.crawl();
        });
    }

    /**
     * URLを巡回する
     */
    crawl() {

        if (this.countVisitedPage >= this.maxPages) {
            console.log("最大取得数に達しました");
            this._resolve(this.listurls);
            this.output()
            return this.queue;
        }

        var nextPage = this.queue.next();

        if (typeof nextPage === "undefined") {
            this._resolve(this.listurls);
            this.output()
            return this.queue;
        }

        if ( this.queue.find(nextPage) > 0 ) {
            this.crawl();
        } else {

            this.visitPage(nextPage, this.crawl);
        }

    }


    /**
     * ページを取得する
     */
    visitPage(url, callback) {
        this.countVisitedPage++;
        var self = this
        console.log("" + url);
        request(url, function (error, response, body) {
            if (response.statusCode !== 200) {
                callback();
                return;
            }
            var $ = cheerio.load(body);
            self.listurls.push({url: url, title: $("title").text()})
            if (self.searchKeyword) {
                var isWordFound = self.searchForWord($, self.searchKeyword);
                if (isWordFound) {
                    console.log('Word ' + self.searchKeyword + ' found at page ' + url);
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
     */
    collectInternalLinks($) {
        var relativeLinks = $("a[href^='/'],a[href^='http']");
        var self = this
        relativeLinks.each(function () {
            if (!self.checkUrl($(this).attr('href'))) {
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
     */
    searchForWord($, word) {
        var bodyText = $('html > body').text().toLowerCase();
        return (bodyText.indexOf(word.toLowerCase()) !== -1);
    }


    /**
     * URLをチェックする
     * @param url string
     */
    checkUrl(url) {

        if ( url.match(new RegExp(this.ignoreUrl,"g") ) ){
            return false;
        }

        if (url.match(/(?:#|\?)/g)) {
            return false;
        }

        if (url.match(/(?:\.png|\.jpg|\.jpeg|.\.gif)/g)) {
            return false;
        }

        if (url[0] === "/") {
            var url = this.url.href + url;
        }

        var _url = this.url.hostname.replace(/[\-|\.|\_]/g, function (match) {
            return "\\" + match;
        })

        var reg = new RegExp("^https?:\/\/" + _url + ".*?[^?].*", "g")
        var match = url.match(reg)

        return !( match == null )
    }

    output() {
        var lineArray = []
        var headers = ["ID","url","title"]
        lineArray.push(headers)
        this.listurls.forEach(function (infoArray, index) {
            var _infoArray = [index,infoArray.url,infoArray.title]
            var line = _infoArray.join(",")
            lineArray.push(line)
        })
        var csvContent = lineArray.join("\n")
        fsextra.outputFile(options.csv, csvContent, (err, data) => {
            if (err) {
                console.log(err);
            }
        })
    }
}