const util = require("../../utils/util.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance:"",
    deposit:"",
    langs:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  setLanguage() {
    this.setData ({
      langs: wx.I18n.getLanguage()
    });
    wx.setNavigationBarTitle({
      title: this.data.langs['userPG_mywallet'],
    })
  },
  getData:function(){
    var _this = this;
    wx.showNavigationBarLoading();
    wx.request({
      url: app.globalData.publicUrl +'User/Info.asp',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data:{
        openID: wx.getStorageSync("openId"),
        longitude: wx.getStorageSync("lon"),
        latitude: wx.getStorageSync("lat")
      },
      dataType:"json",
      success: function(res){
        wx.hideNavigationBarLoading();
        if(res.data.code == 1){
          _this.setData({
            balance: res.data.data.p_Account_My,
            deposit: res.data.data.p_Account_YaJin
          });
        }else{
          wx.$toast({
            title: _this.data.langs['warn_title'],
            content: res.data.msg,
            showCancel:false
          })
        }
      }
    })
  },

  goNewPage: util.throttle(function(e){
    var formID = "";
    if (e.detail.formId){
      formID = e.detail.formId;
    }else{
      formID = "";
    }
    var url = e.target.dataset.url;
    if(url){
      wx.navigateTo({
        url: url + "?formId=" + formID,
      })
    }
  }),
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    this.setLanguage();
    this.getData();
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