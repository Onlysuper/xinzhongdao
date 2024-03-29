// pages/user/user.js
const app = getApp();
const util = require("../../utils/util.js");
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showNickName:true,
    showShop:true,
    langs:{},
    nickName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.getAuthorize();
    this.setLanguage();
  },
  setLanguage() {
    this.setData ({
      langs: wx.I18n.getLanguage()
    });
    wx.setNavigationBarTitle({
      title: this.data.langs['user_TITLE'],
    })
  },
  getAuthorize:function(){
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          that.setData({
            showNickName: false
          });
        }else{
          that.setData({
            showNickName: true
          });
        }
      }
    })
  },
  getInfo:function(e){
    let _this = this;
    var goUrl = e.target.dataset.url;
    if (e.detail.errMsg == "getUserInfo:ok"){
      if (!wx.getStorageSync("isLogin")) {//判断用户是否注册
        app.globalData.userInfo = e.detail.userInfo;
        app.globalData.encryptedData = e.detail.encryptedData;
        app.globalData.iv = e.detail.iv;
        app.registerUser();//注册用户
      };
      that.setData({
        showNickName: false
      });
      wx.navigateTo({
        url: goUrl,
      });
    }else{
      wx.showToast({
        title: _this.data.langs['rejectshouquan'],
        icon:"none"
      })
    }
  },

  //获取去服务器用户信息
  getServiceInfo: function () {
    if (!wx.getStorageSync("isLogin")) {
      return false;
    };
    var _this = this;
    wx.showNavigationBarLoading();
    wx.$apis.postUserInfo(
      `?language=${_this.data['langs']['lang_type']}`
    )({
      openID: wx.getStorageSync("openId"),
      longitude: wx.getStorageSync("lon"),
      latitude: wx.getStorageSync("lat")})
    .then(res=>{
      if (res.code == '1') {
        _this.setData({
          nickName:res.data.p_WxName
        })
        if (res.data.agent_open == 0){
          //普通用户
          _this.setData({
            showShop:true
          });
        }else{
          //特约用户
          _this.setData({
            showShop: false
          });
        }
      }
    }).catch((error)=>{

    })
    // return false;
  //   wx.request({
  //     url: app.globalData.publicUrl + 'User/Info.asp'+'?language='+_this.data['langs']['lang_type'],
  //     header: {
  //       "Content-Type": "application/x-www-form-urlencoded"
  //     },
  //     method: 'POST',
  //     data: {
  //       openID: wx.getStorageSync("openId"),
  //       longitude: wx.getStorageSync("lon"),
  //       latitude: wx.getStorageSync("lat")
  //     },
  //     dataType: "json",
  //     success: function (res) {
  //       wx.hideNavigationBarLoading();
  //       if (res.data.code == 1) {
  //         _this.setData({
  //           nickName:res.data.data.p_WxName
  //         })
  //         if (res.data.data.agent_open == 0){
  //           //普通用户
  //           _this.setData({
  //             showShop:true
  //           });
  //         }else{
  //           //特约用户
  //           _this.setData({
  //             showShop: falses
  //           });
  //         }
         
  //       } else {
  //         wx.showModal({
  //           title:_this.data.langs['warn_title'],
  //           content: res.data.msg,
  //           showCancel: false
  //         })
  //       }
  //     }
  //   })
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
    this.getServiceInfo();
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