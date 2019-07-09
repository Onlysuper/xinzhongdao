




// pages/recharge/recharge.js
const app = getApp();
const util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moneyList:[],
    payMoney:"",
    langs:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setLanguage();
    var getformId = options.formId;
    this.getData(getformId);
  },
  setLanguage() {
    this.setData ({
      langs: wx.I18n.getLanguage()
    });
    wx.setNavigationBarTitle({
      title: this.data.langs['recharge_TITLE'],
    })
  },
  getData:function(fid){
   
    wx.showNavigationBarLoading();
    var _this = this;
    wx.request({
      url: app.globalData.publicUrl + 'Chongzhi/ChongzhiSM.asp'+'?language='+_this.data['langs']['lang_type'],
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        openID: wx.getStorageSync("openId"),
        longitude: wx.getStorageSync("lon"),
        latitude: wx.getStorageSync("lat"),
        formId: fid
        // language:"语言",
      },
      dataType: "json",
      success:function(res){
        wx.hideNavigationBarLoading();
        if (res.data.code == 1) {
          _this.setData({
            moneyList: res.data.price.split(","),
            payMoney: res.data.price.split(",")[0]
          })
        } else {
          wx.$toast({
            title: _this.data.langs['warn_title'],
            content: res.data.msg,
            showCancel: false
          })
        }
      }
    })
  },
  chooseMoney:function(e){    
    var pay = e.target.dataset.money;
    this.setData({
      payMoney:pay
    });
  },

  //点击充值
  payTap: util.throttle(function(e){
    var _this = this;
    wx.showNavigationBarLoading();
    wx.request({
      url: app.globalData.publicUrl + 'Chongzhi/Chongzhi.asp'+'?language='+_this.data['langs']['lang_type'],
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        openID: wx.getStorageSync("openId"),
        longitude: wx.getStorageSync("lon"),
        latitude: wx.getStorageSync("lat"),
        formId: e.detail.formId,
        money: _this.data.payMoney,
        // language:"语言",
      },
      dataType: "json",
      success: function (res) {
        wx.hideNavigationBarLoading();
        var orderId = res.data.data.out_trade_no;
        if (res.data.status){
          wx.requestPayment({
            timeStamp: res.data.data.timeStamp,
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.package,
            signType: res.data.data.signType,
            paySign: res.data.data.paySign,
            success: function(result){
              if (result.errMsg == "requestPayment:ok") {
                _this.payCheck(orderId);
              }
            },
            fail: function(err){
              if (err.errMsg == "requestPayment:fail cancel"){
                wx.showToast({
                  title: _this.data.langs['no_recharge'],
                  icon: "none"
                })
              }
            }
          })
        }
      }
    })
  },1000),

  payCheck:function(orderid){
    let _this=this;
    wx.request({
      url: app.globalData.publicUrl + 'Chongzhi/ChongzhiCheck.asp'+'?language='+_this.data['langs']['lang_type'],
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        openID: wx.getStorageSync("openId"),
        longitude: wx.getStorageSync("lon"),
        latitude: wx.getStorageSync("lat"),
        payment: "ok",
        out_trade_no: orderid
        // language:"语言"
      },
      dataType: "json",
      success: function (res) {
        // console.log("付款成功之后：" + JSON.stringify(res));
        if(res.data.code == 1){
          wx.showToast({
            title: `${_this.data['langs']['walletPG_recharge']}成功`,
            icon: 'success',
            duration: 2000
          });
          setTimeout(function () { wx.navigateBack({});},1000);          
        }else{
          wx.$toast({
            title: `${_this.data['langs']['warn_title']}`,
            content: res.data.msg,
            showCancel: false
          })
        }
      }
    })
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