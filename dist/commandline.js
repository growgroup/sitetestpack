"use strict";var _getlinks = require("./getlinks.js");var _getlinks2 = _interopRequireDefault(_getlinks);
var _sitecheck = require("./sitecheck.js");var _sitecheck2 = _interopRequireDefault(_sitecheck);
var _screenshot = require("./screenshot.js");var _screenshot2 = _interopRequireDefault(_screenshot);
var _prompt = require("prompt");var _prompt2 = _interopRequireDefault(_prompt);
var _safe = require("colors/safe");var _safe2 = _interopRequireDefault(_safe);
var _cliTable = require("cli-table2");var _cliTable2 = _interopRequireDefault(_cliTable);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}


var TITLE = "\n     _____  _____  _____  _____    _____  _____  _____  _____    _____  _____  _____  _____\n    |   __||     ||_   _||   __|  |_   _||   __||   __||_   _|  |  _  ||  _  ||     ||  |  |\n    |__   ||-   -|  | |  |   __|    | |  |   __||__   |  | |    |   __||     ||   --||    -|\n    |_____||_____|  |_|  |_____|    |_|  |_____||_____|  |_|    |__|   |__|__||_____||__|__|\n    ";






console.log(_safe2.default.magenta(TITLE));
_prompt2.default.message = _safe2.default.magenta("SiteTestPack");
_prompt2.default.delimiter = _safe2.default.green(":");

_prompt2.default.start();
_prompt2.default.get({
    properties: {
        url: {
            description: _safe2.default.magenta("1. チェックする基点となるURLを入力してください"),
            required: true },

        number: {
            description: _safe2.default.magenta("2. 取得するURLの上限値を指定してください"),
            default: 100,
            type: 'integer' },

        ignoreurl: {
            description: _safe2.default.magenta("3. 無視するURLのパターンを入力してください(正規表現可)"),
            default: false },

        runSitecheck: {
            description: _safe2.default.magenta("4. サイトチェックを実行しますか？(y or n))"),
            default: "y" },

        runScreenshot: {
            description: _safe2.default.magenta("5. スクリーンショットを撮りますか？(y or n)"),
            default: "y" } } },


function (err, result) {
    if (err) {
        throw err;
    }

    /**
       * 1. リンクを取得する
       */
    console.log(_safe2.default.cyan(result.url + " からURL一覧を取得しています...."));
    var getlinks = new _getlinks2.default(result.url, "", result.number, result.ignoreurl);
    getlinks.then(function (data) {
        var table = new _cliTable2.default({
            head: ["url", "title"] });

        var _pages = [];
        for (var i = 0; i < data.length; i++) {
            table.push([data[i].url, data[i].title]);
            _pages.push(data[i].url);
        }
        console.log(_safe2.default.cyan(table.toString()));
        if (result.runSitecheck === "y") {
            /**
                                           * 2. サイトチェック
                                           * @type {SiteCheck}
                                           */
            console.log(_safe2.default.cyan("サイトチェックを開始しています...."));
            var sc = new _sitecheck2.default(_pages);
            sc.then(function (scObj) {
                var table = new _cliTable2.default();
                for (var i = 0; i < scObj.data.length; i++) {
                    table.push(scObj.data[i]);
                }
                console.log(_safe2.default.cyan(table.toString()));
                console.log(_safe2.default.cyan("チェック結果をcsvにエクスポートしました"));
                if (result.runScreenshot === "y") {
                    /**
                                                    * スクリーンショット
                                                    * @type {Screenshot}
                                                    */
                    new _screenshot2.default(0, _pages);
                }
            });
        }

        if (result.runSitecheck === "n" && result.runScreenshot === "y") {
            /**
                                                                           * スクリーンショット
                                                                           * @type {Screenshot}
                                                                           */
            new _screenshot2.default(0, _pages);

        }

    });
});