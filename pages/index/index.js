//index.js
//获取应用实例
const app = getApp();
const util = require('../../utils/util.js');
var that;
var externalCode;
Page({
  data: {
    langs: '',
    languages: ['简体中文', '繁體中文','English'],
    langIndex: '1',
    userInfo: {},
    lat: 39.908,
    lon: 116.3972,
    scale:6,
    markers:[],
    address:{},
    showAddress:true,
    controls:[
      {
        id: 0,
        iconPath: '/img/location.png',
        position: {
          left: (wx.getSystemInfoSync().windowWidth - 40)/2,
          top: (wx.getSystemInfoSync().windowHeight - 125)/2,
          width: 40,
          height: 40
        },
        clickable: false
      }
    ]
  },
  onLoad: function (options) {
    // 语言start
    this.setData({
      langIndex: wx.getStorageSync('langIndex')||"1"
    });
    this.setLanguage();
    // 语言end
    if (options.q){
      externalCode = options.q;
    };
    that = this;
    this.mapCtx = wx.createMapContext('map');
    this.getLocation();
    wx.showShareMenu({
      withShareTicket: true
    });
  },
  setLanguage() {
    this.setData ({
      langs: wx.I18n.getLanguage()
    });
    wx.setNavigationBarTitle({
      title: this.data.langs['index_TITLE'],
    })
  },
  changeLanguage(e) {
    let index = e.detail.value;
    this.setData({	// (1)
      langIndex: index
    });
    wx.I18n.setLocaleByIndex(index);
    this.setLanguage();
    wx.setStorage({
      key: 'langIndex',
      data: this.data.langIndex
    })
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    // this.setData({
    //   index: e.detail.value
    // })
  },
  //获取用户信息
  getUserInfo: function(callback) {
    // 在没有 open-type=getUserInfo 版本的兼容处理
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo;
        app.globalData.encryptedData = res.encryptedData;
        app.globalData.iv = res.iv;
        this.setData({
          userInfo: res.userInfo
        });
        callback && callback(true);
      }
    });
  },
  

  //获取地理位置
  getLocation:function(){
    wx.getLocation({
      success: function(res) {
        that.setData({
          lat: res.latitude,
          lon: res.longitude,
          scale:15
        });
        wx.setStorageSync("lat", res.latitude);
        wx.setStorageSync("lon", res.longitude);
        setTimeout(function () {
          that.mapReset();
        }, 800);
        that.externalScan();
      },
      fail: function(err){
        that.setData({
          lat: 39.908,
          lon: 116.3972,
          scale: 15
        });
        wx.setStorageSync("lat", 39.908);
        wx.setStorageSync("lon", 116.3972);
        that.externalScan();
      }
    })
  },

  //复位
  mapReset: util.throttle(function(e){
    this.mapCtx.moveToLocation();
  },1000),

  //打开新页面
  goNewPage: util.throttle(function(e){
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url,
    })
  },1000),

  //判断是否授权
  getAuthorize: function () {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          //已授权
          if (!wx.getStorageSync("isLogin")){
            app.loginApp(function(){
              that.getUserInfo(function(ret){
                if(ret){
                  app.registerUser();
                }
              });
            });
          }
        } else {
          //未授权
          console.log("未授权");
          wx.setStorageSync("isLogin", false);
        }
      }
    })
  },

  //加载店铺
  getShop:function(lats,lons){
    wx.showNavigationBarLoading();
    wx.request({
      url: app.globalData.publicUrl + 'map/map.asp',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        longitude: lons,
        latitude: lats
      },
      method: "POST",
      dataType: "json",
      success: res => {
        if(res.data.total <= 0){
          //附近没有商户不做处理
          wx.hideNavigationBarLoading();
          return false;
        };

        if(res.data.code == 1){
          if(res.data.total > 0){
            var markers = [];
            for(var i=0;i<res.data.data.length;i++){
              var son = {
                iconPath: "/img/marker.png",
                id:res.data.data[i].no,
                latitude: res.data.data[i].latitude,
                longitude: res.data.data[i].longitude,
                width:45,
                height:45,
                msg: { shopName: res.data.data[i].shopName, address: res.data.data[i].address, batteryCount: res.data.data[i].batteryCount, shopId: res.data.data[i].id}
              };
              markers.push(son);
            };

            that.setData({
              markers: markers
            });
            wx.hideNavigationBarLoading();
          }
        };
        
      }
    })
  },

  //商户点击
  markersTap:util.throttle(function(e){
    var sortNum = parseInt(e.markerId);
    that.data.markers[sortNum].width = 50;
    that.data.markers[sortNum].height = 50;
    that.setData({
      address: that.data.markers[sortNum].msg,
      showAddress:false,
      markers: that.data.markers
    });
  },1000),

  //隐藏地址
  hideAddress:function(){
    that.setData({
      showAddress: true
    });
  },

  //地图事件处理
  regionchange: util.throttle( function (e) {
    that.hideAddress();
    that.mapCtx.getCenterLocation({
      success: res => {
        that.getShop(res.latitude, res.longitude);
      }
    })
  },1000),

  

  //打开扫描
  scan:function(e){
    wx.scanCode({
      success: (res) => {
        console.log("扫描："+JSON.stringify(res));
        if (res.errMsg == "scanCode:ok") {
          var deviceID = res.result;
          deviceID = deviceID.split("/");
          deviceID = deviceID[deviceID.length - 1];
          console.log("二维码ID:" + deviceID);
          wx.navigateTo({
            url: '../showOrder/showOrder?id=' + deviceID,
          });
        }else{
          wx.showModal({
            title: '温馨提示',
            content: res.errMsg,
            showCancel: false
          })
        }
      },
      fail: err => {
        console.log("扫描err:"+JSON.stringify(err));
      }
    })
  },
  
  //外部扫码
  externalScan:function(){
    if (externalCode){
      var externalId = decodeURIComponent(externalCode);
      externalId = externalId.split("/");
      externalId = externalId[externalId.length - 1];
      wx.navigateTo({
        url: '../showOrder/showOrder?id=' + externalId,
      });
    }
  },


  //头部搜索
  goSearch: function () {
    wx.chooseLocation({
      success: res => {
        that.setData({
          lon: res.longitude,
          lat: res.latitude,
        });
        that.getShop(res.latitude, res.longitude);
      },
      fail: function (err) {
        console.log(err);
      }
    })
  },
  /**
     * 生命周期函数--监听页面显示
     */
  onShow: function () {
    this.getAuthorize();
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    externalCode = ""
  }
})
