// pages/productDetail/productDetail.js
const app = getApp()
let storage = require("../../utils/storage.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    servenImg: '',
    shopDetailList: "",
    detailsList: "",
    showCartModel: false,
    templateList: "",
    shopModelList: "",
    templateListInfo: "",
    changeIndex: 0,
    selected: ""
  },

  showModel: function(e) {
    let that = this
    if (e.currentTarget.dataset.item.is_multi_specification == 0) {
      let token = storage.get_s("token")
      let shopdata = storage.get_s("showDataObj")
      let skuList = {
        access_token: token.access_token,
        community_id: shopdata.community_id,
        house_type_id: shopdata.house_id,
        product_spu_id: e.currentTarget.dataset.item.id,
        sku: "[]"
      }
      app.xhr('GET', app.apiUrl.commoditySku, skuList, '', (res) => {
        if (res.data.code == 0) {
          let items = {
            access_token: token.access_token,
            community_id: shopdata.community_id,
            house_type_id: shopdata.house_id,
            good_num: 1,
            good_id: e.currentTarget.dataset.item.id,
            good_sku_id: res.data.data.id,
            address_id: shopdata.address_id
          }
          app.xhr('POST', app.apiUrl.cartAdd, items, '', (res1) => {
            if (res1.data.code == 0) {
              wx.switchTab({
                url: '../index/index',
              })
            }
          })
        }
      })
    } else {
      let modifyTmep = JSON.parse(e.currentTarget.dataset.item.spec_template)
      Object.keys(modifyTmep).forEach(function(key) {
        for (var i in modifyTmep) {
          that.setData({
            selected: key + ':' + modifyTmep[i][that.data.changeIndex]
          })
        }
      })
      that.setData({
        showCartModel: true,
        templateListInfo: modifyTmep
      })
    }
  },
  //点击选择规格后选好了加入购物车
  addCartNum: function(e) {
    console.log("eeerrr", e)
    let that = this
    let token = storage.get_s("token")
    let shopdata = storage.get_s("showDataObj")
    let msg = ""
    let typeJson = ""
    Object.keys(that.data.templateListInfo).forEach(function(key) {
      for (var i in that.data.templateListInfo) {
        typeJson = '{' + JSON.stringify(key) + ":" + JSON.stringify(that.data.templateListInfo[i][that.data.changeIndex]) + '}'
      }
    })
    let skuList = {
      access_token: token.access_token,
      community_id: shopdata.community_id,
      house_type_id: shopdata.house_id,
      product_spu_id: e.currentTarget.dataset.id.id,
      sku: JSON.parse(typeJson)
    }
    app.xhr('GET', app.apiUrl.commoditySku, skuList, '', (res) => {
      if (res.data.code == 0) {
        let items = {
          access_token: token.access_token,
          community_id: shopdata.community_id,
          house_type_id: shopdata.house_id,
          good_num: 1,
          good_id: e.currentTarget.dataset.id.id,
          good_sku_id: res.data.data.id,
          address_id: shopdata.address_id
        }
        app.xhr('POST', app.apiUrl.cartAdd, items, '', (res1) => {
          if (res1.data.code == 0) {
            app.toast("添加购物车成功")
            that.setData({
              showCartModel: false,
              showCart: true,
            })
            wx.switchTab({
              url: '../index/index',
            })
          }
        })
      }
    })
  },
  //点击切换规格
  changeType: function(e) {
    let that = this
    this.setData({
      changeIndex: e.currentTarget.dataset.id
    })
    let typeJson = ""
    Object.keys(that.data.templateListInfo).forEach(function(key) {
      for (var i in that.data.templateListInfo) {
        that.setData({
          selected: key + ':' + that.data.templateListInfo[i][that.data.changeIndex]
        })
      }
    })
  },
  hideModel: function() {
    let that = this
    that.setData({
      showCartModel: false
    })
  },

  showSpecificationModel: function(e) {
    let that = this
    that.setData({
      showCartModel: true,
      shopModelList: e.currentTarget.dataset.item,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let list = JSON.parse(options.shopDetailList)
    this.setData({
      servenImg: app.uploadImg.url,
      shopDetailList: list
    })
    this.shopDetail();
  },

  //返回按钮
  backShopDetails: function() {
    wx.navigateBack({
      delta: 1
    })
  },

  //商品详情
  shopDetail: function() {
    let that = this
    let token = storage.get_s("token")
    let shopdata = storage.get_s("showDataObj")
    let item = {
      access_token: token.access_token,
      community_id: shopdata.community_id,
      house_type_id: shopdata.house_id,
      id: that.data.shopDetailList.id
    }
    app.xhr('GET', app.apiUrl.shopDetails, item, '', (res) => {
      if (res.data.code == 0) {
        let listData = res.data.data
        let modifyTmep = JSON.parse(listData.specifications)
        that.setData({
          detailsList: res.data.data,
          templateList: modifyTmep
        })
      }
    })
  },



  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
