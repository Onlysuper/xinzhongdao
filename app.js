
import locales from './utils/locales.js';
import I18n from './utils/i18n.js';
import * as $apis from './utils/apis/index.js';

I18n.registerLocale(locales);

//当前语言设置为用户上一次选择的语言，如果是第一次使用，则调用 T.setLocaleByIndex(0) 将语言设置成中文
I18n.setLocaleByIndex(wx.getStorageSync('langIndex') || 1);

wx.I18n = I18n;
wx.$apis = $apis;
//app.js
App({
  onLaunch: function () {
    this.loginApp();
  },
  loginApp:function(callback){
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: this.globalData.publicUrl + "Init/Int.asp",
          method: "POST",
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: {
            js_code: res.code
          },
          dataType: "json",
          success: res => {
            console.log(JSON.stringify(res));
            if (res.data.code == 1) {
              wx.setStorageSync('openId', res.data.data.openid);
              wx.setStorageSync('sessionKey', res.data.data.session_key);
              wx.setStorageSync('WEB_Mobile', res.data.WEB_Mobile);//客服电话
              callback && callback();
            } else {
              wx.showModal({
                title: '温馨提示',
                content: 'Int.asp:' + res.data.msg,
                showCancel: false
              })
            }
          }
        })
      }
    })
  },

  //注册用户
  registerUser:function(callback){
    var that = this;
    wx.request({
      url: this.globalData.publicUrl + "Init/Register.asp",
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        encryptedData: that.globalData.encryptedData,
        session_key: wx.getStorageSync('sessionKey'),
        iv: that.globalData.iv,
        longitude: wx.getStorageSync("lon"),
        latitude: wx.getStorageSync("lat")
      },
      dataType: "json",
      success: res => {
        if (res.data.code == 1) {
          wx.setStorageSync("isLogin", true);
        }else if(res.data.code == 999){
          that.registerUser();
        } else {
          wx.showModal({
            title: that.data.langs['warn_title'],
            content: 'Register.asp:' + res.data.msg,
            showCancel: false
          })
        }
        callback && callback(res);
      }
    })
  },

  

  globalData: {
    userInfo: null,       //用户信息
    encryptedData:"",
    iv:"",
    publicUrl:"https://share.xmfstore.com/client/cdb/newXcx/"         //请求接口公共路径
    // publicUrl:"http://test52.qtopay.cn/client/cdb/newXcx/"         //请求接口公共路径
  }
})