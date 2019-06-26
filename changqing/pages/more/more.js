// changqing/pages/more/more.js
//获取应用实例
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        signIn: false,
        department: '学院',
        name: '临时访客',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 从app.globalData获取
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true,
                // name: app.globalData.userInfo.nickName
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true,
                    //   name: app.globalData.userInfo.nickName
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true,
                        // name: app.globalData.userInfo.nickName
                    })
                }
            })
        }
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
        let that = this
        let signStatus = wx.getStorageSync('signIn')
        if (signStatus) {
            that.setData({
                signIn: true
            })
        }
        
        wx.getStorage({
            key: 'userInfo',
            success: function(res) {
                // console.log(res)

                that.setData({
                    name: res.data.studentName,
                    department: res.data.department
                })
            },
        })
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
    /**
     * 跳转到关于页面
     */
    redirectToAbout: function() {
        wx.navigateTo({
            url: '../about/about'
        })
    },
    /**
     * 跳转到更新日志页
     */
    redirectToLog: function() {
        wx.navigateTo({
            url: '../updateLog/updateLog'
        })
    },
    /**
     * 打开权限管理页面
     */
    openSetting: function() {
        wx.openSetting();
    },
    /**
     * 获取用户信息
     */
    getUserInfo: function(e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    logout: function() {
        wx.showModal({
            title: '确认',
            content: '是否真的退出？（即：清除缓存）',
            success(res) {
                if (res.confirm) {
                    wx.clearStorage();
                    wx.showToast({
                        title: '清除成功',
                        duration: 1000
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    }
})