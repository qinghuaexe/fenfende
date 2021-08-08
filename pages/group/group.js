import server from "../../server/server"

const app = getApp()

Page({
    data: {
        groupNavList: [],
        groupList: [],
        promoteNum: 0,
        proxy: 0,
        jifen: 0,
        currentIndex: 0,
        currentPage: 1,
        totalPage: 0,
        userName: ''
    },
    onShow() {
        let data = {
            type: this.data.currentIndex + 1,
            page: this.data.currentPage
        }
        wx.showLoading({
            title: '列表加载中',
            mask: true
        })
        server.groupList(data).then(res => {
            wx.hideLoading()
            if (res.code === 0) {
                let totalPage
                if (res.data.total % res.data.per_page) {
                    totalPage = Math.floor(res.data.total / res.data.per_page) + 1
                } else {
                    totalPage = Math.floor(res.data.total / res.data.per_page)
                }
                let sumUser = res.data.count.sumUser
                let subUser = res.data.count.userCount - res.data.count.sumUser
                let list = []
                list.push({ name: '直属团队', number: sumUser })
                list.push({ name: '二级团队', number: subUser })
                this.setData({
                    groupList: res.data.list,
                    totalPage: totalPage,
                    promoteNum: res.data.count.userCount,
                    proxy: res.data.count.agency,
                    jifen: parseInt(res.data.count.integral),
                    groupNavList: list
                })
            }
        })
    },
    onReachBottom: function() { //触底开始下一页
        if (this.data.totalPage < 2) {
            return
        }
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
            type: this.data.currentIndex + 1,
            page: this.data.currentPage
        }
        server.groupList(data).then(res => {
            if (res.code === 0) {
                this.setData({
                    groupList: this.data.groupList.concat(res.data.list),
                })
            }
        })

    },
    selectNav: function(e) {
        this.setData({
            currentIndex: e.currentTarget.dataset.index,
            currentPage: 1,
            totalPage: 0
        })
        let data = {
            type: this.data.currentIndex + 1,
            page: this.data.currentPage
        }
        wx.showLoading({
            title: '列表加载中',
            mask: true
        })
        server.groupList(data).then(res => {
            if (res.code === 0) {
                wx.hideLoading()
                let totalPage
                if (res.data.total % res.data.per_page) {
                    totalPage = Math.floor(res.data.total / res.data.per_page) + 1
                } else {
                    totalPage = Math.floor(res.data.total / res.data.per_page)
                }
                this.setData({
                    groupList: res.data.list,
                    totalPage: totalPage,
                    promoteNum: res.data.count.userCount,
                    proxy: res.data.count.agency
                })
            }
        })
    },

    searchPeople() {
        if (!this.data.userName) {
            wx.showToast({
                title: '请输入会员姓名'
            })
            return
        }
        let data = {
            keyword: this.data.userName,
            type: this.data.currentIndex + 1
        }
        server.groupList(data).then(res => {
            if (res.code === 0) {
                this.setData({
                    groupList: res.data.list,
                })
            }
            wx.showToast({
                title: res.message,
                icon: 'none',
                duration: 2000
            })
        })

    },
    handleGoWithdraw: function() {
        wx.navigateTo({ url: '../withdraw/withdraw' })
    }
})