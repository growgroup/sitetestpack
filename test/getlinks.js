import GetLinks from "../src/process/getlinks.js"
var assert = require("assert")


describe("GetLinks", function () {
    it("GetLinks#checkURL", function () {
        var gl = new GetLinks("https://grow-group.jp", 10, "")
        assert.equal(gl.checkURL("http://facebook.com/sfasfj"), false)
        assert.equal(gl.checkURL("http://facebook.com/https://grow-group.jp"), false)
        assert.equal(gl.checkURL("https://grow-group.jp/?s=search_string"), false)
        assert.equal(gl.checkURL("https://grow-group.jp/#anchorlink"), false)
    })
})
