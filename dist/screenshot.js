"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();var _util = require("./util.js");
var _config = require("./config.js");var _config2 = _interopRequireDefault(_config);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}
var Pageres = require("pageres");
var defaultPages = _config2.default.get("pages");
var options = _config2.default.get("screenshots");var

Screenshot = function () {

    /**
                           * コンストラクタ
                           * @param activekey
                           */
    function Screenshot(activekey, _pages) {var _this = this;_classCallCheck(this, Screenshot);
        this.pages = defaultPages;
        if (typeof _pages !== "undefined") {
            this.pages = _pages;
        }
        if (typeof activekey === "undefined") {
            var activekey = 0;
        }
        (0, _util.log)("スクリーンショットを開始します...");
        this.run = this.run.bind(this);
        this.shot = this.shot.bind(this);

        this.activekey = activekey;

        return new Promise(function (resolve, reject) {
            _this._resolve = resolve;
            (0, _util.cleanDirectroy)(_this.run);
        });
    }

    /**
       * スクリーンショットをデバイスごとに実行する
       */_createClass(Screenshot, [{ key: "run", value: function run()
        {
            for (var device in options.viewports) {
                this.shot(this.pages[this.activekey], device);
            }
        }

        /**
           * スクリーンショットを取り、
           * まだURLリストがある場合はもう一度 run メソッドを実行する
           *
           * @param url スクリーンショットを取るURL
           * @param device デバイス
           * @returns {boolean}
           */ }, { key: "shot", value: function shot(
        url, device) {var _this2 = this;

            if (typeof device === "undefined") {
                var device = "pc";
            }

            (0, _util.log)("スクリーンショットを変換しています...", device, url);

            var viewports = options.viewports;
            var _options = {
                delay: 1 };

            var pageresoptions = Object.assign(_options, options.pageres);
            var _pageres = new Pageres(pageresoptions).
            src(url, [viewports[device].width + 'x' + viewports[device].height]).
            dest(options.dir + device + '/').
            run().
            then(function () {
                (0, _util.log)("完了しました", device, url);
                _this2.activekey++;
                if (typeof _this2.pages[_this2.activekey] === "undefined") {
                    _this2._resolve(_this2);
                    return false;
                }
                _this2.run();
            });
        } }]);return Screenshot;}();exports.default = Screenshot;