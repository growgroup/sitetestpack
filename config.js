 const config = {
    pages: [
        "http://example.com/"
    ],
    linkcheck: {},
    getlinks: {
        csv:  __dirname + "/results/getlink_results.csv",
    },
    sitecheck: {
        "csv": __dirname + "/results/sitecheck_results.csv",
    },
    screenshots: {
        screenshotPath: __dirname + '/results/screenshots/',
        "pageres": {
            "delay": 0,
            "timeout": 60,
            "crop": false,
            "css": "",
            "script": "",
            "cookies": ""
        },
        "viewports": {
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
export default config
