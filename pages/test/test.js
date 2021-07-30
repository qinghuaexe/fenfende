const app = getApp()

Page({
    data: {
        load: '',
        code: '',
        user: '',
        show: '',
        showInfo: '',
        code1: '',
        canvasWidth: '',
        canvasHeight: '',
        imgList: [],
        imgSrc: ''
    },

    onLoad() {

    },
    onShow() {
        this.setData({
            load: app.globalData.statusload,
            show: app.globalData.statusShow,
            code: app.globalData.code,
            user: app.globalData.user,
            showInfo: app.globalData.showInfo,
            code1: app.globalData.inviteCode
        })
    },
    draw: function() {
        var that = this
        wx.getImageInfo({
            src: 'https://admin.ok8809.com/tgbj.jpg',
            success: function(res) {
                var path1 = res.path
                wx.getImageInfo({
                    src: 'https://admin.ok8809.com/6639669ewm.jpg',
                    success: function(res) {
                        var path2 = res.path
                        console.log(path1, path2)
                        const ctx = wx.createCanvasContext('myCanvas')
                            // 底图
                        ctx.drawImage(path1, 0, 0, 375, 686)
                            // 作者名称
                        ctx.setTextAlign('center') // 文字居中
                        ctx.setFillStyle('#ffffff') // 文字颜色：黑色
                        ctx.setFontSize(50) // 文字字号：22px
                        ctx.fillText('驾驶证回分', 375 / 2, 120)
                        ctx.setFontSize(14) // 文字字号：22px
                        ctx.fillText('再也不用担心驾驶证被扣分了', 375 / 2, 150)
                        ctx.setFontSize(20) // 文字字号：22px
                        ctx.fillText('12123学法减分好帮手', 375 / 2, 380)
                        const qrImgSize = 128
                        ctx.drawImage(path2, (375 - qrImgSize) / 2, 395, qrImgSize, qrImgSize)
                        ctx.setFontSize(14) // 文字字号：22px
                        ctx.fillText('长按二维码或扫一扫', 375 / 2, 545)
                        ctx.stroke()
                        ctx.draw(true, () => {
                            console.log("绘制成功")
                            wx.canvasToTempFilePath({
                                canvasId: 'myCanvas',
                                success(res) {
                                    that.setData({
                                        imgSrc: res.tempFilePath
                                    })
                                }
                            })

                        })
                    }
                })
            }
        })


    },
    save: function() {
        console.log(this.data.imgSrc)
        var cansurl = this.data.imgSrc
        wx.saveImageToPhotosAlbum({
            filePath: cansurl,
            success(res) {
                console.log(res)
                wx.showModal({
                    content: '图片已保存到相册，赶紧晒一下吧~',
                    showCancel: false,
                    confirmText: '好的',
                    confirmColor: '#333',
                    success: function(res) {
                        if (res.confirm) {
                            console.log('用户点击确定');

                        }
                    }
                })
            },
            fail(res) {
                console.log(res)
            }
        })

    },
    share: function() {
        var cansurl = this.data.imgSrc
        wx.showShareImageMenu({
            path: cansurl
        })
    }


})