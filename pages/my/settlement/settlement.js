// pages/my/settlement/settlement.js
const app = getApp()
let storage = require("../../../utils/storage.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: "",
    settlmentInfo: [],
    settlmentObj:""
  },

  //结算单列表
  orderInfo: function() {
    const that = this
    let list = storage.get_s("token")
    let item = {
      access_token: list.access_token
    }
    app.xhr('GET', app.apiUrl.orderList, item, '', (res) => {
      if (res.data.code == 0) {
        let items = res.data.data
        if (items.good != undefined && items.good != null && items.good != '') {
          let newArr = res.data.data.good.map(item => {
            item.own_spec = item.own_spec.substr(1);
            item.own_spec = item.own_spec.substr(0, item.own_spec.length - 1);
            return item
          });
          that.setData({
            settlmentInfo: newArr
          })
          console.log("777888", newArr)
        }
        that.setData({
          settlmentObj: items
        })
      }
    })
  },

  onLoad: function(options) {
    this.orderInfo();
    this.setData({
      imgUrl: app.uploadImg.url,
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