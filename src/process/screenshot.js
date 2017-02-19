import {log} from "../misc/util.js"
import Queue from "../queue"
import config from "../config.js"
const Pageres = require("pageres")
const options = config.get("screenshot")

class Screenshot {
    /**
     * @param _pages スクリーンショットを撮る配列
     */
    constructor(_pages) {

        if (typeof _pages === "undefined") {
            throw new Error("Invaild Paramater")
        }

        this._pageres = new Pageres(
            Object.assign(
                {
                    delay: 1
                },
                options.pageres
            )
        )

        this.queue = new Queue(_pages)

        this.shot = this.shot.bind(this)

        return new Promise((resolve, reject) => {
            this._resolve = resolve
            this.shot()
        })
    }

    /**
     * スクリーンショットを取り、
     * まだURLリストがある場合はもう一度 run メソッドを実行する
     *
     * @returns {boolean}
     */
    shot() {

        log("スクリーンショットを変換しています...");
        var dimension = []
        for (var device in options.viewports) {
            dimension.push(options.viewports[device].width + 'x' + options.viewports[device].height)
        }

        while (this.queue.isNext()) {
            var url = this.queue.next()
            this._pageres
                .src(url, dimension)
        }

        this._pageres
            .dest(config.get("resultsDirPath") + options.dir)
            .run()
            .then(() => {
                log("完了しました");
                this._resolve()
                return false;
            });

    }
}
export default Screenshot
