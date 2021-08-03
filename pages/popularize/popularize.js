const app = getApp()
import server from "../../server/server";


Page({
    data: {
        describe: ''
    },
    submit() {
        let data = {
            describe: this.data.describe
        }
        server.league(data).then(res => {
            wx.showToast({
                title: res.message,
                icon: 'none',
                duration: 2000
            })
        })
    }
})