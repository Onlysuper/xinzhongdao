// pages/dividePrsent/dividePrsent.js
const app = getApp();
const util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: "",
    prsentMoney: "",
    langs:{}
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
      title: this.data.langs['dividePrsent_TITLE'],
    })
  },
  getData: function () {
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
      url: app.globalData.publicUrl + 'Tixian/TixianSM.asp',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        openID: wx.getStorageSync("openId"),
        longitude: wx.getStorageSync("lon"),
        latitude: wx.getStorageSync("lat")
      },
      dataType: "json",
      success: function (res) {
        wx.hideNavigationBarLoading();
        if (res.data.code == 1) {
          that.setData({
            balance: res.data.account
          });
        } else {
          wx.showModal({
            title: '温馨提示',
            content: res.data.msg,
          })
        }
      }
    })
  },

  presentAll: util.throttle(function (e) {
    this.setData({
      prsentMoney: this.data.balance
    });
  }, 1000),
  //提现
  present: util.throttle(function (e) {
    var pMoney = e.detail.value.money;//提现金额
    var that = this;
    if (pMoney <= 0) {
      wx.showModal({
        title: '温馨提示',
        content: '请输入正确的提现金额',
        showCancel: false,
        success: function () {
          that.setData({
            prsentMoney: ""
          });
        }
      });
      return false;
    };
    wx.showModal({
      title: '温馨提示',
      content: '是否确定提现' + pMoney + "元？",
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '提现中...',
            mask: true
          });
          wx.request({
            url: app.globalData.publicUrl + 'Tixian/Tixian.asp',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            data: {
              openID: wx.getStorageSync("openId"),
              longitude: wx.getStorageSync("lon"),
              latitude: wx.getStorageSync("lat"),
              money: pMoney,
              formId: e.detail.formId
            },
            dataType: "json",
            success: function (res) {
              if (res.data.code == 1) {
                wx.showToast({
                  title: '提现成功',
                  icon: 'success',
                  duration: 2000
                });
                setTimeout(function () {
                  wx.navigateBack({

                  });
                }, 1000);
              } else {
                wx.hideLoading();
                wx.showModal({
                  title: '温馨提示',
                  content: res.data.msg,
                  showCancel: false
                })
              }
            }
          });
        } else if (res.cancel) {
          //取消不操作
        }
      }
    })
  }, 1000),
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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