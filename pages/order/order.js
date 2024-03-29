// pages/order/order.js
const util = require("../../utils/util.js");
const app = getApp();
var page = 1;
var maxPage;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    showNoData: true,
    showMore: true,
    langs:{},
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
      title: this.data.langs['order_TITLE'],
    })
  },
  getData: function () {
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
      url: app.globalData.publicUrl + "List/OrderList.asp?page=" + page+'&language='+this.data['langs']['lang_type'],
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        openID: wx.getStorageSync("openId"),
        longitude: wx.getStorageSync("lon"),
        latitude: wx.getStorageSync("lat"),
        // language:"语言",
      },
      method: "POST",
      dataType: "json",
      success: function (res) {
        if (res.data.code == 1) {
          maxPage = res.data.maxpage;
          if (res.data.total > 0) {
            if (page == 1) {
              that.setData({
                listData: []
              });
            };
            var myData = that.data.listData.concat(res.data.data);
            that.setData({
              listData: myData,
              showNoData: true,
              showMore: true
            });
          } else {
            that.setData({
              listData: [],
              showNoData: false,
              showMore: true
            });
          }
          wx.stopPullDownRefresh();
          wx.hideNavigationBarLoading();
        } else {
          wx.$toast({
            content: res.data.msg,
            showCancel: false
          });
          wx.hideNavigationBarLoading();
        }

      }
    })

  },

  goShow: util.throttle(function(e){
    var orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../orderShow/orderShow?orderid=" + orderId,
    })
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
    page = 1;
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
    page = 1;
    this.setData({
      showMore: true
    });
    this.getData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    page++;
    if (page <= maxPage) {
      this.getData();
    } else {
      this.setData({
        showMore: false
      });
      page--;
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})