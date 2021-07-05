const app = getApp()

Page({
  data: {
    groupNavList:[{name:'直属团队',number:'2'},{name:'二级团队',number:'2'}],
    groupList:[{name:'一级团队ABC',cost:'5',tc:'5',url:'/static/images/avator.png'},
    {name:'一级团队ABC',cost:'500',tc:'30',url:'/static/images/avator.png'},
    {name:'一级团队ABC',cost:'450',tc:'45',url:'/static/images/avator.png'}],
    currentIndex:0
  },
  selectNav: function(e){
    this.setData({
      currentIndex:e.currentTarget.dataset.index
    })
  },

  handleGoWithdraw:function(){
    wx.navigateTo({url:'../withdraw/withdraw'})
  }
})