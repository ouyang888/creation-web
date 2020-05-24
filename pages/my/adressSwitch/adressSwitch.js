// pages/my/adressSwitch/adressSwitch.js
const app = getApp()
let storage = require("../../../utils/storage.js");
Page({
    data: {
        locationImg: "",
        province: "",
        city: "",
        district: "",
        customItem: [],
        detailed: '',
        token: "",
        multiIndex: [0, 0, 0],
        communityArr: [],
        multiArray: [[0],[0],[0]],

        //临时存放层
        tempRoomData: {}
    },
    //通过位置获取社区
    loactionCommunity: function () {
        let token = storage.get_s("token")
        const that = this
        wx.getLocation({
            type: 'wgs84',
            success(res) {
                if (res.errMsg == "getLocation:ok") {
                    let item = {
                        access_token: token.access_token,
                        latitude: res.latitude,
                        longitude: res.longitude
                    }
                    //获取当前位置
                    app.xhr('GET', app.apiUrl.location, item, '', (res) => {
                        if (res.data.code == 0) {
                            let dataList = res.data.data
                            that.setData({
                                access_token: token.access_token,
                                province: dataList.province,
                                city: dataList.city,
                                district: dataList.district
                            })
                            //通过位置获取社区
                            let items = {
                                access_token: token.access_token,
                                provice: dataList.province,
                                city: dataList.city,
                                district: dataList.district
                            }
                            app.xhr('GET', app.apiUrl.houseList, items, '', (res1) => {
                                if (res1.data.code == 0) {
                                    that.setData({
                                        communityArr: res1.data.data,
                                    })
                                }
                            })
                        }
                    })
                }
            }
        })
    },
    onLoad: function (options) {
        this.loactionCommunity();
        this.setData({
            locationImg: app.uploadImg.url,
        })
    },

    gotoLocation: function () {
        wx.navigateTo({
            url: '../adressLocation/adressLocation',
        })
    },

    // 确认--选择省市区
    bindRegionChange: function (e) {
        let that = this;
        let token = storage.get_s("token")

        let items = {
            access_token: token.access_token,
            provice: e.detail.value[0],
            city: e.detail.value[1],
            district: e.detail.value[2]
        }
        app.xhr('GET', app.apiUrl.houseList, items, '', (res1) => {
            console.log(res1);
            if (res1.data.code == 0) {
                that.setData({
                    communityArr: res1.data.data,
                })
            }
        })



        //为了让选择框有个默认值，
        this.setData({
            //拼的字符串传后台
            detailed: e.detail.value[0] + " " + e.detail.value[1] + " " + e.detail.value[2],
            //下拉框选中的值
            region: e.detail.value,
            province: e.detail.value[0],
            city: e.detail.value[1],
            district: e.detail.value[2]
        })
    },

    // 确定选好的楼层
    bindMultiPickerChange: function (e) {
        this.setData({
            multiIndex: e.detail.value,
        })

    },


    // 点击选择楼层
    roomHandle: function (id) {
        let that = this;
        that.setData({
            multiIndex: [0, 0, 0]
        });
        let tower = [];
        let masterArr = [];
        let roomId = id.currentTarget.dataset.id;
        that.data.communityArr.forEach(item => {
            if (item.id === roomId) {
                item.rooms.forEach(item => {
                    tower.push(item.tower)
                });
                masterArr[1] = item.rooms[0].floor;
                masterArr[2] = item.rooms[0].house;
                that.setData({
                    tempRoomData: item
                })
            }
        });
        masterArr[0] = tower;
        that.setData({
            multiArray: JSON.parse(JSON.stringify(masterArr))
        });
    },


    // 滑动选择楼
    bindMultiPickerColumnChange: function (e) {
        let that = this;
        let multiArr = this.data.multiArray
        if (e.detail.column === 0 && JSON.stringify(this.data.tempRoomData) !== '{}') {
            let val = e.detail.value + 1;
            this.data.tempRoomData.rooms.forEach(item => {
                if (item.tower === val) {
                    multiArr[1] = item.floor;
                    multiArr[2] = item.house;
                    that.setData({
                        multiIndex: [val - 1, 0, 0]
                    })
                }
            });
            that.setData({
                multiArray: multiArr
            })
        }
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
