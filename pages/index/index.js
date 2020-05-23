const app = getApp()
let storage = require("../../utils/storage.js")
Page({
  data: {
    showUser: null,
    tabList: ['推荐套餐', '窗/防盗网', '电视背景', '乳胶漆', '天花', '门锁'],
    //推荐套餐
    productList: [{
        id: "2020",
        projectName: "百变房套餐项目",
        product: [{
            id: "01",
            productName: "百变房铝合金窗",
            productSizeName: "凤铝1.4厚铝合金窗",
            productType: [{
                id: "123",
                name: "加厚型"
              },
              {
                id: "456",
                name: "铝合金"
              }
            ],
            productMoney: "2100"
          },
          {
            id: "02",
            productName: "百变房铝合金窗2",
            productSizeName: "凤铝1.4厚铝合金窗",
            productType: [{
                id: "789",
                name: "加厚型"
              },
              {
                id: "987",
                name: "铝合金"
              }
            ],
            productMoney: "2100"
          }
        ]
      },
      {
        id: "2021",
        projectName: "百变房套餐项目2",
        product: [{
            id: "01",
            productName: "百变房铝合金窗",
            productSizeName: "凤铝1.4厚铝合金窗",
            productType: [{
                id: "123",
                name: "加厚型"
              },
              {
                id: "456",
                name: "铝合金"
              }
            ],
            productMoney: "2100"
          },
          {
            id: "02",
            productName: "百变房铝合金窗2",
            productSizeName: "凤铝1.4厚铝合金窗",
            productType: [{
                id: "789",
                name: "加厚型"
              },
              {
                id: "987",
                name: "铝合金"
              }
            ],
            productMoney: "2100"
          }
        ]
      },
    ],
    leftTabActived: 0, //左侧栏-当前选中值
    servenImg: '',
    isShowProjectList: true //判断项目显示\隐藏
  },
  onLoad: function() {
    this.setData({
      showUser: storage.get_s("userInfo")
    });
    if (this.data.showUser == '' || this.data.showUser == null || this.data.showUser == undefined) {
      wx.navigateTo({
        url: '../../pages/login/login',
      })
    }
    this.setData({
      servenImg: app.uploadImg.url,
    })
    // this.shopList();

  },

  //跳转商品详情页
  gotoDetails: function() {
    wx.navigateTo({
      url: '../productDetail/productDetail',
    })
  },

  shopList: function() {
    app.xhr('GET', app.apiUrl.shopList, '', '', (res) => {
      console.log("222333", res)
    })
  },
  // 左侧栏-点击获取当前选中的值
  handleTab(index) {
    this.setData({
      leftTabActived: index.currentTarget.dataset.index
    })
  },

  //右侧栏-点击标题-收缩效果
  handleTitle(data) {
    let index = data.currentTarget.dataset.index;
  }
})