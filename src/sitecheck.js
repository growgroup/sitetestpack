import cheerio from 'cheerio'
import request from 'request'
import fsextra from "fs-extra"
import htmllint from "htmllint"
import {log} from "./util.js"
import exportCsv from "./export_csv.js"
import config from "./config.js"

// ページ一覧
var defaultPages = config.get("pages")
// オプション
const options = config.get("sitecheck")

export default class SiteCheck {

    /**
     * @param pages チェックするページ一覧
     */
    constructor(pages) {

        // チェックするページ
        this.checkPages = defaultPages;
        if (typeof pages !== "undefined") {
            this.checkPages = pages
        }

        this.data = [];
        this.data.push(this.getHeaders());
        this.currentPageId = 0
        this.maxPageLength = this.checkPages.length

        return new Promise((resolve, reject) => {
            this._resolve = resolve;
            this.run();
        })
    }

    /**
     * CSVのヘッダーを返す
     * @returns {[string,string,string,string,string,string,string,string]}
     */
    getHeaders() {
        return ["id", "url", "title", "description", "h1", "h2", "tel&fax", "tel link", "html lint"]
    }


    /**
     * Arrayを拡張したオブジェクトを準備する
     * @returns {Array}
     */
    getDefaultRowArray() {
        var row = [];
        row.__proto__.pushData = function (selector, defaults, callback) {
            this.push(SiteCheck.parse(selector, defaults, callback))
        }
        return row;
    }

    /**
     * URLからrequestを送信し、
     * 調査項目を data プロパティへ保管する
     *
     * @returns {boolean}
     */
    run() {

        var currentUrl = this.checkPages[this.currentPageId]

        if (this.currentPageId === this.maxPageLength) {
            this.output(this.data)
            return false;
        }

        /**
         * URLを取得
         */
        request(currentUrl, (error, response, body) => {
            var url = currentUrl;
            let row = this.getDefaultRowArray()
            let $ = cheerio.load(body)

            row.push(this.currentPageId)
            row.push(url)

            // タイトル
            row.pushData($("title"), "タイトルが設定されていません")

            // 説明文
            row.pushData($("meta[name='description']"), "説明文が設定されていません", (data) => {
                return data.attr("content")
            })

            // h1
            row.pushData($("h1"), "h1が設定されていません", (data) => {
                if (data.find("img").length) {
                    return data.find("img").attr("alt");
                }
                return data.text().replace(/\r?\n/g, "").trim();
            })

            // h2
            row.pushData($("h2"), "h2が設定されていません", (data) => {
                return data.text().replace(/\r?\n/g, "").trim()
            })

            // tel
            row.pushData(body, "電話番号がありません", (data) => {
                var telMatch = data.match(/0\d{1,3}-\d{2,4}-\d{4}/g)
                if (telMatch && telMatch.length >= 1) {
                    return telMatch.join(",")
                }
            })

            // 電話番号リンク
            row.pushData($("a[href^='tel:']"), "電話番号リンクは見つかりませんでした", (telLinks) => {
                var tellinkstext = "なし"
                if (telLinks && telLinks.length >= 1 && typeof telLinks.join !== "undefined") {
                    tellinkstext = telLinks.join("\,")
                }
                return tellinkstext;
            })

            /** htmllint の設定 */
            htmllint.rules = {
                "attr-bans": ['align', 'background', 'bgcolor', 'border', 'frameborder', 'longdesc', 'marginwidth', 'marginheight', 'scrolling', 'width'],
                "attr-no-dup": false,
                "attr-quote-style": false,
                "attr-name-style": true,
                "head-req-title": true,
                "href-style": false,
                "id-class-style": false,
                "img-req-alt": true,
                "img-req-src": true,
                "indent-style": false,
                "indent-width": false,
                "indent-width-cont": false,
                "tag-close": true
            }
            htmllint(body).then((issues) => {
                var _issues = []
                issues.forEach(function (issue) {
                    var msg = [
                        'line ', issue.line, ', ',
                        'col ', issue.column, ', ',
                        htmllint.messages.renderIssue(issue)
                    ].join('');
                    _issues.push(msg);
                });
                var msg = _issues.join('\n');
                row.push( msg.replace(/"/g,'\"'))
            })

            this.data.push(row);
            this.run(this.currentPageId++);
        })
    }

    /**
     * データをCSVで出力
     * @param data
     */
    output() {
        var lineArray = []
        var headers = this.data[0]
        this.data.forEach(function (infoArray, index) {

            var obj = {}
            for(var i = 0; i < headers.length; i++){
                obj[headers[i]] = infoArray[i]
            }

            lineArray.push(obj)
        })
        exportCsv(lineArray).then((data)=>{
            fsextra.outputFile(config.get("resultsDirPath") + options.output, data, (err, data) => {
                if (err) {
                    console.log(err);
                }
                this._resolve(this);
                log("sitecheck_results.csv へエクスポートしました")
            })
        })
    }

    /**
     * chelio オブジェクトを拡張
     *
     * @param selector
     * @param defaults
     * @param callback
     * @returns {*}
     */
    static parse(selector, defaults, callback) {
        var data = "";
        var parsecallback, defaultValue;
        if (typeof defaults === "function") {
            parsecallback = defaults;
        }

        if (typeof callback === "string") {
            defaultValue = callback;
        }
        if (typeof callback === "function") {
            parsecallback = callback
        }

        if (typeof defaultValue !== "undefined") {
            data = defaultValue;
        }
        var $selector = selector

        if (typeof parsecallback === "function") {
            data = parsecallback($selector);
        } else {
            if (typeof $selector.text === "function") {
                data = $selector.text().replace(/\r?\n/g, "").trim()
            }
        }

        if (typeof data === "undefined") {
            return "";
        }
        return data.replace(/(",)/g, "\\$1");
    }
}
