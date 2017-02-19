import ConfigStore from "configstore"
const pkg = require("../package.json")

export default new ConfigStore(pkg.name, {
        resultsDirPath: __dirname + "/results/",
        pages: [
            "http://example.com/"
        ],
        linkcheck: {},
        getlinks: {
            output: "getlink_results.csv",
        },
        sitecheck: {
            output: "sitecheck_results.csv",
            htmllintRules: {
                "attr-bans": ['align', 'background', 'bgcolor', 'border', 'frameborder', 'longdesc', 'marginwidth', 'marginheight', 'scrolling', 'width'],
                "attr-no-dup": false,
                "attr-quote-style": false,
                "attr-name-style": true,
                "head-req-title": true,
                "href-style": false,
                "id-class-style": false,
                "img-req-alt": true,
                "img-req-src": true,
                "indent-style": false,
                "indent-width": false,
                "indent-width-cont": false,
                "tag-close": true
            }
        },
        screenshot: {
            dir: '/screenshots/',
            pageres: {
                "delay": 0,
                "timeout": 60,
                "crop": false,
                "css": "",
                "script": "",
                "cookies": ""
            },
            viewports: {
                "pc": {
                    "width": 1920,
                    "height": 720
                },
                "smp": {
                    "width": 320,
                    "height": 568
                }
            }
        }
    }
)
