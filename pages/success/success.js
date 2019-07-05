// pages/success/success.js
const app = getApp();
const util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSuccess: true,
    tNum: "",
    msg1: "",
    msg2: "",
    imgs: "",
    langs:{} 
  },
  setLanguage() {
    this.setData ({
      langs: wx.I18n.getLanguage()
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.monitorBattery(options.orderid, options.formId);
    this.setLanguage();
    wx.setNavigationBarTitle({
      title: this.data.langs['success_TITLE'],
    })
  },


  goUserCenter: util.throttle(function (e) {
    wx.redirectTo({
      url: '../user/user',
    })
  }, 1000),
  goHome: function () {
    wx.navigateBack({

    });
  },

  //监听电池弹出
  monitorBattery: function (orderid, formId) {
    var that = this;
    wx.showNavigationBarLoading();
    wx.request({
      url: app.globalData.publicUrl + 'Borrow/BorrowFinish.asp',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        openID: wx.getStorageSync("openId"),
        longitude: wx.getStorageSync("lon"),
        latitude: wx.getStorageSync("lat"),
        orderid: orderid,
        formId: formId
      },
      dataType: "json",
      success: function (res) {
        console.log("循环请求："+JSON.stringify(res));
        wx.hideNavigationBarLoading();
        if (res.data.code == 1) {
          setTimeout(function () {
            that.monitorBattery(orderid);
          }, 2000);
        } else if (res.data.code == 2) {
          that.setData({
            showSuccess: false,
            tNum: res.data.number,
            msg1: res.data.msg.split("@@@")[0],
            msg2: res.data.msg.split("@@@")[2],
            imgs: res.data.logoUrl
          });
        } else {
          if (res.data.more) {
            wx.redirectTo({
              url: '../error/error?msg=' + res.data.msg + "&msg1=" + res.data.more,
            });
          } else {
            wx.redirectTo({
              url: '../error/error?msg=' + res.data.msg,
            });
          }
        }
      }
    });
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