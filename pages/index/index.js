//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    tabList:['推荐套餐','窗/防盗网','电视背景','乳胶漆','天花','门锁'],
    //左侧栏-当前选中值
    leftTabActived:0,
    servenImg:''
  },
  onLoad: function () {
    this.setData({
      servenImg: app.uploadImg.url,
    })
  },
  handleTab(index){
    this.setData({
      leftTabActived:index.currentTarget.dataset.index
    })
  }
})
