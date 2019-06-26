// changqing/pages/index/index.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        schoolName: '长江大学',
        Week: '',
        login_status: false, //登录状态
        // login_status: true, //登录状态
        todayClass: [], //今日课程
        noClassToday: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            Week: app.globalData.WEEKS[new Date().getDay()],
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
        let tc = wx.getStorageSync('classDayInfos')
        let that = this
        let signIn_status = wx.getStorageSync('signIn')
        let todayIs = app.globalData.WEEKS[new Date().getDay()]
        // 判断是否登录
        if (signIn_status) {
            that.setData({
                login_status: true
            })
            console.log(tc[todayIs])
            // 判断是否课表为空
            if (tc[todayIs].length == 0) {
                that.setData({
                    noClassToday: true
                })
            }else{
                that.setData({
                    todayClass: tc[todayIs]
                })
            }
        }else{
            that.setData({
                login_status: false,
                todayClass:[]
            })
        }
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

    },
    moveToClass:function(){
        wx.switchTab({
            url: '../message/message'
        })
    }
})