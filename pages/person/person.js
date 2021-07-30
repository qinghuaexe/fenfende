const app = getApp()
import server from "../../server/server";

Page({
    data: {
        userInfo: {},
    },
    onLoad() {
        this.setData({
            userInfo: app.globalData.userInfo
        })
    },
    onShow() {
        if (!app.globalData.userInfo.real_name) {
            var that = this
            wx.showModal({
                title: '用户信息授权',
                content: '将获取您的头像、昵称用于页面展示',
                confirmText: '获取授权',
                success(res) {
                    if (res.confirm) {
                        console.log('触发')
                        wx.getUserProfile({
                            desc: '获取头像、昵称',
                            success: (res) => {
                                app.globalData.userInfo.real_name = res.userInfo.nickName
                                app.globalData.userInfo.user_img = res.userInfo.avatarUrl
                                that.setData({
                                    userInfo: app.globalData.userInfo
                                })
                                let data = {
                                    id_number: app.globalData.userInfo.id_number,
                                    real_name: res.userInfo.nickName,
                                    user_img: res.userInfo.avatarUrl
                                }
                                if (app.globalData.inviteCode) {
                                    data.invite_code = app.globalData.inviteCode
                                }
                                server.commitUserInfo(data).then(res => {
                                    wx.showToast({
                                        title: res.message,
                                        icon: 'none',
                                        duration: 2000
                                    })
                                })
                            },
                            fail: (err) => {
                                wx.showToast({
                                    title: '拒绝将无法显示头像与昵称',
                                    icon: 'none',
                                    duration: 2000
                                })
                            }
                        })
                    } else if (res.cancel) {
                        wx.showToast({
                            title: '拒绝将无法显示头像与昵称',
                            icon: 'none',
                            duration: 2000
                        })
                    }
                }
            })

        }
    },
    getPhoneNumber(e) {
        console.log(e)
        if (e.detail.errMsg === 'getPhoneNumber:ok') {
            let data = {
                id_number: app.globalData.userId,
                iv: e.detail.iv,
                encryptedData: e.detail.encryptedData
            }
            server.commitUserInfo(data).then(res => {
                console.log(res)
            })
        }
    },
    // chooseimage: function () {
    //   var that = this;
    //   wx.showActionSheet({
    //     itemList: ['从相册中选择', '拍照'],
    //     itemColor: "#CED63A",
    //     success: function (res) {
    //       if (!res.cancel) {
    //         if (res.tapIndex == 0) {
    //           that.chooseWxImage('album')
    //         } else if (res.tapIndex == 1) {
    //           that.chooseWxImage('camera')
    //         }
    //       }
    //     }
    //   })

    // },

    // chooseWxImage: function () {
    //   var that = this;
    //   wx.chooseImage({
    //     sourceType: ['camera'],
    //     success: function (res) {
    //       console.log(res);
    //     }
    //   })
    // },
    // hahhaha: function () {
    //   wx.showModal({
    //     title: '提示',
    //     content: '这是一个模态弹窗',
    //     success (res) {
    //       if (res.confirm) {
    //         console.log('用户点击确定')
    //       } else if (res.cancel) {
    //         console.log('用户点击取消')
    //       }
    //     }
    //   })
    // },
    handleToVip: () => {
        wx.navigateTo({
            url: '../vip/vip'
        })
    },
    handleToGroup: () => {
        wx.navigateTo({
            url: '../group/group'
        })
    },
    handleToPop: function() {
        wx.navigateTo({
            url: '../popularize/popularize'
        })
    },
    handleGomyPop: function() {
        wx.navigateTo({
            url: '../myPop/myPop'
        })
    }
})