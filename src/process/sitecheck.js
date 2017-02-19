import cheerio from 'cheerio'
import request from 'request'
import fsextra from "fs-extra"
import htmllint from "htmllint"
import htmllintMessageJa from "../misc/htmllint_message_ja.js"
import config from "../config.js"
import exportCsv from "../misc/export_csv.js"
import Queue from "../queue"
import {log} from "../misc/util.js"

const options = config.get("sitecheck")

// htmllint のルールを定義
// https://github.com/htmllint/htmllint/wiki/Options
htmllint.rules = options.htmllintRules


export default class SiteCheck {

    /**
     * @param pages チェックするページ一覧
     */
    constructor(pages) {
        // チェックするページ
        if (typeof pages === "undefined") {
            throw new Error("Invaild Paramater. Required Page List.")
        }
        this.queue = new Queue(pages.reverse())
        this.data = [];
        this.data.push(this.getHeaders());

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

        if (!this.queue.isNext()) {
            this.output(this.data)
            return false;
        }

        var checkurl = this.queue.next()

        /**
         * URLを取得
         */
        request(checkurl, (error, response, body) => {
            let row = this.getDefaultRowArray()
            let $ = cheerio.load(body)

            row.push(this.data.length)
            row.push(checkurl)

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

            htmllint(body).then((issues) => {
                var _issues = []
                issues.forEach((issue) => {
                    var msg = [
                        'line ', issue.line, ', ',
                        'col ', issue.column, ', ',
                        htmllintMessageJa.renderIssue(issue)
                    ].join('');
                    _issues.push(msg);
                });
                var parsemsg = _issues.join('\n');
                row.push(parsemsg.replace(/"/g, '\"'))
            })
            this.data.push(row);
            this.run();
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
            for (var i = 0; i < headers.length; i++) {
                obj[headers[i]] = infoArray[i]
            }
            lineArray.push(obj)
        })
        exportCsv(lineArray).then((data) => {
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
