import Queue from "../src/queue"
var assert = require("assert");

var pagelist = [
    "https://grow-group.jp",
    "https://grow-group.jp/company/",
    "https://grow-group.jp/sitemap/",
]

describe("Queue",function(){
    it("Queue#next",function(){
        var queue = new Queue(pagelist)
        assert.equal(queue.next(),pagelist[2])
    })
    it("Queue#add",function(){
        var queue = new Queue(pagelist)
        queue.add("https://grow-group.jp/recruit/")
        assert.equal(queue.next(),"https://grow-group.jp/recruit/")
    })
    it("Queue#remove",function(){
        var queue = new Queue(pagelist)
        queue.remove("https://grow-group.jp")
        assert.equal(queue._queue[0],"https://grow-group.jp/company/")
    })

    it("Queue#find",function(){
        var queue = new Queue(pagelist)
        assert.equal(queue.find("https://grow-group.jp/company/"),1)
    })

    it("Queue#isNext",function(){
        var queue = new Queue(pagelist)
        assert.equal(queue.isNext(),true)
        queue.remove("https://grow-group.jp")
        queue.remove("https://grow-group.jp/company/")
        queue.remove("https://grow-group.jp/sitemap/")
        assert.equal(queue.isNext(),false)
    })

    it("Queue#get",function(){
        var queue = new Queue(pagelist)
        assert.equal(queue.get(1),"https://grow-group.jp/company/")
    })

    it("Queue#clear",function(){
        var queue = new Queue(pagelist)
        queue.clear()
        assert.equal(queue.get(0),false)
    })
    it("Queue#all",function(){
        var queue = new Queue(pagelist)
        var all = queue.all()
        assert.deepEqual(all,pagelist)
    })
})
