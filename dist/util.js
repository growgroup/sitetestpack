"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.cleanDirectroy = exports.makeDirectory = exports.log = undefined;var _chalk = require("chalk");var _chalk2 = _interopRequireDefault(_chalk);
var _fsExtra = require("fs-extra");var _fsExtra2 = _interopRequireDefault(_fsExtra);
var _config = require("./config.js");var _config2 = _interopRequireDefault(_config);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}
var options = _config2.default.get("screenshots");

/**
                                                    * ログを出力
                                                    */
var log = exports.log = function log(text, device, url) {
    var log = _chalk2.default.blue.bold('[sitetestpack] ');

    if (typeof url !== "undefined" && url !== false) {
        log += _chalk2.default.green.bold(" " + url + " ");
    }

    if (typeof device !== "undefined" && device !== false) {
        log += _chalk2.default.red.bold(" (" + device.toUpperCase() + ") ");
    }

    log += " " + text;
    console.log(log);
};

/**
    * ディレクトリを作成
    */
var makeDirectory = exports.makeDirectory = function makeDirectory(callback) {
    for (var device in options.viewports) {
        _fsExtra2.default.ensureDirSync(_config2.default.get("resultsDirPath") + options.dir + "/" + device, function (err) {
            if (err) {
                console.log(err);
                return false;
            }
        });
    }
    callback();
};

// ディレクトリをキレイに
var cleanDirectroy = exports.cleanDirectroy = function cleanDirectroy(callback) {
    _fsExtra2.default.removeSync(_config2.default.get("resultsDirPath") + options.dir, function () {
        log("ディレクトリを清掃...");
        makeDirectory(callback);
    });
};