// pages/showOrder/showOrder.js
const app = getApp();
const util = require("../../utils/util.js");
var that;
var qrcode;
var formId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:true,
    showGetingo:true,
    showLease:true,
    orderData:{},
    langs:{} 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    qrcode = options.id;
    // this.getAuthorize();
    this.isShowData();
    this.setLanguage();
  },
  setLanguage() {
    this.setData ({
      langs: wx.I18n.getLanguage()
    });
  },
  isShowData:function(){
    var timer;
    if (wx.getStorageSync('openId')) {
      clearTimeout(timer);
      that.getAuthorize();
      // that.getData();
    } else {
      timer = setTimeout(function () {
        that.isShowData();
      }, 1000);
    };
  },

  //判断授权状态
  getAuthorize: function () {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          //已授权
          that.getData();
          that.setData({
            showGetingo: true,
            showLease:false
          });
        } else {
          that.getData1();
          that.setData({
            showGetingo: false,
            showLease: true
          });
        }
      }
    })
  },

  //未授权获取数据
  getData1:function(){
    wx.showNavigationBarLoading();
    wx.request({
      url: app.globalData.publicUrl + "Borrow/showInfo.asp?id=" + qrcode,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      data: {
        openID: wx.getStorageSync("openId"),
        longitude: wx.getStorageSync("lon"),
        latitude: wx.getStorageSync("lat")
      },
      dataType: "json",
      success: function (res) {
        console.log("未授权："+JSON.stringify(res));
        wx.hideNavigationBarLoading();
        if (res.data.code == 1) {
          that.setData({
            orderData: res.data,
            show: false
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


  //获取页面信息
  getData:function(){
    wx.showNavigationBarLoading();
    wx.request({
      url: app.globalData.publicUrl + "Borrow/Check.asp?id=" + qrcode,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      data:{
        openID: wx.getStorageSync("openId"),
        longitude: wx.getStorageSync("lon"),
        latitude: wx.getStorageSync("lat")
      },
      dataType: "json",
      success: function (res) {
        console.log("已授权：" + JSON.stringify(res));
        wx.hideNavigationBarLoading();
        if (res.data.code == 1) {
          that.setData({
            orderData:res.data,
            show:false
          });
        }else{
          if (res.data.more){
            wx.redirectTo({
              url: '../error/error?msg=' + res.data.msg + "&msg1=" + res.data.more,
            });
          }else{
            wx.redirectTo({
              url: '../error/error?msg=' + res.data.msg,
            });
          }
        }
      }
    })

  },

  //授权用户信息获取
  getInfo: function (e) {
    if (e.detail.errMsg == "getUserInfo:ok") {
      app.globalData.userInfo = e.detail.userInfo;
      app.globalData.encryptedData = e.detail.encryptedData;
      app.globalData.iv = e.detail.iv;
      app.registerUser(function (res) {//注册用户
        if (res.data.code == 1){
          that.getData();
          that.setData({
            showGetingo: true,
            showLease: false
          });
        }else{
          wx.showModal({
            title: '温馨提示',
            content: '登录失败，请重试',
            showCancel: false
          })
        }
      });
      
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '拒绝授权将无法租借充电宝哦',
        showCancel: false
      })
    }
  },

  //发起租借
  lease: util.throttle(function(e){
    formId = e.detail.formId;
    if (wx.getStorageSync("isLogin")){
      if (that.data.orderData.chongzhi == "N"){
        that.enough();
      } else if (that.data.orderData.chongzhi == "Y"){
        if (that.data.orderData.PaySM_Key == 1) {
          wx.showModal({
            title: '温馨提示',
            content: that.data.orderData.Pay_SM,
            success: function (res) {
              if (res.confirm) {
                that.lessMoney();
              }
            }
          })
        }else{
          that.lessMoney();
        }         
      }
    }else{
      // console.log("未注册成功，需重新注册");
    }
  },1000),


  //余额充足时租借
  enough: function(){
    wx.showLoading({
      title: '租借中...',
      mask: true
    });
    wx.request({
      url: app.globalData.publicUrl + 'Borrow/Borrow.asp?id=' + qrcode,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        openID: wx.getStorageSync("openId"),
        longitude: wx.getStorageSync("lon"),
        latitude: wx.getStorageSync("lat"),
        formId: formId
      },
      dataType: "json",
      success: function (res) {
        // console.log("余额充足："+JSON.stringify(res));
        if(res.data.code == 1){
          that.monitorBattery(res.data.orderID); //进入电池弹出监听
        }else{
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

  //余额不足时
  lessMoney:function(e){ 
    wx.showLoading({
      title: '充值中...',
      mask: true
    }) ; 
    wx.request({
      url: app.globalData.publicUrl + 'Borrow/BorrowPay.asp?id=' + qrcode,
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
        // console.log("余额不足："+JSON.stringify(res));
        var out_trade_no = res.data.data.out_trade_no;
        if (res.data.code == 1){
          wx.requestPayment({
            timeStamp: res.data.data.timeStamp,
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.package,
            signType: res.data.data.signType,
            paySign: res.data.data.paySign,
            success: function (result) {
              // console.log("付款成功：" + JSON.stringify(result));
              if (result.errMsg == "requestPayment:ok") {
                //充值成功
                that.checkPay(out_trade_no);
              }
            },
            fail: function (err) {
              wx.hideLoading();
              if (err.errMsg == "requestPayment:fail cancel") {
                wx.showToast({
                  title: "取消充值",
                  icon: "none"
                })
              }
            }
          });
        }else{
          wx.showModal({
            title: '温馨提示',
            content: res.data.msg,
            showCancel: false
          })
        }
      }
    })

  },

  //检查是否付款成功
  checkPay:function(oid){
    wx.request({
      url: app.globalData.publicUrl + 'Borrow/BorrowPayFinish.asp',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        openID: wx.getStorageSync("openId"),
        longitude: wx.getStorageSync("lon"),
        latitude: wx.getStorageSync("lat"),
        payment:"ok",
        out_trade_no: oid,
        formId: formId
      },
      dataType: "json",
      success: function (res) {
        // console.log("检查付款："+JSON.stringify(res));
        wx.hideLoading();
        if(res.data.code == 1){
          wx.showLoading({
            title: '租借中...',
            mask: true
          });
          that.monitorBattery(res.data.orderid);
        }else{          
          wx.showModal({
            title: '温馨提示',
            content: res.data.msg,
            showCancel: false
          })
        }
      }
    })
  },


  //监听电池弹出
  monitorBattery: function (orderid){
    wx.redirectTo({
      url: '../success/success?orderid=' + orderid,
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