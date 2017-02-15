export default class Queue {

    /**
     * 初期化
     */
    constructor() {
        this._queue = []
        this._queuehistory = []
    }

    /**
     * URLを追加する
     * @param key
     */
    add(key) {
        if (this.find(key) === false) {
            this._queue.push(key)
            this._queuehistory.push(key)
        }
    }

    /**
     * URLを削除する
     * @param key
     */
    remove(key) {
        this._queue.forEach((data, datakey) => {
            if (data === key) {
                this._queue.splice(datakey, 1)
                return false;
            }
        })
    }

    /**
     * keyを探し、あった場合には添字を返す
     *
     * @param key
     * @returns {*} boolean or int
     */
    find(key) {
        for (var i = 0; i < this._queue.length; i++) {
            if (key === this._queue[i]) {
                return i;
            }
        }
        return false;
    }

    /**
     * 次のURLを返す
     * @returns {*}
     */
    next() {
        return this._queue.pop()
    }
}
