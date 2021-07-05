const app = getApp()

// import server from '../../server/server'
Page({
    data: {

    },
    onLoad () {
        console.log(app.globalData.searchType)
    },
    onShow () {
        console.log(app.globalData.searchType)
    },
    haha: function () {

        // app.globalData.openid = '你不好'
        // console.log(app.globalData)
        // server.getList().then(res => {

        // })
    }
})