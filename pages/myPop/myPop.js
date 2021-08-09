let app = getApp()
import server from "../../server/server";
Page({
    data: {
        qrCodeUrl: '',
        bgUrl: '',
        text1: '',
        text2: '',
        text3: '',
        tempPath: ''
    },
    onLoad() {
        server.popInfo().then(res => {
            if (res.code === 0) {
                this.setData({
                    bgUrl: res.data.tg_img,
                    text1: res.data.tg_txt1,
                    text2: res.data.tg_txt2,
                    text3: res.data.tg_txt3
                })
                server.pushCode({}).then(res => {
                    if (res.code === 0) {
                        let url = 'https://admin.ok8809.com' + res.data.images
                        this.setData({
                            qrCodeUrl: url
                        })
                        this.drawImage()

                    }
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
    drawImage() {
        var that = this
        wx.getImageInfo({
            src: that.data.bgUrl,
            success: function(res) {
                var path1 = res.path
                wx.getImageInfo({
                    src: that.data.qrCodeUrl,
                    success: function(res) {
                        var path2 = res.path
                        const ctx = wx.createCanvasContext('myCanvas')
                            // 底图
                        ctx.drawImage(path1, 0, 0, 375, 686)
                            // 作者名称
                        ctx.setTextAlign('center') // 文字居中
                        ctx.setFillStyle('#ffffff') // 文字颜色：黑色
                        ctx.setFontSize(50) // 文字字号：22px
                        ctx.fillText(that.data.text1, 375 / 2, 120)
                        ctx.setFontSize(14) // 文字字号：22px
                        ctx.fillText(that.data.text2, 375 / 2, 150)
                        ctx.setFontSize(20) // 文字字号：22px
                        ctx.fillText(that.data.text3, 375 / 2, 380)
                        const qrImgSize = 128
                        ctx.drawImage(path2, (375 - qrImgSize) / 2, 395, qrImgSize, qrImgSize)
                        ctx.setFontSize(14) // 文字字号：22px
                        ctx.fillText('长按二维码或扫一扫', 375 / 2, 545)
                        ctx.stroke()
                        ctx.draw(true, () => {
                            wx.canvasToTempFilePath({
                                canvasId: 'myCanvas',
                                success(res) {
                                    that.setData({
                                        tempPath: res.tempFilePath
                                    })
                                }
                            })

                        })
                    }
                })
            }
        })
    },
    shareImage() {
        var cansurl = this.data.tempPath
        wx.showShareImageMenu({
            path: cansurl
        })
    },
    saveImage() {
        var cansurl = this.data.tempPath
        wx.saveImageToPhotosAlbum({
            filePath: cansurl,
            success(res) {
                wx.showModal({
                    content: '图片已保存到相册，赶紧晒一下吧~',
                    showCancel: false,
                    confirmText: '好的',
                    confirmColor: '#333',
                    success: function(res) {
                        if (res.confirm) {

                        }
                    }
                })
            },
            fail(res) {}
        })
    }
})