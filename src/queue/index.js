export default class Queue {

    /**
     * 初期化
     */
    constructor(queue) {
        this._queue = []

        if (typeof queue === "object") {
            this._queue = Object.assign([], queue);
        }

        this._queuehistory = []
    }

    /**
     * URLを追加する
     * @param key
     */
    add(value) {
        if (this.find(value) === false) {
            this._queue.push(value)
            this._queuehistory.push(value)
        }
    }

    /**
     * URLを削除する
     * @param key
     */
    remove(value) {
        this._queue.forEach((data, datakey) => {
            if (data === value) {
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
    find(value) {
        for (var i = 0; i < this._queue.length; i++) {
            if (value === this._queue[i]) {
                return i;
            }
        }
        return false;
    }

    /**
     * キーから値を取得する
     * @param pointer
     * @returns {boolean}
     */
    get(pointer) {
        return ( this._queue[pointer] ) ? this._queue[pointer] : false;
    }

    /**
     * 保持しているキューを削除
     * @returns {Queue}
     */
    clear() {
        this._queue = []
        return this;
    }

    /**
     * すべて取得する
     * @returns {Array|*}
     */
    all() {
        return this._queue
    }

    /**
     * 次のURLを返す
     * @returns {*}
     */
    next() {
        return this._queue.pop()
    }

    /**
     * queueに残されているかチェック
     * @returns {boolean}
     */
    isNext() {
        return (this._queue.length) ? true : false;
    }

    /**
     * forEachのプロキシ
     * @param callback
     */
    forEach(callback) {
        this._queue.forEach(callback)
    }

    /**
     * ソート
     * @param key 格納するデータがオブジェクトの場合、このキーによってソートする
     * @returns {Queue} インスタンスを返す
     */
    sort(key) {
        var sorttype = "array"
        if (key) {
            sorttype = "object"
        }

        if (sorttype === "array") {
            this._queue.sort()
            return this;
        }
        if (sorttype === "object") {
            this._queue.sort(function (a, b) {
                if (typeof a[key] === "undefined" || typeof b[key] === "undefined") {
                    throw new Error("オブジェクトにキーが見つかりません")
                }
                return (a[key] > b[key])
            })
            return this;
        }
    }
}
