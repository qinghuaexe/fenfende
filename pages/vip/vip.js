const app = getApp()
import server from "../../server/server";

Page({
    data: {
        rechargeList: [],
        currentIndex: 0,
        order: '',
        userInfo: {},
        userTypeList: ['普通用户', '普通会员', '终身会员'],
        userType: ''
    },

    tabClick: function(e) {
        let index = e.currentTarget.dataset.index
        this.setData({
            currentIndex: index,
            order: this.data.rechargeList[index].order
        });
    },
    onLoad() {
        this.setData({
            userInfo: app.globalData.userInfo
        })
        server.payList({}).then(res => {
            if (res.code === 0) {
                res.data = res.data.map(item => {
                    return {
                        ...item,
                        money: parseInt(item.money)
                    }
                })
                this.setData({
                    rechargeList: res.data,
                    order: res.data[0].order
                })
            } else {
                wx.showToast({
                    title: res.message,
                    icon: 'none',
                    duration: 2000
                })
            }

        })
        server.getUserInfo().then(res => {

            if (res.code === 0) {

                this.setData({
                    userType: this.data.userTypeList[res.data.user_type]
                })
            }



        })

    },
    pay: function() {
        let data = {
            order: this.data.order
        }
        server.payTest(data).then(res => {
            console.log(res)
            if (res.code === 0) {
                let info = res.data
                var that = this
                wx.requestOrderPayment({
                    timeStamp: info.timeStamp,
                    nonceStr: info.nonceStr,
                    package: info.package,
                    signType: info.signType,
                    paySign: info.paySign,
                    success: function(res) {
                        server.getUserInfo().then(res => {
                            if (res.code === 0) {
                                that.setData({
                                    userType: that.data.userTypeList[res.data.user_type]
                                })
                            }
                        })
                    },
                    fail: function(res) {},
                    complete: function(res) {}
                })
            }

        })
    }

})