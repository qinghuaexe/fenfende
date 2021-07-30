import { wait } from '../../utils/util'
import server from "../../server/server";

const app = getApp()

Page({
    data: {
        userTypeList: ['普通用户', '普通会员', '终身会员'],
        phoneStatus: '',
        showTips: true,
        showTabs: false,
        showTextarea: false,
        keyword: '',
        questionList: [],
        questionType: [],
        answerTab: ['A', 'B', 'C', 'D', 'E'],
        noResult: false,
        page: 1,
        userType: '',
        remaining: '',
        totalPage: 0,
        people: 0,
        questionNum: 0
    },
    onLoad() {
        server.countYesTerDayActive().then(res => {
            if (res.code == 0) {
                this.setData({
                    people: res.data.userSum,
                    questionNum: res.data.ti
                })
            }
        })

        server.getUserInfo().then(res => {

            if (res.code === 0) {
                if (res.data.phone) {
                    this.setData({
                        phoneStatus: true
                    })
                }
                this.setData({
                    remaining: res.data.number,
                    userType: this.data.userTypeList[res.data.user_type]
                })
            }



        })


    },
    async onShow() {
        if (app.globalData.searchType === 'pic') {
            app.globalData.searchType = ''
            await wait(500)
            wx.chooseImage({
                sourceType: ['album'],
                success: function(res) {
                    console.log(res);
                }
            })

        } else if (app.globalData.searchType === 'ca') {
            app.globalData.searchType = ''
            await wait(500)
            wx.chooseImage({
                sourceType: ['camera'],
                success: function(res) {
                    console.log(res);

                }
            })
        } else if (app.globalData.searchType === 'text') {
            app.globalData.searchType = ''
            await wait(500)
            this.setData({
                showTextarea: true
            })
        }
    },
    getPhoneNumber(e) {
        if (e.detail.errMsg === 'getPhoneNumber:ok') {
            let data = {
                id_number: app.globalData.userInfo.id_number,
                iv: encodeURIComponent(e.detail.iv, "UTF-8"),
                encryptedData: encodeURIComponent(e.detail.encryptedData, "UTF-8")
            }
            server.decryptUserPhone(data).then(res => {
                if (res.code === 0) {
                    app.globalData.userInfo.phone_status = true
                    this.setData({
                        phoneStatus: true
                    })
                }
                wx.showToast({
                    title: res.message,
                    icon: 'none',
                    duration: 2000
                })
            })
        } else {
            wx.showToast({
                title: '拒绝授权将无法使用该功能',
                icon: 'none',
                duration: 3000
            })
        }
    },
    searchText: function() {
        if (!this.data.keyword) {
            wx.showToast({
                title: '请输入要搜索的内容',
                icon: 'none',
                duration: 2000
            })
            return
        }
        let data = {
            page: this.data.page,
            keyword: this.data.keyword
        }
        server.getQusetList(data).then(res => {
            if (res.code === 0 && res.data.list.length !== 0) {
                let totalPage
                if (res.data.total % res.data.per_page) {
                    totalPage = Math.floor(res.data.total / res.data.per_page) + 1
                } else {
                    totalPage = Math.floor(res.data.total / res.data.per_page)
                }

                let tempList = res.data.list.map(item => {
                    let correctList = item.correct.split('').map(answer => {
                        let index = this.data.answerTab.indexOf(answer)
                        return answer + '、' + item.options.split(',')[index]
                    })
                    return {
                        ...item,
                        options: item.options.split(','),
                        correct: correctList
                    }
                })

                this.setData({
                    questionList: tempList,
                    questionType: res.data.types,
                    totalPage: totalPage,
                    showTextarea: false
                })
            } else if (res.code === 0 && res.data.list.length === 0) {
                this.setData({
                    showTextarea: false,
                    noResult: true
                })
            }
            wx.showToast({
                title: res.message,
                icon: 'none',
                duration: 2000
            })

        })
    },
    resetText: function() {
        this.setData({
            keyword: ''
        })
    },
    closeTips: function() {
        this.setData({
            showTips: false
        })
    },
    closeTabs: function() {
        this.setData({
            showTabs: false
        })
    },
    handleShowTabs: function() {
        this.setData({
            showTabs: true
        })
    },
    haha: function() {
        console.log('触发')

    },
    handleSearch: function(e) {
        let searchType = e.currentTarget.dataset.type
        var that = this
        if (searchType === 'pic') {
            this.setData({
                showTextarea: false,
                questionList: []
            })
            wx.chooseImage({
                sourceType: ['album'],
                success: function(res) {
                    that.setData({
                        showTabs: false
                    })
                },
            })
        } else if (searchType === 'ca') {
            this.setData({
                showTextarea: false,
                questionList: []
            })
            wx.chooseImage({
                sourceType: ['camera'],
                success: function(res) {
                    console.log(res);
                    that.setData({
                        showTabs: false
                    })
                }
            })
        } else if (searchType === 'text') {
            this.setData({
                showTextarea: true,
                showTabs: false,
                questionList: []
            })
        }
    }
})