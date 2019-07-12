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
      url: app.globalData.publicUrl + 'Tixian/TixianSM.asp?'+'language='+that.data['langs']['lang_type'],
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        openID: wx.getStorageSync("openId"),
        longitude: wx.getStorageSync("lon"),
        latitude: wx.getStorageSync("lat"),
        // language:"语言",
      },
      dataType: "json",
      success: function (res) {
        wx.hideNavigationBarLoading();
        if (res.data.code == 1) {
          that.setData({
            balance: res.data.account
          });
        } else {
          wx.$toast({
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
      wx.$toast({
        title: '温馨提示',
        content: that.data.langs['devidePG_sureprice'],
        showCancel: false,
        success: function () {
          that.setData({
            prsentMoney: ""
          });
        }
      });
      return false;
    };
    wx.$toast({
      title: '温馨提示',
      
      content: `${that.data.langs['wxwithdrawal_confirm']}${that.data.langs['money_unit']}${pMoney}`,
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: that.data['langs']['showorderPG_withdraw'],
            mask: true
          });
          wx.request({
            url: app.globalData.publicUrl + 'Tixian/Tixian.asp?'+'&language='+this.data['langs']['lang_type'],
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            data: {
              openID: wx.getStorageSync("openId"),
              longitude: wx.getStorageSync("lon"),
              latitude: wx.getStorageSync("lat"),
              money: pMoney,
              formId: e.detail.formId,
              // language:"语言",
            },
            dataType: "json",
            success: function (res) {
              if (res.data.code == 1) {
                wx.showToast({
                  title: that.data.langs['wxwithdrawalsuccess'],
                  icon: 'success',
                  duration: 2000
                });
                setTimeout(function () {
                  wx.navigateBack({

                  });
                }, 1000);
              } else {
                wx.hideLoading();
                wx.$toast({
                  title:that.data.langs['warn_title'],
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