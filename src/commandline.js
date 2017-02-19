import GetLinks from "./process/getlinks.js"
import SiteCheck from "./process/sitecheck.js"
import Screenshot from "./process/screenshot.js"
import {cleanDirectroy, log} from "./misc/util.js"
import config from "./config.js"
import prompt from "prompt"
import colors from "colors/safe"
import Table from "cli-table2"


var TITLE = `
     _____  _____  _____  _____    _____  _____  _____  _____    _____  _____  _____  _____
    |   __||     ||_   _||   __|  |_   _||   __||   __||_   _|  |  _  ||  _  ||     ||  |  |
    |__   ||-   -|  | |  |   __|    | |  |   __||__   |  | |    |   __||     ||   --||    -|
    |_____||_____|  |_|  |_____|    |_|  |_____||_____|  |_|    |__|   |__|__||_____||__|__|
    `
console.log(colors.magenta(TITLE))

cleanDirectroy().then(function () {
    command();
});

function command() {

    prompt.message = colors.magenta("[sitetestpack]");
    prompt.delimiter = colors.green(":");

    prompt.start();
    prompt.get({
        properties: {
            url: {
                description: colors.magenta("1. チェックする基点となるURLを入力してください"),
                required: true
            },
            limit: {
                description: colors.magenta("2. 取得するURLの上限値を指定してください"),
                default: 100,
                type: 'integer'
            },
            ignorePattern: {
                description: colors.magenta("3. 無視するURLのパターンを入力してください(正規表現可)"),
                default: false,
            },
            runSitecheck: {
                description: colors.magenta("4. サイトチェックを実行しますか？(y or n))"),
                default: "y",

            },
            runScreenshot: {
                description: colors.magenta("5. スクリーンショットを撮りますか？(y or n)"),
                default: "y",

            },
        }
    }, function (err, result) {
        if (err) {
            throw err;
        }

        // 現在のパスを基点に設定する
        config.set("resultsDirPath", process.cwd() + "/sitetestpack_results/")

        /**
         * 1. リンクを取得する
         */
        log(result.url + " からURL一覧を取得しています....");

        var gl = new GetLinks(result.url, result.limit, result.ignorePattern)
        gl.getPromise().then(function (data) {
            var table = new Table({
                head: ["url", "title"]
            })
            var _pages = []
            for (var i = 0; i < data.length; i++) {
                table.push([data[i].url, data[i].title])
                _pages.push(data[i].url);
            }

            config.set("pages", _pages);
            console.log(colors.cyan(table.toString()))

            if (result.runSitecheck === "y") {

                /**
                 * 2. サイトチェック
                 * @type {SiteCheck}
                 */
                log("サイトチェックを開始しています...");
                new SiteCheck(config.get("pages")).then(function (scObj) {
                    log("サイトチェック結果をcsvにエクスポートしました");
                })
            }

            if (result.runScreenshot === "y") {
                /**
                 * スクリーンショット
                 * @type {Screenshot}
                 */
                new Screenshot(config.get("pages")).then(function () {
                    log("スクリーンショットを撮り終えました！")
                });
            }
        })
    });
}
