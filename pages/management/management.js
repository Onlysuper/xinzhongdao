// pages/management/management.js
const app = getApp();
const util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    langs:{},
    startTime: "请选择开始时间",
    endTime: "请选择结束时间", 
    startColor: "#999",
    endColor: "#999"
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setLanguage();
  },
  setLanguage() {
    this.setData ({
      langs: wx.I18n.getLanguage()
    });
    wx.setNavigationBarTitle({
      title: this.data.langs['management_TITLE'],
    })
  },
  bindStartTime: function (e) {
    this.setData({
      startTime: e.detail.value,
      startColor: "#484848"
    })
  },
  bindEndTime: function (e) {
    this.setData({
      endTime: e.detail.value,
      endColor: "#484848"
    })
  },

  goPage: util.throttle(function(e){
    var url = e.target.dataset.url;

    wx.navigateTo({
      url: url+"?formId="+e.target.formId,
    });

  },1000),
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