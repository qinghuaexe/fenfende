// index.js
// 获取应用实例
const app = getApp()

import server from "../../server/server";

Page({
    data: {
        phoneStatus: '',
        swiperList: [
            [{ avator: '/static/images/avator.png', name: '李先生', time: '15:30 48秒' },
                { avator: '/static/images/avator.png', name: '赵先生', time: '15:30 48秒' }
            ],
            [{ avator: '/static/images/avator.png', name: '王先生', time: '15:30 48秒' },
                { avator: '/static/images/avator.png', name: '马先生', time: '15:30 48秒' }
            ],
            [{ avator: '/static/images/avator.png', name: '赵大', time: '15:30 48秒' },
                { avator: '/static/images/avator.png', name: '李小', time: '15:30 48秒' }
            ]
        ]

    },
    // 事件处理函数

    onLoad() {
        var that = this
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                if (res.code) {
                    let data = {
                        code: res.code
                    }
                    server.miniLogin(data).then(res => {
                        if (res.code === 0) {
                            console.log('获取数据完成')
                            app.globalData.userInfo = res.data
                            that.setData({
                                phoneStatus: res.data.phone_status
                            })
                        } else {

                        }
                    })
                }
            }
        })
    },
    onShow() {

    },
    getUserProfile(e) {
        // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
        wx.getUserProfile({
            desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
                console.log(res)
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        })
    },
    getPhoneNumber(e) {
        if (e.detail.errMsg === 'getPhoneNumber:ok') {
            let data = {
                id_number: app.globalData.userInfo.id_number,
                iv: e.detail.iv,
                encryptedData: e.detail.encryptedData
            }
            server.decryptUserPhone(data).then(res => {
                if (res.code === 0) {
                    app.globalData.userInfo.phone_status = true
                    this.setData({
                        phoneStatus: true
                    })
                }
                wx.showToast({
                    title: res.message,
                    icon: 'none',
                    duration: 2000
                })
            })
        } else {
            wx.showToast({
                title: '拒绝授权将无法使用该功能',
                icon: 'none',
                duration: 3000
            })
        }
    },

    handleGoVip: function() {
        wx.navigateTo({ url: '../vip/vip' })
    },

    handleGomyPop: function() {
        wx.navigateTo({ url: '../myPop/myPop' })
    },

    handleGoPop: function() {
        wx.navigateTo({ url: '../popularize/popularize' })
    },

    handleGoSearch: function(e) {
        let searchType = e.currentTarget.dataset.type
        app.globalData.searchType = searchType
        wx.switchTab({ url: `../search/search` })
            // if (searchType === 'pic') {
            //     wx.chooseImage({
            //         sourceType: ['album'],
            //         success: function(res) {
            //             console.log(res);
            //         },

        //     })
        // } else if (searchType === 'ca') {
        //     wx.chooseImage({
        //         sourceType: ['camera'],
        //         success: function(res) {
        //             console.log(res);
        //         }
        //     })
        // }


    }

})