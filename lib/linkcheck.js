import config from "../config.js"
const exec = require('child_process').exec;
const pages = config.pages

// ルートディレクトリ
var rootdir = __dirname.replace("lib","")
var command = rootdir + 'node_modules/broken-link-checker/bin/blc --input ' + pages[0] + ' -rof';
exec(command, (err, stdout, stderr) => {
    console.log(stdout)
});
