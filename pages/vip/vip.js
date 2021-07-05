const app = getApp()


Page({
  data: {
    rechargeList: [{ name: '300元', des: '120次' }, { name: '99元', des: 'VIP终身会员' }, { name: '50元', des: '20次' }],
    currentIndex: 0

  },

  tabClick: function (e) {
    this.setData({
      currentIndex: e.currentTarget.dataset.index
    });
  }

})