const app = getApp()
import server from "../../server/server";

Page({
  takePhoto () {


  },
  onLoad () {
    server.getList().then(res => {
      console.log(res.data
      )
    })

  },
  chooseimage: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#CED63A",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera')
          }
        }
      }
    })

  },

  chooseWxImage: function () {
    var that = this;
    wx.chooseImage({
      sourceType: ['camera'],
      success: function (res) {
        console.log(res);
      }
    })
  },
  hahhaha: function () {
    wx.showModal({
      title: '提示',
      content: '这是一个模态弹窗',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  handleToVip: () => {
    wx.navigateTo({
      url: '../vip/vip'
    })
  },
  handleToGroup: () => {
    wx.navigateTo({
      url: '../group/group'
    })
  },
  handleToPop:function(){
    wx.navigateTo({
      url: '../popularize/popularize'
    })
  },
  handleGomyPop:function(){
    wx.navigateTo({
      url: '../myPop/myPop'
    })
  }
})