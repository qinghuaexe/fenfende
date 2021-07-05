const app = getApp()

Page({
  data:{
    integration:''
  },
  handleGoRecord:function(){
    wx.navigateTo({url:'../withdrawRecord/withdrawRecord'})
  }
})