let app = getApp()
import server from "../../server/server";
Page({
    data: {
        qrCodeUrl: ''
    },
    onLoad() {
        server.pushCode({}).then(res => {
            if (res.code === 0) {
                let url = 'https://admin.ok8809.com' + res.data.images
                this.setData({
                    qrCodeUrl: url
                })
            }
        })
    }
})