const GetLinks = require("./dist/process/getlinks.js")
const ScreenShot = require("./dist/process/screenshot.js")
const SiteCheck = require("./dist/process/sitecheck.js")

module.exports = {
    getlinks: GetLinks,
    screenshot: ScreenShot,
    sitecheck: SiteCheck,
}
