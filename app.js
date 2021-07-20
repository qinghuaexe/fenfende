// app.js
import sever from './server/server'

App({
    globalData: {
        searchType: '',
        userInfo: {}
    },

    onLaunch() {
        // 展示本地存储能力
        const logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
        let wxUserInfo = wx.getStorageSync('wxUserInfo')

        // if (!wxUserInfo) {

        //     wx.showModal({
        //         title: '用户授权',
        //         content: '将获取用户信息用于完善会员资料',
        //         confirmText: '获取授权',
        //         success(res) {
        //             if (res.confirm) {
        //                 console.log('用户点击确定')
        //                 wx.getUserProfile({
        //                     desc: '用于完善会员资料',
        //                     success: (res) => {
        //                         console.log(res)
        //                     },
        //                     fail: () => {
        //                         wx.showToast({
        //                             title: '拒绝将无法显示头像与昵称',
        //                             icon: 'none',
        //                             duration: 2000
        //                         })
        //                     }
        //                 })
        //             } else if (res.cancel) {
        //                 wx.showToast({
        //                     title: '拒绝将无法显示头像与昵称',
        //                     icon: 'none',
        //                     duration: 2000
        //                 })
        //             }
        //         }
        //     })



        // }


        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                if (res.code) {
                    let data = {
                        code: res.code
                    }
                    sever.miniLogin(data).then(res => {
                        if (res.code === 0) {
                            this.globalData.userInfo = res.data
                            wx.setStorageSync('token', res.data.token)
                        } else {
                            wx.showToast({
                                title: res.message,
                                icon: 'none',
                                duration: 2000
                            })
                        }
                    })
                }
            }
        })
    },

})