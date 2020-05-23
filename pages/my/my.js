// pages/my/my.js
const app = getApp()
let storage = require("../../utils/storage.js")
Page({
  data: {
    servenImg: "",
    showUser: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      servenImg: app.uploadImg.url,
    })
    this.setData({
      showUser: storage.get_s("userInfo")
    })
  },
  gotoOffer: function() {
    wx.navigateTo({
      url: './settlement/settlement',
    })
  },
  gotoQuotation:function(){
    wx.navigateTo({
      url: './quotation/quotation',
    })
  },
  gotoOpinion: function() {
    wx.navigateTo({
      url: './opinion/opinion',
    })
  },
  gotoAddress: function() {
    wx.navigateTo({
      url: './adress/adress',
    })
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