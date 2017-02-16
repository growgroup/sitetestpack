"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();var _configstore = require("configstore");var _configstore2 = _interopRequireDefault(_configstore);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}
var pkg = require("../package.json");var

Config = function () {

    function Config(defaults) {_classCallCheck(this, Config);
        this.setResultsRootPath(__dirname + "/results/");
        this.setData(defaults);
    }_createClass(Config, [{ key: "setData", value: function setData(

        defaults) {
            /**
                    * 初期値
                    * @type {{pages: [*], linkcheck: {}, getlinks: {csv: string}, sitecheck: {csv: string}, screenshots: {screenshotPath: string, pageres: {delay: number, timeout: number, crop: boolean, css: string, script: string, cookies: string}, viewports: {pc: {width: number, height: number}, smp: {width: number, height: number}}}}}
                    * @private
                    */
            var _defaults = {
                resultsDirPath: this.getResultsRootPath(),
                pages: [
                "http://example.com/"],

                linkcheck: {},
                getlinks: {
                    output: "getlink_results.csv" },

                sitecheck: {
                    output: "sitecheck_results.csv" },

                screenshot: {
                    dir: '/screenshots/',
                    pageres: {
                        "delay": 0,
                        "timeout": 60,
                        "crop": false,
                        "css": "",
                        "script": "",
                        "cookies": "" },

                    viewports: {
                        "pc": {
                            "width": 1920,
                            "height": 720 },

                        "smp": {
                            "width": 320,
                            "height": 568 } } } };





            this.data = new _configstore2.default(pkg.name, Object.assign(defaults, _defaults));
        }

        /**
           * 結果ファイルのパスをセットする
           * @param path
           */ }, { key: "setResultsRootPath", value: function setResultsRootPath(
        path) {
            this.resultsRootPath = path;
        } }, { key: "getResultsRootPath", value: function getResultsRootPath()

        {
            return this.resultsRootPath;
        }

        /**
           * 設定を取得する
           * @param key
           * @returns {*}
           */ }, { key: "get", value: function get(
        key) {
            return this.data.get(key);
        }

        /***
           * 設定をセットする
           * @param key
           * @param value
           * @returns {Config}
           */ }, { key: "set", value: function set(
        key, value) {
            this.data.set(key, value);
            return this;
        }

        /**
           * すべての設定を取得する
           * @returns {*}
           */ }, { key: "all", value: function all()
        {
            return this.data.all();
        } }, { key: "clear", value: function clear()

        {
            return this.data.clear();
        } }, { key: "getDataObject", value: function getDataObject()

        {
            return this.data;
        } }]);return Config;}();exports.default = Config;