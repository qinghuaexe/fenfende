const app = getApp()
import server from "../../server/server";

Page({
    data: {
        rechargeList: [],
        currentIndex: 0,
        order: ''

    },

    tabClick: function(e) {
        let index = e.currentTarget.dataset.index
        this.setData({
            currentIndex: index,
            order: this.data.rechargeList[index].order
        });
    },
    onLoad() {
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
    },
    pay: function() {
        let data = {
            order: this.data.order
        }
        server.payTest(data).then(res => {
            console.log(res)
            if (res.code === 0) {
                let info = res.data
                wx.requestOrderPayment({
                    // "appId": "wx96d855cefa0a7e62",
                    timeStamp: info.timeStamp,
                    nonceStr: info.nonceStr,
                    package: info.package,
                    signType: info.signType,
                    paySign: info.paySign,
                    success: function(res) {
                        console.log(res)
                    },
                    fail: function(res) {
                        console.log(res)
                        console.log(info)
                    },
                    complete: function(res) {
                        console.log(res)
                    }
                })
            }

        })
    }

})