// app.js
App({
    globalData: {
        searchType: ''
    },

    onLaunch() {
        // 展示本地存储能力
        const logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
        console.log('hahah')

        // 登录
        wx.login({

            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                console.log(this.globalData)
                console.log(res)
            }
        })
    },
})