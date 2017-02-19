import Queue from "./index.js"

export default class LinkQueue extends Queue {

    constructor() {
        super()
    }

    /**
     * URLを追加する
     * @param key
     */
    add(key) {
        if (!key) {
            return false;
        }
        if (key.slice(-1) !== "/") {
            key += "/"
        }
        var _url = key
        if (this.find(_url) === false && this.isVisited(_url) === false) {
            this._queue.push(_url)
            this._queuehistory.push(_url)
        }
    }

    /**
     * すでに訪れたことがあるか判断
     * @param url
     * @returns {boolean}
     */
    isVisited(url) {
        for (var i = 0; i < this._queuehistory.length; i++) {
            if (url === this._queuehistory[i]) {
                return true;
            }
        }
        return false;
    }
}
