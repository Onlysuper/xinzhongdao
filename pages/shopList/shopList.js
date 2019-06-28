// pages/shopList/shopList.js
const util = require("../../utils/util.js");
const app = getApp();

var page = 1;
var maxPage;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    shopList:[],
    showNoData:true,
    showMore:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = 1;
    this.getData();
  },
  getData:function(){
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
      url: app.globalData.publicUrl + "Shop/shopList.asp?page="+page,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        longitude: wx.getStorageSync("lon"),
        latitude: wx.getStorageSync("lat")
      },
      method: "POST",
      dataType: "json",
      success: function(res){
        if(res.data.code == 1){
          maxPage = res.data.maxpage;
          if(res.data.total > 0){
            if(page == 1){
              that.setData({
                shopList: []
              });
            };
            var myData = that.data.shopList.concat(res.data.data);
            that.setData({
              shopList: myData,
              showNoData: true,
              showMore: true
            });            
          }else{
            that.setData({
              shopList: [],
              showNoData: false,
              showMore: true
            });
          }  
          wx.stopPullDownRefresh();
          wx.hideNavigationBarLoading();        
        }else{
          wx.showModal({
            title: '温馨提示',
            content: res.data.msg,
            showCancel: false
          });
          wx.hideNavigationBarLoading();
        }

      }
    })

  },


  goShow: util.throttle(function(e){
    var shopid = e.currentTarget.dataset.shopid;
    wx.navigateTo({
      url: '../shopShow/shopShow?shopid='+shopid,
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
    if (page <= maxPage){
      this.getData();
    }else{
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