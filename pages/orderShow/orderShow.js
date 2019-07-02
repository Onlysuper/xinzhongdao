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
  },
  getData:function(){
    wx.showNavigationBarLoading();

    var that = this;
    wx.request({
      url: app.globalData.publicUrl + "List/OrderDetail.asp?id=" + orderid,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        openID: wx.getStorageSync("openId"),
        longitude: wx.getStorageSync("lon"),
        latitude: wx.getStorageSync("lat")
      },
      method: "POST",
      dataType: "json",
      success: function (res) {
        console,log("订单详情："+JSON.stringify(res));
        wx.hideNavigationBarLoading();
        if (res.data.code == 1) {
          that.setData({
            orderDetail: res.data.data
          });
          if (res.data.data.p_BorrowState == "租借中"){
            that.setData({
              showBtn: false,
              btnMsg: "充电宝已遗失",
              methods: "finishOrder"
            });
          } else if (res.data.data.p_BorrowState == "故障单"){
            that.setData({
              showBtn: false,
              btnMsg: "修复故障",
              methods: "repairOrder"
            });
          }else{
            that.setData({
              showBtn: true
            });
          };
        }else{
          wx.showModal({
            title: '温馨提示',
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
    wx.showModal({
      title: '温馨提示',
      content: '是否确定修复？',
      success: function (res) {
        if (res.confirm) {
          that.repairAjax();
        }
      }
    })
  },1000),

  repairAjax:function(){
    wx.showLoading({
      title: '修复中...',
      mask: true
    });
    var that = this;
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
          wx.showModal({
            title: '温馨提示',
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
          wx.showModal({
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
          wx.showModal({
            title: '温馨提示',
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
    wx.showModal({
      title: '温馨提示',
      content: '您好，如果您确定您所租借的充电宝已遗失，点击此按钮，系统会立即扣除您当次所缴纳的押金金额，同时结束订单。该操作无法恢复，请谨慎操作。',
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
      url: app.globalData.publicUrl + "List/CloseOrder.asp",
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
        wx.hideNavigationBarLoading();
        if (res.data.code == 1) {
          wx.showModal({
            title: '温馨提示',
            content: res.data.msg,
            showCancel: false,
            success: function (result) {
              that.getData();
            }
          });
        } else {
          wx.showModal({
            title: '温馨提示',
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