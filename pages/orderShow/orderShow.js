// pages/orderShow/orderShow.js
const app = getApp();
const util = require("../../utils/util.js");

var orderid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderDetail:{},
    showBtn:true,
    btnMsg: "",
    methods:"",
    langs:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    orderid = options.orderid;
    this.getData();
    this.setLanguage();
  },
  setLanguage() {
    this.setData ({
      langs: wx.I18n.getLanguage()
    });
    wx.setNavigationBarTitle({
      title: this.data.langs['orderShow_TITLE'],
    })
  },
  getData:function(){
    wx.showNavigationBarLoading();

    var that = this;
    wx.request({
      url: app.globalData.publicUrl + "List/OrderDetail.asp?id=" + orderid+'&language='+this.data['langs']['lang_type'],
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        openID: wx.getStorageSync("openId"),
        longitude: wx.getStorageSync("lon"),
        latitude: wx.getStorageSync("lat"),
        // language:"语言"
      },
      method: "POST",
      dataType: "json",
      success: function (res) {
        wx.hideNavigationBarLoading();
        if (res.data.code == 1) {
          that.setData({
            orderDetail: res.data.data
          });
          if (res.data.data.p_BorrowStateCode == "1"){
            that.setData({
              showBtn: false,
              btnMsg: that.data.langs['battery_lost'],
              methods: "finishOrder"
            });
          } else if (res.data.data.p_BorrowStateCode == "2"){
            that.setData({
              showBtn: false,
              btnMsg: that.data.langs['repair_broken'],
              methods: "repairOrder"
            });
          }else{
            that.setData({
              showBtn: true
            });
          };
        }else{
          wx.$toast({
            title: that.data.langs['warn_title'],
            content: res.data.msg,
            showCancel: false
          })
        }
      }
    });

  },

  //修复故障单
  repairOrder: util.throttle(function(){
    var that = this;
    wx.$toast({
      title: '温馨提示',
      content: that.data.langs['ordershowPG_sure_repair'],
      success: function (res) {
        if (res.confirm) {
          that.repairAjax();
        }
      }
    })
  },1000),

  repairAjax:function(){
    var that = this;
    wx.showLoading({
      title: that.data.langs['repairing'],
      mask: true
    });
    wx.request({
      url: app.globalData.publicUrl + "List/FixOrder.asp?act=fix",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        id: orderid,
        openID: wx.getStorageSync("openId"),
        longitude: wx.getStorageSync("lon"),
        latitude: wx.getStorageSync("lat")
      },
      method: "POST",
      dataType: "json",
      success: function (res) {
        if (res.data.code == 1) {
          that.changeOrder();
        } else {
          wx.hideLoading();
          wx.$toast({
            title: that.data.langs['warn_title'],
            content: res.data.msg,
            showCancel: false
          });
        }
      }
    });
  },

  //监听订单状态
  changeOrder:function(){
    var that = this;
    wx.request({
      url: app.globalData.publicUrl + "List/FixOrder.asp?act=check",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        id: orderid,
        openID: wx.getStorageSync("openId"),
        longitude: wx.getStorageSync("lon"),
        latitude: wx.getStorageSync("lat")
      },
      method: "POST",
      dataType: "json",
      success: function (res) {
        if(res.data.code == 1){
          wx.hideLoading();
          wx.$toast({
            title: '温馨提示',
            content: res.data.msg,
            showCancel: false,
            success:function(){
              that.getData();
            }
          })
        }else if(res.data.code == 2){
          setTimeout(function(){
            that.changeOrder();
          },3000);
        }else{
          wx.hideLoading();
          wx.$toast({
            title: that.data.langs['warn_title'],
            content: res.data.msg,
            showCancel: false
          });
        }
      }
    })
  },

  //遗失充电宝
  finishOrder: util.throttle(function(){
    var that = this;
    wx.$toast({
      title: '温馨提示',
      content: that.data.langs['ordershowPG_sure_warn'],
      success: function(res){
        if(res.confirm){
          that.finishAjax();
        }
      }
    })
  },1000),
  
  finishAjax:function(){
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
      url: app.globalData.publicUrl + "List/CloseOrder.asp"+'&language='+this.data['langs']['lang_type'],
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        id: orderid,
        openID: wx.getStorageSync("openId"),
        longitude: wx.getStorageSync("lon"),
        latitude: wx.getStorageSync("lat"),
        // language:"语言"
      },
      method: "POST",
      dataType: "json",
      success: function (res) {
        wx.hideNavigationBarLoading();
        if (res.data.code == 1) {
          wx.$toast({
            title: that.data.langs['warn_title'],
            content: res.data.msg,
            showCancel: false,
            success: function (result) {
              that.getData();
            }
          });
        } else {
          wx.$toast({
            title: that.data.langs['warn_title'],
            content: res.data.msg,
            showCancel: false
          });
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