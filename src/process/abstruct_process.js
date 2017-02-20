export default class AbstructProcess {

    constructor(){
        this.setPromise();
    }

    getPromise() {
        return this._promise
    }

    setPromise() {
        this._promise = new Promise((resolve, reject) => {
            this._resolve = resolve
            this._reject = reject
        })
        return this
    }

    resolve(){
        this._resolve(arguments)
        return this
    }

    then(callback){
        this._promise.then(callback)
        return this
    }

    catch(callback){
        this._promise.catch(callback)
        return this
    }

}
