// pages/repair/repair.js
var subReason = wx.I18n.getLanguage()['repairPG_reson_0'];
var myMask = "";
var equipmentNum = "";
var app = getApp();
var imgArr = [];
var imgNum = 0;
var pic = ""; 
var formID;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    langs:{},
    select: 0,
    reson: [
      {
        id: 0,
        resondes: wx.I18n.getLanguage()['repairPG_reson_0']
      },
      {
        id: 1,
        resondes: wx.I18n.getLanguage()['repairPG_reson_1']
      },
      {
        id: 2,
        resondes: wx.I18n.getLanguage()['repairPG_reson_2']
      },
      {
        id: 3,
        resondes: wx.I18n.getLanguage()['repairPG_reson_3']
      },
      {
        id: 4,
        resondes: wx.I18n.getLanguage()['repairPG_reson_4']
      },
    ],
    deviceID: "",
    photoHidden1: false,
    photoHidden2: true,
    photoHidden3: true,
    image_photo1: "../../img/addPic.jpg",
    image_photo2: "../../img/addPic.jpg",
    image_photo3: "../../img/addPic.jpg"
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
      title: this.data.langs['repair_TITLE'],
    })
  },
  selectReson: function (e) {
    var num = e.currentTarget.dataset.id;
    subReason = e.currentTarget.dataset.reason;
    this.setData({
      select: num
    });
  },
  bindTextAreaBlur: function (e) {
    myMask = e.detail.value;//获取补充说明
  },
  getEquipment: function (e) {
    equipmentNum = e.detail.value;
  },
  tiJiao: function (e) {
    var that = this;
    formID = e.detail.formId;
    if (!equipmentNum) {
      wx.showModal({
        title: '温馨提示',
        content: '设备编号不能为空哦',
        showCancel: false
      })
      return;
    }
    wx.showLoading({
      title: '提交中...',
      mask: true
    });
    if (imgArr.length > 0) {
      that.uploadPhoto();
    } else {
      that.subSave();
    }
  },
  scaner: function () {
    var that = this;
    wx.scanCode({//打开扫描
      success: (res) => {
        if (res && res.errMsg == "scanCode:ok") {
          var deviceID = res.result;
          deviceID = deviceID.split("/");
          deviceID = deviceID[deviceID.length - 1];
          equipmentNum = deviceID;
          that.setData({
            deviceID: deviceID
          });
        }
      },
      fail: (err) => {
        console.log("err:" + JSON.stringify(err));
      }
    })
  },
  photograph: function (e) {
    var that = this
    var index = e.target.dataset.num;
    wx.chooseImage({
      count: 3, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;

        if (index == 1) {
          that.setData({
            image_photo1: tempFilePaths,
            photoHidden2: false
          });
          if (imgArr.length > 0) {
            imgArr.splice(1, 1);
            imgArr.push(tempFilePaths);
          } else {
            imgArr.push(tempFilePaths);
          }
        } else if (index == 2) {
          that.setData({
            image_photo2: tempFilePaths,
            photoHidden3: false
          });
          if (imgArr.length > 0) {
            imgArr.splice(2, 1);
            imgArr.push(tempFilePaths);
          } else {
            imgArr.push(tempFilePaths);
          }
        } else if (index == 3) {
          that.setData({
            image_photo3: tempFilePaths
          })
          if (imgArr.length > 0) {
            imgArr.splice(3, 1);
            imgArr.push(tempFilePaths);
          } else {
            imgArr.push(tempFilePaths);
          }
        }
      }
    })
  },
  uploadPhoto: function () {
    var that = this;
    var subImg = imgArr[imgNum] + "";
    wx.uploadFile({
      url: app.globalData.publicUrl + 'upload_save.asp?action=appdb&filetype=gif|jpg|png|doc|docx|xls|xlsx|ppt|pptx|rar|zip|7z|pdf|txt|flv|mp4|apk&admin_id=0&loginbase=1&loginkey=2',
      filePath: subImg,
      name: 'file',
      dataType: "json",
      success: function (res) {
        // var obj = JSON.parse(res.data);
        if (res.data) {
          if (imgNum < imgArr.length) {
            if (imgNum == 0) {
              pic = res.data;
            } else {
              pic += "," + res.data;
            }
            that.uploadPhoto();
            imgNum++;
          } else {
            that.subSave();
          }
        } else {
          //上图失败
        }
      }
    })
  },
  subSave: function () {
    let _this = this;
    wx.request({
      url: app.globalData.publicUrl + 'Repair/repair.asp'+'?language='+this.data['langs']['lang_type'],      
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        reason: subReason,
        mask: myMask,
        deviceID: equipmentNum,
        pic: pic,
        openID: wx.getStorageSync("openId"),
        longitude: wx.getStorageSync("lon"),
        latitude: wx.getStorageSync("lat"),
        formId: formID,
        // language:"语言",
      },
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res && res.data.code == 1) {
          wx.hideLoading();
          wx.showToast({
            title: "提交成功",
          });
          setTimeout(function () {
            wx.navigateBack({});
          }, 1300);
        } else {
          wx.hideLoading();
          wx.showModal({
            title: _this.data.langs['warn_title'],
            content: res.data.msg + "",
            showCancel: false
          })
        }
      },
      fail: function (res) {
        wx.hideLoading();
        console.log("提交失败：" + JSON.stringify(res));
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
    this.setData({
      reson: [
        {
          id: 0,
          resondes: wx.I18n.getLanguage()['repairPG_reson_0']
        },
        {
          id: 1,
          resondes: wx.I18n.getLanguage()['repairPG_reson_1']
        },
        {
          id: 2,
          resondes: wx.I18n.getLanguage()['repairPG_reson_2']
        },
        {
          id: 3,
          resondes: wx.I18n.getLanguage()['repairPG_reson_3']
        },
        {
          id: 4,
          resondes: wx.I18n.getLanguage()['repairPG_reson_4']
        },
      ]
    })
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