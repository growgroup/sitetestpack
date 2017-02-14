import {cleanDirectroy, log} from "./util.js"
import config from "../config.js"
const Pageres = require("pageres")
const defaultPages = config.pages
const options = config.screenshots

export default class Screenshot {

    /**
     * コンストラクタ
     * @param activekey
     */
    constructor(activekey, _pages) {
        this.pages = defaultPages
        if (typeof _pages !== "undefined") {
            this.pages = _pages;
        }
        if (typeof activekey === "undefined") {
            var activekey = 0
        }
        log("スクリーンショットを開始します...");
        this.run = this.run.bind(this)
        this.shot = this.shot.bind(this)

        this.activekey = activekey

        return new Promise((resolve, reject) => {
            this._resolve = resolve
            cleanDirectroy(this.run)
        })
    }

    /**
     * スクリーンショットをデバイスごとに実行する
     */
    run() {
        for (var device in options.viewports) {
            this.shot(this.pages[this.activekey], device)
        }
    }

    /**
     * スクリーンショットを取り、
     * まだURLリストがある場合はもう一度 run メソッドを実行する
     *
     * @param url スクリーンショットを取るURL
     * @param device デバイス
     * @returns {boolean}
     */
    shot(url, device) {




        if (typeof device === "undefined") {
            var device = "pc";
        }

        log("スクリーンショットを変換しています...", device, url);

        var viewports = options.viewports
        let _options = {
            delay: 1
        }
        var pageresoptions = Object.assign(_options, options.pageres)
        const _pageres = new Pageres(pageresoptions)
            .src(url, [viewports[device].width + 'x' + viewports[device].height])
            .dest(options.screenshotPath + device + '/')
            .run()
            .then(() => {
                log("完了しました", device, url);
                this.activekey++
                if (typeof this.pages[this.activekey] === "undefined") {
                    this._resolve(this)
                    return false;
                }
                this.run();
            });
    }

}
