import { wait } from '../../utils/util'
import server from "../../server/server";

const app = getApp()

Page({
    data: {
        searchType: '', // 搜索方式
        userTypeList: ['非会员', '普通会员', '终身会员'],
        phoneStatus: false,
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




    },
    async onShow() {

        var that = this
        if (app.globalData.searchType === 'pic') {
            this.setData({
                searchType: app.globalData.searchType
            })
            app.globalData.searchType = ''
            this.initData()
            await wait(500)
            wx.chooseImage({
                count: 1,
                sourceType: ['album'],
                sizeType: ['compressed'],
                success: function(res) {
                    let path = res.tempFilePaths[0]
                    that.searchPic(path)
                },
                fail: function() {}

            })

        } else if (app.globalData.searchType === 'ca') {
            this.setData({
                searchType: app.globalData.searchType
            })
            app.globalData.searchType = ''
            this.initData()
            await wait(500)
            wx.chooseImage({
                count: 1,
                sourceType: ['camera'],
                sizeType: ['compressed'],
                success: function(res) {
                    let path = res.tempFilePaths[0]
                    that.searchPic(path)

                },
                fail: function() {}
            })
        } else if (app.globalData.searchType === 'text') {
            this.setData({
                searchType: app.globalData.searchType
            })
            app.globalData.searchType = ''
            this.initData()
            await wait(500)
            this.setData({
                showTextarea: true
            })
        }
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
    onReachBottom: function() {
        if (this.data.totalPage < 2) {
            return
        }
        if (this.data.page >= this.data.totalPage) {
            wx.showToast({
                title: '列表已加载完',
                icon: 'none',
                duration: 2000
            })
            return
        }
        var that = this;
        var pagenum = that.data.page + 1; //获取当前页数并+1
        that.setData({
            page: pagenum, //更新当前页数
        })
        let data = {
            page: this.data.page,
            keyword: this.data.keyword
        }
        server.getQusetList(data).then(res => {
            if (res.code === 0) {
                let tempList = res.data.list.map(item => {

                    return {
                        ...item,
                        options: item.options.split(','),

                    }
                })
                let list = this.data.questionList.concat(tempList)
                this.setData({
                    questionList: list,
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
            page: 1,
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

                    return {
                        ...item,
                        options: item.options.split(','),
                    }
                })
                this.setData({
                    questionList: tempList,
                    questionType: res.data.types,
                    totalPage: totalPage,
                    showTextarea: false,
                    remaining: res.data.number
                })
                wx.showToast({
                    title: '查询成功',
                    icon: 'none',
                    duration: 2000
                })

            } else if (res.code === 0 && res.data.list.length === 0) {
                this.setData({
                    showTextarea: false,
                    noResult: true
                })
                wx.showToast({
                    title: '未搜到相关题目',
                    icon: 'none',
                    duration: 2000
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
        this.initData()
        this.setData({
            showTabs: true
        })
    },
    handleSearch: function(e) {
        if (e.currentTarget.dataset.type) {
            this.setData({
                searchType: e.currentTarget.dataset.type
            })
        }
        var that = this
        if (that.data.searchType === 'pic') {
            console.log(that.data.searchType)
            that.initData()
            wx.chooseImage({
                count: 1,
                sourceType: ['album'],
                sizeType: ['compressed'],
                success: function(res) {

                    let path = res.tempFilePaths[0]
                    that.setData({
                        showTabs: false
                    })
                    that.searchPic(path)
                },
                fail: function() {}
            })
        } else if (that.data.searchType === 'ca') {
            this.initData()
            wx.chooseImage({
                count: 1,
                sourceType: ['camera'],
                sizeType: ['compressed'],
                success: function(res) {
                    that.setData({
                        showTabs: false
                    })
                    let path = res.tempFilePaths[0]
                    that.searchPic(path)
                },
                fail: function() {}
            })
        } else if (that.data.searchType === 'text') {
            this.initData()
            this.setData({
                showTextarea: true
            })
        }
    },
    closeQuestion: function() {
        this.setData({
            page: 0,
            totalPage: 0,
            searchType: '',
            keyword: '',
            noResult: false,
            showTabs: false,
            questionList: []
        })
    },
    searchPic(url) {
        var that = this
        let token = wx.getStorageSync('token')
        wx.showLoading({
            title: '列表加载中',
            mask: true
        })
        wx.uploadFile({
            url: 'https://admin.ok8809.com/api/question/getQuestionList',
            filePath: url,
            name: 'file',
            formData: {
                'token': token
            },
            success: function(res) {
                wx.hideLoading()
                res = JSON.parse(res.data)
                if (res.code === 0 && res.data.list.length !== 0) {
                    let totalPage
                    if (res.data.total % res.data.per_page) {
                        totalPage = Math.floor(res.data.total / res.data.per_page) + 1
                    } else {
                        totalPage = Math.floor(res.data.total / res.data.per_page)
                    }

                    let tempList = res.data.list.map(item => {

                        return {
                            ...item,
                            options: item.options.split(','),
                        }
                    })
                    that.setData({
                        questionList: tempList,
                        questionType: res.data.types,
                        totalPage: totalPage,
                        showTextarea: false,
                        remaining: res.data.number
                    })
                    wx.showToast({
                        title: '查询成功',
                        icon: 'none',
                        duration: 2000
                    })

                } else if (res.code === 0 && res.data.list.length === 0) {
                    that.setData({
                        showTextarea: false,
                        noResult: true
                    })
                    wx.showToast({
                        title: '未搜到相关题目',
                        icon: 'none',
                        duration: 2000
                    })
                } else {
                    wx.showToast({
                        title: res.message,
                        icon: 'none',
                        duration: 2000
                    })
                }

            },
            fail: function(res) {
                wx.showToast({
                    title: '上传图片失败',
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    },
    // 重置搜索数据
    initData() {
        this.setData({
            showTextarea: false,
            questionList: [],
            page: 1,
            totalPage: 0,
            noResult: false,
            showTabs: false,
        })
    }
})