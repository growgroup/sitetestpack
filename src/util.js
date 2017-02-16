import chalk from "chalk"
import fs from "fs-extra"
import config from "./config.js"
const options = config.get("screenshot");

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
 * ディレクトリを作成する
 *
 * @returns Promise オブジェクト
 */
export const makeDirectory = function () {

    return new Promise(function (resolve, reject) {
        var viewportsLen = Object.keys(options.viewports).length;

        var forCounter = 1;
        for (var device in options.viewports) {
            fs.ensureDir(config.get("resultsDirPath") + options.dir + "/" + device, function (err) {
                if (err) {
                    reject()
                    return false;
                }
                if (forCounter === viewportsLen) {
                    resolve();
                }
                forCounter++;
            });
        }
    })
}

/**
 * ディレクトリを削除する
 *
 * @returns Promise オブジェクトを返す
 */
export const cleanDirectroy = function () {
    return new Promise(function (resolve, reject) {
        fs.remove(config.get("resultsDirPath") + options.dir, function () {
            log("ディレクトリを清掃...")
            makeDirectory().then(function () {
                resolve();
            });
        })
    })
}
