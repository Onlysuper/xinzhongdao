// pages/shopShow/shopShow.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:true,
    shop:{},
    langs:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var shopid = options.shopid;
    this.setLanguage();
    this.getData(shopid);
  },
  setLanguage() {
    this.setData ({
      langs: wx.I18n.getLanguage()
    });
    wx.setNavigationBarTitle({
      title: this.data.langs['shopShow_TITLE'],
    })
  },
  getData:function(shopid){
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
      url: app.globalData.publicUrl + "Shop/ShopDetail.asp?id=" + shopid+'&language='+that.data['langs']['lang_type'],
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        // language:"语言",
      },
      method: "POST",
      dataType: "json",
      success: function (res) {
        if(res.data.code == 1){
          that.setData({
            shop:res.data.data,
            show:false
          })
        }else{
          wx.showModal({
            title: that.data['langs']['warn_title'],
            content: res.data.msg,
            showCancel:false
          })
        }
        wx.hideNavigationBarLoading();
      }
    })
  },
  goDaoHang: function (e) {
    wx.openLocation({
      latitude: parseFloat(e.currentTarget.dataset.lat),
      longitude: parseFloat(e.currentTarget.dataset.lon),
      scale: 15,
      name: e.currentTarget.dataset.name,
      address: e.currentTarget.dataset.address
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})