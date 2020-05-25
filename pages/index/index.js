const app = getApp()
let storage = require("../../utils/storage.js")
Page({
  data: {
    showUser: null,
    selectedFlag: [false, false, false, false],
    showCart: false,
    tabList: [],
    shopInfo: [],
    //推荐套餐
    productList: [],
    leftTabActived: null, //左侧栏-当前选中值
    servenImg: '',
    isShowProjectList: true, //判断项目显示\隐藏
    catrNum: 0,
    showAddImg: true,
    cartData: [],
    quotationInfo: [],
    showCartModel: false,
    shopModelList: "",
    templateList: "",
    changeIndex: 0,
    selected: ""
  },

  //点击切换规格
  changeType: function(e) {
    let that = this
    this.setData({
      changeIndex: e.currentTarget.dataset.id
    })
    let typeJson = ""
    Object.keys(that.data.templateList).forEach(function(key) {
      for (var i in that.data.templateList) {
        that.setData({
          selected: key + ':' + that.data.templateList[i][that.data.changeIndex]
        })
      }
    })
  },

  //点击增加符号或选规格添加到购物车
  addCartNum: function(e) {
    let that = this
    let token = storage.get_s("token")
    let shopdata = storage.get_s("showDataObj")
    let msg = ""
    let typeJson = ""
    Object.keys(that.data.templateList).forEach(function(key) {
      for (var i in that.data.templateList) {
        typeJson = '{' + JSON.stringify(key) + ":" + JSON.stringify(that.data.templateList[i][that.data.changeIndex]) + '}'
      }
    })

    if (e.currentTarget.dataset.id.is_multi_specification == 0) {
      msg = "[]"
    } else {
      msg = JSON.parse(typeJson)
    }
    let skuList = {
      access_token: token.access_token,
      community_id: shopdata.community_id,
      house_type_id: shopdata.house_id,
      product_spu_id: e.currentTarget.dataset.id.id,
      sku: msg
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
            },()=>{
              that.cartInfo();
              that.shopList();
            })
          }
        })
      }
    })
  },

  //弹框减号删除购物车单个商品
  delCatrShop: function(e) {
    let that = this
    let token = storage.get_s("token")
    let shopdata = storage.get_s("showDataObj")
    let item = {
      access_token: token.access_token,
      community_id: shopdata.community_id,
      house_type_id: shopdata.house_id,
      address_id: shopdata.address_id,
      good_id: e.currentTarget.dataset.id.good_id,
    }
    app.xhr('POST', app.apiUrl.cartDel, item, '', (res) => {
      if (res.data.code == 0) {
        app.toast("删除成功");
        this.shopList();
        this.cartInfo();
      }
    })
  },

  //购物车列表
  cartInfo: function() {
    const that = this
    let list = storage.get_s("token")
    let shopdata = storage.get_s("showDataObj")
    let item = {
      access_token: list.access_token,
      community_id: shopdata.community_id,
      house_type_id: shopdata.house_id,
      address_id: shopdata.address_id
    }
    app.xhr('GET', app.apiUrl.cartList, item, '', (res) => {
      if (res.data.code == 0) {
        let items = res.data.data;
        if (items.cart != undefined && items.cart != null && items.cart != '') {
          let newArr = items.cart.map(item => {
            item.own_spec = item.own_spec.substr(1);
            item.own_spec = item.own_spec.substr(0, item.own_spec.length - 1);
            return item
          });
          that.setData({
            quotationInfo: newArr,
          })
        }else{
          that.setData({
            quotationInfo: [],
          })
        }
        that.setData({
          quotationObj: items
        })
        // console.log(newArr);
       
      }
    })
  },

  hideModel: function() {
    let that = this
    that.setData({
      showCart:false,
      showCartModel: false
    })
  },

  showSpecificationModel: function(e) {
    let that = this
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
      shopModelList: e.currentTarget.dataset.item,
      templateList: modifyTmep,

    })
  },

  //点击减符号添加到购物车
  reduceCartNum: function() {
    let that = this
    that.setData({
      showAddImg: true,
      catrNum: that.data.catrNum - 1
    })
  },
  cartMsg: function() {
    this.setData({
      showCart: true,
      showCartModel:true
    });
  },
  cartHide: function() {
    // console.log("222")
    let that = this
    that.setData({
      showCart: false
    });
  },
  onShow: function() {
    this.category();
    this.cartInfo();
  },
  onLoad: function() {
    this.setData({
      showUser: storage.get_s("userInfo"),
      servenImg: app.uploadImg.url,
    });
    if (this.data.showUser == '' || this.data.showUser == null || this.data.showUser == undefined) {
      wx.navigateTo({
        url: '../../pages/login/login',
      })
    }
  },

  //跳转商品详情页
  gotoDetails: function(e) {
    // console.log("1111", )
    // storage.set("shopDetailList", e.currentTarget.dataset.index)
    wx.navigateTo({
      url: '../productDetail/productDetail?shopDetailList=' + JSON.stringify(e.currentTarget.dataset.index)
    });
  },


  //左侧分类遍历
  category: function() {
    let that = this
    let token = storage.get_s("token")
    let shopdata = storage.get_s("showDataObj")
    let item = {
      access_token: token.access_token,
      community_id: shopdata.community_id
    }
    app.xhr('GET', app.apiUrl.categoryList, item, '', (res) => {
      if (res.data.code == 0) {
        that.setData({
          tabList: res.data.data,
          leftTabActived: res.data.data[0].id
        })
        this.shopList();
      }
    })
  },

  //获取商品列表
  shopList: function() {
    let that = this
    let token = storage.get_s("token")
    let shopdata = storage.get_s("showDataObj")
    let item = {
      access_token: token.access_token,
      community_id: shopdata.community_id,
      house_type_id: shopdata.house_id,
      cid1: that.data.leftTabActived
    }
    app.xhr('GET', app.apiUrl.shopList, item, '', (res) => {
      if (res.data.code == 0) {
        let newArr = res.data.data.map(item => {
          item.specifications = item.specifications.substr(1);
          item.specifications = item.specifications.substr(0, item.specifications.length - 1);
          return item;
        })
        that.setData({
          shopInfo: newArr
        }, () => {
          that.data.shopInfo.forEach(item => {
            // if (that.data.quotationInfo != ''){
              that.data.quotationInfo.forEach(data => {
                if (item.id == data.good_id) {
                  that.setData({
                    showAddImg: false
                  })
                }
              })
            // }
          })
        })
        // that.setData({
        //   shopInfo: res.data.data
        // })
      }
    })
  },
  // 左侧栏-点击获取当前选中的值
  handleTab(e) {
    this.setData({
      leftTabActived: e.currentTarget.dataset.id
    })
    let that = this
    let token = storage.get_s("token")
    let shopdata = storage.get_s("showDataObj")
    let item = {
      access_token: token.access_token,
      community_id: shopdata.community_id,
      house_type_id: shopdata.house_id,
      cid1: e.currentTarget.dataset.id
    }
    app.xhr('GET', app.apiUrl.shopList, item, '', (res) => {
      if (res.data.code == 0) {
        let newArr = res.data.data.map(item => {
          item.specifications = item.specifications.substr(1);
          item.specifications = item.specifications.substr(0, item.specifications.length - 1);
          return item;
        })
        that.setData({
          shopInfo: newArr
        }, () => {
          that.data.shopInfo.forEach(item => {
            that.data.quotationInfo.forEach(data => {
              if (item.id == data.good_id) {
                that.setData({
                  showAddImg: false
                })
              }
            })
          })
        })
      }
    })
  },

  //右侧栏-点击标题-收缩效果
  handleTitle(e) {
    var index = e.currentTarget.dataset.index;
    if (this.data.selectedFlag[index]) {
      this.data.selectedFlag[index] = false;
    } else {
      this.data.selectedFlag[index] = true;
    }

    this.setData({
      selectedFlag: this.data.selectedFlag
    })
  }
})