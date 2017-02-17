import {cleanDirectroy, log} from "./util.js"
import Queue from "./queue.js"
import config from "./config.js"

const Pageres = require("pageres")
const options = config.get("screenshot")

export default class Screenshot {

    /**
     * コンストラクタ
     * @param activekey
     */
    constructor(_pages) {

        if (typeof _pages === "undefined") {
            throw new Error("スクリーンショットを撮るURLがありません")
        }

        if (typeof activekey === "undefined") {
            var activekey = 0
        }

        this.queue = new Queue(_pages)

        this.run = this.run.bind(this)
        this.shot = this.shot.bind(this)

        return new Promise((resolve, reject) => {
            this._resolve = resolve
            var self = this;
            // cleanDirectroy().then(function () {
            self.run()
            // })
        })
    }


    /**
     * スクリーンショットをデバイスごとに実行する
     */
    run() {
        for (var device in options.viewports) {
            this.shot(this.queue.next(), device)
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
        new Pageres(pageresoptions)
            .src(url, [viewports[device].width + 'x' + viewports[device].height])
            .dest(config.get("resultsDirPath") + options.dir + device + '/')
            .run()
            .then(() => {
                log("完了しました", device, url);
                if (typeof this.queue.next() === "undefined") {
                    this._resolve()
                    return false;
                }
                this.run();
            });
    }

}
