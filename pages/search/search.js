import { wait } from '../../utils/util'
import server from "../../server/server";

const app = getApp()

Page({
    data: {
        searchType: '', // 搜索方式
        userTypeList: ['普通用户', '普通会员', '终身会员'],
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
        this.setData({
            searchType: app.globalData.searchType
        })
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
                    showTextarea: false
                })
                server.getUserInfo().then(res => {

                    if (res.code === 0) {
                        this.setData({
                            remaining: res.data.number,
                        })
                    }
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
            this.setData({
                showTextarea: false,
                questionList: [],
                page: 1,
                totalPage: 0,
                noResult: false,
                showTabs: false,
            })
            wx.chooseImage({
                sourceType: ['album'],
                sizeType: ['compressed'],
                success: function(res) {
                    console.log(res.tempFilePaths[0])
                    let token = wx.getStorageSync('token')
                    let path = res.tempFilePaths[0]
                    that.setData({
                        showTabs: false
                    })
                    wx.uploadFile({
                        url: 'https://admin.ok8809.com/api/question/getQuestionList',
                        filePath: path,
                        name: 'file',
                        formData: {
                            'token': token
                        },
                        success: function(res) {
                            var data = res.data
                            console.log(res)
                        },
                        fail: function(res) {
                            console.log(res)
                        }
                    })


                },
            })
        } else if (that.data.searchType === 'ca') {
            this.setData({
                showTextarea: false,
                questionList: []
            })
            wx.chooseImage({
                sourceType: ['camera'],
                sizeType: ['compressed'],
                success: function(res) {
                    console.log(res);
                    that.setData({
                        showTabs: false
                    })
                }
            })
        } else if (that.data.searchType === 'text') {
            this.setData({
                showTextarea: true,
                showTabs: false,
                questionList: [],
                noResult: false
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
    }
})