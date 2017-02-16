import ConfigStore from "configstore"
const pkg = require("../package.json")

class Config {

    constructor() {
        this.setResultsRootPath(__dirname + "/results/")
        this.setData()
    }

    setData() {
        /**
         * 初期値
         * @type {{pages: [*], linkcheck: {}, getlinks: {csv: string}, sitecheck: {csv: string}, screenshots: {screenshotPath: string, pageres: {delay: number, timeout: number, crop: boolean, css: string, script: string, cookies: string}, viewports: {pc: {width: number, height: number}, smp: {width: number, height: number}}}}}
         * @private
         */
        var _defaults = {
            resultsDirPath: this.getResultsRootPath(),
            pages: [
                "http://example.com/"
            ],
            linkcheck: {},
            getlinks: {
                output: "getlink_results.csv",
            },
            sitecheck: {
                output: "sitecheck_results.csv",
            },
            screenshot: {
                dir: '/screenshots/',
                pageres: {
                    "delay": 0,
                    "timeout": 60,
                    "crop": false,
                    "css": "",
                    "script": "",
                    "cookies": ""
                },
                viewports: {
                    "pc": {
                        "width": 1920,
                        "height": 720
                    },
                    "smp": {
                        "width": 320,
                        "height": 568
                    }
                }
            }
        }

        this.data = new ConfigStore(pkg.name, _defaults)
    }

    /**
     * 結果ファイルのパスをセットする
     * @param path
     */
    setResultsRootPath(path) {
        this.resultsRootPath = path
    }

    getResultsRootPath() {
        return this.resultsRootPath
    }

    /**
     * 設定を取得する
     * @param key
     * @returns {*}
     */
    get(key) {
        return this.data.get(key)
    }

    /***
     * 設定をセットする
     * @param key
     * @param value
     * @returns {Config}
     */
    set(key, value) {
        this.data.set(key, value)
        return this
    }

    /**
     * すべての設定を取得する
     * @returns {*}
     */
    all() {
        return this.data.all()
    }

    clear() {
        return this.data.clear()
    }

    getDataObject() {
        return this.data
    }

}



export default new Config()
