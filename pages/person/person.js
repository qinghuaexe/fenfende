const app = getApp()
import server from "../../server/server";

Page({
    data: {
        userType: '',
        userInfo: {},
        userTypeList: ['非会员', '普通会员', '终身会员'],
        scorecard: 0,
        teamNumber: 0,
        test_type: 0
    },
    onLoad() {
        this.setData({
            userInfo: app.globalData.userInfo
        })
    },
    onShow() {
        server.getUserInfo().then(res => {

            if (res.code === 0) {

                this.setData({
                    remaining: res.data.number,
                    userType: this.data.userTypeList[res.data.user_type],
                    scorecard: parseInt(res.data.scorecard),
                    teamNumber: res.data.teamNumber,
                    test_type: res.data.test_type
                })
            }



        })
        if (!app.globalData.userInfo.real_name) {
            var that = this
            wx.showModal({
                title: '用户信息授权',
                content: '将获取您的头像、昵称用于页面展示',
                confirmText: '获取授权',
                success(res) {
                    if (res.confirm) {
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