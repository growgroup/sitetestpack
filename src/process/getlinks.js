import request from "request"
import cheerio from 'cheerio'
import URL from 'url-parse';
import fsextra from "fs-extra"
import config from "../config.js"
import exportCsv from "../misc/export_csv.js"
import Queue from "../queue"
import LinkQueue from "../queue/linkqueue.js"

const pages = config.get("pages")
const options = config.get("getlinks")

export default class GetLinks {

    /**
     * @param startUrl 基点となるURL
     * @param limit 制限数
     * @param ignoresPattern 除外するURLの正規表現パターン
     */
    constructor(startUrl, limit, ignoresPattern) {

        this.linklist = new Queue();

        this.ignoresPattern = ignoresPattern
        this.startUrl = startUrl
        this.limit = limit

        this.countVisitedPage = 0;
        this.url = new URL(this.startUrl)
        this.baseUrl = this.url.protocol + "//" + this.url.hostname;

        this.queue = new LinkQueue();
        this.queue.add(this.startUrl);

        this.visitPage = this.visitPage.bind(this)
        this.crawl = this.crawl.bind(this)
        this.checkURL = this.checkURL.bind(this)

        this._promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
        });
        this.crawl();
    }

    /**
     * プロミスを返す
     * @returns {Promise}
     */
    getPromise() {
        return this._promise
    }

    /**
     * URLを巡回する
     */
    crawl() {

        var nextPage = this.queue.next();

        if (this.countVisitedPage >= this.limit || typeof nextPage === "undefined") {
            this.complete()
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
     */
    visitPage(url, callback) {
        this.countVisitedPage++;
        var self = this
        console.log(this.countVisitedPage +":" + url);
        request(url, function (error, response, body) {
            if (response.statusCode !== 200) {
                callback();
                return;
            }
            var $ = cheerio.load(body);
            self.linklist.add({url: url, title: $("title").text()})
            self.collectInternalLinks($);
            callback();
        });
    }

    /**
     * リンクをし、queue へ格納する
     */
    collectInternalLinks($) {
        var relativeLinks = $("a[href^='/'],a[href^='http']");
        var self = this
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
        })
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
    checkURL(url) {

        // 除外パターンかどうか調査
        if (url.match(new RegExp(this.ignoresPattern, "g"))) {
            return false;
        }

        // ハッシュ、またはクエリストリングで生成されたURL、画像ファイル拡張子を含まないかどうか調査
        if (url.match(/(?:#|\?|\.png|\.jpg|\.jpeg|\.gif)/g)) {
            return false;
        }

        if (url[0] === "/") {
            var url = this.url.href + url;
        }

        // 自身のドメインか調査
        var _url = this.url.hostname.replace(/[\-|\.|\_]/g, function (match) {
            return "\\" + match;
        })

        var reg = new RegExp("^https?:\/\/" + _url + ".*?[^?].*", "g")
        var match = url.match(reg)

        return !( match == null )
    }

    /**
     * CSVに出力する
     */
    output() {
        this.linklist.sort("url");
        var lineArray = []
        var headers = ["ID", "url", "title"]
        lineArray.push(headers)

        this.linklist.forEach(function (infoArray, index) {
            var _infoArray = [index+1, infoArray.url, infoArray.title]
            lineArray.push(_infoArray)

        })
        exportCsv(lineArray).then((data) => {
            fsextra.outputFile(config.get("resultsDirPath") + options.output, data, (err, data) => {
                if (err) {
                    throw new Error("ファイルの出力に失敗しました")
                }
            })
        })
    }

    /**
     * 完了時の処理
     */
    complete(){
        this._resolve(this.linklist.all());
        this.output()
    }
}
