// pages/my/settlement/settlement.js
const app = getApp()
let storage = require("../../../utils/storage.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: "",
    settlmentInfo: ""
  },

  //报价单列表
  cartInfo: function () {
    const that = this
    let list = storage.get_s("token")
    let item = {
      access_token: list.access_token
    }
    app.xhr('GET', app.apiUrl.cartList, item, '', (res) => {
      if (res.data.code == 0) {
        that.setData({
          quotationInfo: res.data.data
        })
      }
    })
  },

  onLoad: function (options) {
    this.cartInfo();
    this.setData({
      imgUrl: app.uploadImg.url,
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