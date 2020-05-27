// pages/quotation/quotation.js
const app = getApp()
let storage = require("../../../utils/storage.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: "",
    startX: 0, //开始坐标
    startY: 0,
    settlmentInfo: "",
    quotationObj: "",
    quotationInfo:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.cartInfo();
    this.setData({
      imgUrl: app.uploadImg.url,
    })

    // var that = this;
    // for (var i = 0; i < 10; i++) {
    //   that.data.items.push({
    //     content: i + " 向左滑动删除哦,向左滑动删除哦,向左滑动删除哦,向左滑动删除哦,向左滑动删除哦",
    //     isTouchMove: false //默认隐藏删除
    //   })
    // }
    // this.setData({
    //   items: this.data.items
    // });
  },

  //开始触摸时 重置所有删除
  touchstart: function (e) {
    this.data.quotationInfo.forEach(function (v, i) {
      if (v.isTouchMove) //只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      quotationInfo: this.data.quotationInfo
    })
  },

  //滑动事件处理
  touchmove: function (e) {
    var that = this,
        index = e.currentTarget.dataset.index, //当前索引
        startX = that.data.startX, //开始X坐标
        startY = that.data.startY, //开始Y坐标
        touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
        touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标

        //获取滑动角度
        angle = that.angle({
          X: startX,
          Y: startY
        }, {
          X: touchMoveX,
          Y: touchMoveY
        });
    that.data.quotationInfo.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      quotationInfo: that.data.quotationInfo
    })
  },



  //计算滑动角度
  angle: function (start, end) {
    var _X = end.X - start.X,
        _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },

  //删除事件
  del: function (e) {
    console.log(e);
    let that = this
    let token = storage.get_s("token")
    let shopdata = storage.get_s("showDataObj")
    let item = {
      access_token: token.access_token,
      community_id: shopdata.community_id,
      house_type_id: shopdata.house_id,
      address_id: shopdata.address_id,
      good_id: e.currentTarget.dataset.item.good_id,
    }
    console.log(item);
    app.xhr('POST', app.apiUrl.cartDel, item, '', (res) => {
      if (res.data.code == 0) {
        app.toast("删除成功");
        this.cartInfo();
      }
    })
  },


  //报价单列表
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
        if (items.cart != undefined && items.cart != null && items.cart != ''&& items.cart) {
          let newArr = res.data.data.cart.map(item => {
            item.own_spec = item.own_spec.substr(1);
            item.own_spec = item.own_spec.substr(0, item.own_spec.length - 1);
            return item
          });
          that.setData({
            quotationInfo: newArr
          })
        }else{
          that.setData({
            quotationInfo: []
          })
        }
        that.setData({
          quotationObj: items
        })
      }
    })
  },

  //创建订单
  orderCreateHandle(){
    let that = this;
    let list = storage.get_s("token")
    let shopdata = storage.get_s("showDataObj")
    let arr = this.data.quotationInfo.map(item=>{
      return  {
        good_id: item.good_id,
        good_num: item.good_num,
        good_sku_id: item.good_sku_id
      }
    });
    let item = {
      access_token: list.access_token,
      address_id: shopdata.address_id,
      house_type_id: shopdata.house_id,
      goods:JSON.stringify(arr),
      remark:"备注"
    };
    app.xhr('POST', app.apiUrl.orderCreate, item, '', (res) => {
      if (res.data.code == 0) {
       that.cartInfo();
        wx.navigateTo({
          url: '../settlement/settlement',
        })
      }
    })
  }

})
