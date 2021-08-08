// index.js
// 获取应用实例
const app = getApp()

import server from "../../server/server";
import { formatTime } from '../../utils/util'

Page({
    data: {
        phoneStatus: false,
        homeSlide: [],
        swiperList: []

    },
    // 事件处理函数

    onLoad(options) {
        if (options.scene) {
            app.globalData.inviteCode = options.scene
        }
        var that = this
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                app.globalData.code = res.code
                if (res.code) {
                    let data = {
                        code: res.code
                    }
                    server.miniLogin(data).then(res => {
                        app.globalData.user = JSON.stringify(res)
                        if (res.code === 0) {
                            app.globalData.userInfo = res.data
                            wx.setStorageSync('token', res.data.token)
                            if (res.data.phone) {
                                this.setData({
                                    phoneStatus: true
                                })
                            }
                        } else {
                            wx.showToast({
                                title: res.message,
                                icon: 'none',
                                duration: 2000
                            })
                        }
                    })
                }
            },
            fail: res => {
                wx.showToast({
                    title: '获取授权code失败',
                    icon: 'none',
                    duration: 2000
                })
            }
        })


    },
    onShow() {
        server.homeSlide().then(res => {
            if (res.code == 0) {
                this.setData({
                    homeSlide: res.data.home_img
                })
            } else {
                wx.showToast({
                    title: res.message,
                    icon: 'none',
                    duration: 2000
                })
            }
        })
        server.countUserActive().then(res => {
            if (res.code == 0) {
                res.data = res.data.map(item => {
                    return {
                        ...item,
                        create_time: formatTime(item.create_time * 1000, 1)
                    }
                })
                let tempList = []
                res.data.forEach((element, index) => {
                    if (index % 2 === 0) {
                        let temp = []
                        temp.push(res.data[index])
                        if (index < res.data.length - 1) {
                            temp.push(res.data[index + 1])
                        }
                        tempList.push(temp)
                    }
                });
                this.setData({
                    swiperList: tempList
                })
            }
        })
    },
    getPhoneNumber(e) {
        if (e.detail.errMsg === 'getPhoneNumber:ok') {
            let data = {
                id_number: app.globalData.userInfo.id_number,
                iv: encodeURIComponent(e.detail.iv, "UTF-8"),
                encryptedData: encodeURIComponent(e.detail.encryptedData, "UTF-8")
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
    handleGoTest: function() {
        wx.navigateTo({ url: '../test/test' })
    },

    handleGoSearch: function(e) {
        let searchType = e.currentTarget.dataset.type
        app.globalData.searchType = searchType
        wx.switchTab({ url: `../search/search` })
    }

})