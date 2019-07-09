// pages/helpCenter/helpCenter.js
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
    answers:[],
    langs:{},
  },

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = 1;
    this.setLanguage();
    this.getData();
  },
  setLanguage() {
    this.setData ({
      langs: wx.I18n.getLanguage()
    });
    wx.setNavigationBarTitle({
      title: this.data.langs['helpCenter_TITLE'],
    })
  },
  getData: function () {
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
      url: app.globalData.publicUrl + "Help/HelpList.asp?page=" + page+'&language='+this.data['langs']['lang_type'],
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
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
          wx.showModal({
            title: that.data.langs['warn_title'],
            content: res.data.msg,
            showCancel: false
          });
          wx.hideNavigationBarLoading();
        }

      }
    })

  },


  goShow: util.throttle(function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../helpShow/helpShow?id=' + id,
    })
  }, 1000),

  goRepair: util.throttle(function(e){
    wx.navigateTo({
      url: '../repair/repair',
    })
  },1000),
  callService: util.throttle(function () {
    wx.makePhoneCall({
      phoneNumber: wx.getStorageSync("WEB_Mobile"),
    })
  }, 1000),

  goAgreement: util.throttle(function (e) {
    wx.navigateTo({
      url: '../serviceAgreement/serviceAgreement',
    })
  }, 1000),


  addAnswer: util.throttle(function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    that.getAnswer(id,function(res){
      if(res.length>0){
        that.data.answers.push(res);
        that.setData({
          answers: that.data.answers
        });
        let query = wx.createSelectorQuery();
        query.select('.main').boundingClientRect();
        query.exec(function (res) {
          wx.pageScrollTo({
            scrollTop: res[0].height,
            duration: 300
          })
        });
      }
    });    
  },1000),


  getAnswer:function(id,callback){
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
      url: app.globalData.publicUrl + "Help/HelpDetail.asp?id=" + id+'&language='+this.data['langs']['lang_type'],
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        // language:"语言"
      },
      method: "POST",
      dataType: "json",
      success: function (res) {
        wx.hideNavigationBarLoading();
        if (res.data.code == 1) {
          callback && callback(res.data.data.p_Content);
        } else {
          wx.showModal({
            title: that.data.langs['warn_title'],
            content: res.data.msg,
            showCancel: false
          });
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
    page = 1;
    this.setData({
      showMore: true,
      answers: []
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