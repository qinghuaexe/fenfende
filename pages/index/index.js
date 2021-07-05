// index.js
// 获取应用实例
const app = getApp()

Page({
    data: {
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
        if (wx.getUserProfile) {
            this.setData({
                canIUseGetUserProfile: true
            })
        }
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
        if (searchType === 'pic') {
            wx.chooseImage({
                sourceType: ['album'],
                success: function(res) {
                    console.log(res);
                },

            })
        } else if (searchType === 'ca') {
            wx.chooseImage({
                sourceType: ['camera'],
                success: function(res) {
                    console.log(res);
                }
            })
        }


    }

})