import chalk from "chalk"
import fs from "fs-extra"
import config from "../config.js"

/**
 * ログを出力
 */
export const log = function (text, device, url) {
    let log = chalk.blue.bold('[sitetestpack] ');
    if (typeof url !== "undefined" && url !== false) {
        log += chalk.green.bold(" " + url + " ");
    }
    if (typeof device !== "undefined" && device !== false) {
        log += chalk.red.bold(" (" + device.toUpperCase() + ") ");
    }
    log += " " + text;
    console.log(log)
}


/**
 * ディレクトリを削除する
 *
 * @returns Promise オブジェクトを返す
 */
export const cleanDirectroy = function () {
    return new Promise(function (resolve, reject) {
        fs.remove(config.get("resultsDirPath"), function () {
            resolve();
        })
    })
}
