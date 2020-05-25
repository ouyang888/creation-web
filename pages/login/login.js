// pages/login/login.js
const app = getApp()
let storage = require("../../utils/storage.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    showUser: null,
    code: ""
  },



  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    if (e.detail.errMsg == "getUserInfo:fail auth deny") {
      return;
    } else {
      wx.login({
        success: res => {
          console.log("888", res)
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true,
            code: res.code
          })
          storage.set("userInfo", this.data.userInfo)
        }
      })

    }



    // if (e.detail.userInfo == undefined) {
    //   return;
    // } else {
    //   wx.switchTab({
    //     url: '../index/index'
    //   })
    // }
  },


  //获取手机号码
  getPhoneNumber: function(e) {
    console.log(e)
    if (e.detail.errMsg == "getPhoneNumber:fail user deny") {
      return;
    } else {
      // this.thirdPartyLogin();
      let list = {
        code: this.data.code,
        json_data: e.detail.encryptedData,
        iv: e.detail.iv,
        name: this.data.userInfo.nickName,
        avatarUrl: this.data.userInfo.avatarUrl,
        gender: this.data.userInfo.gender
      }
      app.xhr('POST', app.apiUrl.weChatData, list, '', (res) => {
        if (res.data.code == 0) {
          storage.set("token", res.data.data)
        }
      })
      setTimeout(()=>{
        wx.redirectTo({
          url: '../my/adress/adress'
        })
      },500)
     
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})