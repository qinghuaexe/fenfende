import server from "../../server/server"

import { formatTime } from '../../utils/util'

let app = getApp()

Page({
    data: {
        record: [],
        stateList: ['未处理', '处理中', '已完成'],
        totalPage: 0,
        currentPage: 0
    },
    onLoad() {
        let data = {
            page: 1
        }
        server.withdrawRecord(data).then(res => {
            if (res.code === 0) {
                let list = res.data.list.map(item => {
                    return {
                        ...item,
                        create_time: formatTime(item.create_time * 1000, 0)
                    }
                })
                let totalPage
                if (res.data.total % res.data.per_page) {
                    totalPage = Math.floor(res.data.total / res.data.per_page) + 1
                } else {
                    totalPage = Math.floor(res.data.total / res.data.per_page)
                }
                this.setData({
                    record: list,
                    totalPage: totalPage
                })
            } else {
                wx.showToast({
                    title: res.message
                })
            }
        })
    },
    onReachBottom: function() { //触底开始下一页
        if (this.data.currentPage >= this.data.totalPage) {
            wx.showToast({
                title: '列表已加载完',
                icon: 'none',
                duration: 2000
            })
            return
        }
        var that = this;
        var pagenum = that.data.currentPage + 1; //获取当前页数并+1
        that.setData({
            currentPage: pagenum, //更新当前页数
        })
        let data = {
            page: this.data.currentPage
        }
        server.withdrawRecord(data).then(res => {
            if (res.code === 0) {
                let list = res.data.list.map(item => {
                    return {
                        ...item,
                        create_time: formatTime(item.create_time * 1000, 0)
                    }
                })
                this.setData({
                    record: this.data.record.concat(list)
                })
            }
        })

    },
})