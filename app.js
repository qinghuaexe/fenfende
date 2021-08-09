// app.js
import sever from './server/server'

App({
    globalData: {
        searchType: '',
        userInfo: {},
        inviteCode: 0
    },



    onLaunch() {
        // 登录
        // wx.login({
        //     success: res => {
        //         // 发送 res.code 到后台换取 openId, sessionKey, unionId
        //         if (res.code) {
        //             let data = {
        //                 code: res.code
        //             }
        //             sever.miniLogin(data).then(res => {
        //                 if (res.code === 0) {
        //                     this.globalData.userInfo = res.data
        //                     wx.showToast({
        //                         title: '小程序启动发起了授权并返回了信息',
        //                         icon: 'none',
        //                         duration: 4000
        //                     })
        //                     wx.setStorageSync('token', res.data.token)
        //                     console.log('2')
        //                 } else {
        //                     wx.showToast({
        //                         title: res.message,
        //                         icon: 'none',
        //                         duration: 2000
        //                     })
        //                 }
        //             })
        //         }
        //     }
        // })
    },

})