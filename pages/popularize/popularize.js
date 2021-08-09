const app = getApp()
import server from "../../server/server";


Page({
    data: {
        money: 0,
        order: 0,
        number: '',
        describe: ''
    },
    onLoad() {
        server.payAgency().then(res => {

            if (res.code === 0) {
                this.setData({
                    money: parseInt(res.data.money),
                    order: res.data.order,
                    number: res.data.number
                })
            } else {
                wx.showToast({
                    title: '获取代理订单失败',
                    icon: 'icon',
                    duration: 2000
                })
            }
        })
    },
    submit() {
        if (this.data.number == 0) {
            wx.showToast({
                title: '版本测试中，敬请期待',
                icon: 'none',
                duration: 2000
            })
        } else if (this.data.number == 1) {
            let data = {
                order: this.data.order
            }
            server.payTest(data).then(res => {
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
                            let data = {
                                describe: that.data.describe
                            }
                            server.league(data).then(res => {
                                wx.showToast({
                                    title: res.message,
                                    icon: 'none',
                                    duration: 2000
                                })
                            })
                        },
                        fail: function(res) {},
                        complete: function(res) {}
                    })
                }

            })
        }



    }
})