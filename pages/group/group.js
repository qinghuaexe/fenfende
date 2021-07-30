import server from "../../server/server"

const app = getApp()

Page({
    data: {
        groupNavList: [{ name: '直属团队', number: '2' }, { name: '二级团队', number: '2' }],
        groupList: [],
        promoteNum: 0,
        proxy: 0,
        currentIndex: 0,
        currentPage: 1,
        totalPage: 0
    },
    onLoad() {
        let data = {
            type: this.data.currentIndex + 1,
            page: this.data.currentPage
        }
        server.groupList(data).then(res => {
            if (res.code === 0) {
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
            groupList: [],
            totalPage: 0
        })
        let data = {
            type: this.data.currentIndex + 1,
            page: this.data.currentPage
        }
        server.groupList(data).then(res => {
            if (res.code === 0) {
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

    getGroupList() {
        console.log(1)
    },

    handleGoWithdraw: function() {
        wx.navigateTo({ url: '../withdraw/withdraw' })
    }
})