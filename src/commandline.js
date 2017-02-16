import GetLinks from "./getlinks.js"
import SiteCheck from "./sitecheck.js"
import Screenshot from "./screenshot.js"
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
prompt.message = colors.magenta("[sitetestpack]");
prompt.delimiter = colors.green(":");

prompt.start();
prompt.get({
    properties: {
        url: {
            description: colors.magenta("1. チェックする基点となるURLを入力してください"),
            required: true
        },
        number: {
            description: colors.magenta("2. 取得するURLの上限値を指定してください"),
            default: 100,
            type: 'integer'
        },
        ignoreurl: {
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
    /**
     * 1. リンクを取得する
     */
    console.log(colors.cyan(result.url + " からURL一覧を取得しています...."));
    var getlinks = new GetLinks(result.url, "", result.number, result.ignoreurl);
    getlinks.then(function (data) {
        var table = new Table({
            head: ["url", "title"]
        })
        var _pages = []
        for (var i = 0; i < data.length; i++) {
            table.push([data[i].url, data[i].title])
            _pages.push(data[i].url);
        }
        console.log(colors.cyan(table.toString()))
        if (result.runSitecheck === "y") {
            /**
             * 2. サイトチェック
             * @type {SiteCheck}
             */
            console.log(colors.cyan("サイトチェックを開始しています...."))
            var sc = new SiteCheck(_pages);
            sc.then(function (scObj) {
                var table = new Table();
                for (var i = 0; i < scObj.data.length; i++) {
                    table.push(scObj.data[i])
                }
                console.log(colors.cyan(table.toString()))
                console.log(colors.cyan("チェック結果をcsvにエクスポートしました"))
                if (result.runScreenshot === "y") {
                    /**
                     * スクリーンショット
                     * @type {Screenshot}
                     */
                    new Screenshot(0, _pages);
                }
            })
        }

        if (result.runSitecheck === "n" && result.runScreenshot === "y") {
            /**
             * スクリーンショット
             * @type {Screenshot}
             */
            new Screenshot(0, _pages);

        }

    })
});


