import Screenshot from "../src/screenshot.js"
import fs from "fs-extra"
var assert = require("assert");

var pages = [
    "https://grow-group.jp",
    "https://grow-group.jp/company/",
]

describe("Screenshot",function(){
    var sc = new Screenshot(0, pages);
    sc.then(function(key){
        assert(key,1)
    })
})
