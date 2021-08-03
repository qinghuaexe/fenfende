const app = getApp()

import server from '../../server/server'

Page({
    data: {
        integration: '',
        jifen: 0,
        proportion: 0
    },
    onLoad() {
        server.getWithdraw().then(res => {
            if (res.code === 0) {
                this.setData({
                    jifen: res.data.scorecard,
                    proportion: res.data.rmb
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
    handleGoRecord: function() {
        wx.navigateTo({ url: '../withdrawRecord/withdrawRecord' })
    },
    submit() {
        if (!this.data.integration) {
            wx.showToast({
                title: '请填写提现积分'
            })
            return
        }
        if (this.data.integration >= this.data.jifen) {
            wx.showToast({
                title: '积分余额不足'
            })
            return
        }
        let data = {
            scorecard: this.data.integration
        }
        server.submitWithdraw(data).then(res => {
            wx.showToast({
                title: res.message,
                icon: 'none',
                duration: 2000
            })
        })

    }
})