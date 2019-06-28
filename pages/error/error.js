// pages/error/error.js
const util = require("../../utils/util.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg:"",
    msg1:"",
    deviceID:"",
    servicPhone:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var getMore = options.msg1;
    var m1 = "",m2 = "";
    if (getMore){
      m1 = getMore.split("##")[0];
      m2 = getMore.split("##")[1];
    }
    this.setData({
      msg:options.msg,
      servicPhone: wx.getStorageSync("WEB_Mobile"),
      msg1: m1,
      deviceID: m2
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  callService: util.throttle(function () {
    wx.makePhoneCall({
      phoneNumber: wx.getStorageSync("WEB_Mobile"),
    })
  }, 1000),

  goNear: util.throttle(function(){
    wx.navigateBack({
      
    });
  },1000),
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