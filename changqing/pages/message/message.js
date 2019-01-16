// changqing/pages/message/message.js
var app = getApp()

Page({
    /**
     * 页面的初始数据
     */
    data: {
        // signIn: true,
        signIn: false,
        pwdFocus: false,
        uidFocus: false,
        colorArrays: ["#85B8CF", "#90C652", "#D8AA5A", "#FC9F9D", "#0A9A84", "#61BC69", "#12AEF3", "#E29AAD", '#85C69D'],
        // classList: [{
        //     courseName: ' 概率论与数理统计', //课程名
        //     roomName: '东14-西-107',        //教室
        //     isThisWeekHave: false,          //本周是否有课
        //     weekDay: 3,                     //星期几
        //     skcd: 2,                        //课程时长-->直接写到到wxml中了
        //     courseTime: 2                   //上课时间
        // }],
        classList: [],
        classLength: 2,
        pwd_icon: false, // 密码图标
        passwordStatus: true, // 是否隐藏密码
        semester_id: '49'
    },



    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        var uid = wx.getStorageSync('uid')
        var pwd = wx.getStorageSync('pwd')
        if (pwd != "" || wx.getStorageSync('signIn')) {
            app.globalData.uid = uid;
            app.globalData.pwd = pwd;
            that.setData({
                signIn: true
            })
        }

        // 开学日期
        let startDate = app.globalData.startClassDay
        // let startDate = new Date('2019-2-25')
        // 当前日期是本年的第天
        let differenceDate = Math.ceil((new Date() - startDate) / (24 * 60 * 60 * 1000))

        // 第几周
        let classTime = Math.ceil(differenceDate / 7)
        console.log('classTime', classTime)

        var getClassList = wx.getStorage({
            key: 'classInfos',
            success(res) {
                let gotClassList = res.data
                if (gotClassList.length != 0) {
                    let newClassList = []
                    for (let course of gotClassList) {
                        course.isThisWeekHave = (course.vaildWeeks[classTime] == 1) ? true : false
                        newClassList.push(course)
                    }
                    that.setData({
                        classList: newClassList
                    })
                } else {
                    that.setData({
                        classList: [{
                                'courseName': '本',
                                'isThisWeekHave': false,
                                'weekDay': 1,
                                'courseTime': 2,
                            },
                            {
                                'courseName': '学',
                                'isThisWeekHave': false,
                                'weekDay': 2,
                                'courseTime': 2,
                            },
                            {
                                'courseName': '期',
                                'isThisWeekHave': false,
                                'weekDay': 3,
                                'courseTime': 2,
                            },
                            {
                                'courseName': '无',
                                'isThisWeekHave': false,
                                'weekDay': 4,
                                'courseTime': 2,
                            },
                            {
                                'courseName': '课',
                                'isThisWeekHave': false,
                                'weekDay': 5,
                                'courseTime': 2,
                            },
                        ],
                        classLength: 1
                    })
                }
            }
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
        if (!wx.getStorageSync('signIn')) {
            this.setData({
                signIn: false
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
    /**
     * 登录事件
     */
    loginClassTable: function(e) {
        if (e.detail.value.uid.length < 9) {
            wx.showToast({
                title: '学号长度为9位数',
                icon: 'none'
            })
        } else if (e.detail.value.pwd.length == 0) {
            wx.showToast({
                title: '密码不能为空',
                image: '/images/warning.png',
                duration: 1000
            });
        } else {
            wx.showLoading({
                title: '加载中',
            })
            // 调用 云开发的 函数
            let getMessage = {}
            wx.cloud.callFunction({
                // 云函数名称
                name: 'signIn',
                // 传给云函数的参数
                data: {
                    uid: e.detail.value.uid,
                    pwd: e.detail.value.pwd,
                    term: '49'
                }
            }).then(res => {
                wx.hideLoading()
                // console.log(res) // 3
                getMessage = res.result
                console.log(getMessage)
                console.log(getMessage.messageStatus)
                console.log(getMessage.errorMessage)
                if (getMessage.messageStatus) {
                    // 获得成功
                    this.setData({
                        signIn: true,
                         classList: getMessage.returnClassMessage.classArray
                    })
                    // 登录状态
                    wx.setStorage({
                        key: 'signIn',
                        data: true
                    })
                    // 用户信息
                    wx.setStorage({
                        key: 'userInfo',
                        data: getMessage.returnUserMessage
                    })
                    // 当周课表信息
                    wx.setStorage({
                        key: 'classInfos',
                        data: getMessage.returnClassMessage.classArray
                    })
                    // 每日课表汇总
                    wx.setStorage({
                        key: 'classDayInfos',
                        data: getMessage.returnClassMessage.classWeekDay
                    })
                    // 账户，密码
                    wx.setStorage({
                        key: 'pwd',
                        data: e.detail.value.pwd
                    })
                    wx.setStorage({
                        key: 'uid',
                        data: e.detail.value.uid
                    })
                    // 最近一次课表时间
                    wx.setStorage({
                        key: 'lastDay',
                        data: new Date()
                    })

                } else {
                    // console.log('??? 嘛呀？', getMessage.messageStatus)
                    // 获得失败
                    wx.showToast({
                        title: getMessage.errorMessage,
                        icon: 'none',
                        duration: 2000
                    })
                }
            })

        }
    },
    /**
     * 输入到一定内容后取消键盘显示
     */
    uidInput: function(e) {
        const value = e.detail.value
        // console.log(this)
        if (value.length == 9) {
            wx.hideKeyboard();
            this.setData({
                pwdFocus: true
            })
        }
    },
    /**
     * 改变密码状态
     */
    changePasswordStatus: function(e) {

        if (this.data.pwd_icon) {
            this.setData({
                pwd_icon: false,
                passwordStatus: true
            })
        } else {
            this.setData({
                pwd_icon: true,
                passwordStatus: false
            })
        }
    },
    toOtherClass: function() {
        var that = this;
        var itemValue = ['50', '49', '48'];
        wx.showActionSheet({
            itemList: ['课表： 2019-上半年', '课表： 2018-下半年', '课表： 2018-上半年'],
            success: function(res) {
                // console.log(that.data);
                // console.log(res.tapIndex)
                if (that.data.semester_id != res.tapIndex) {
                    that.setData({
                        semester_id: itemValue[res.tapIndex],
                    });
                    // console.log(itemValue[res.tapIndex])
                    wx.showLoading({
                        title: '加载中',
                    })
                    let getMessage = {}
                    wx.cloud.callFunction({
                        name: 'getClassTable',
                        data: {
                            uid: app.globalData.uid,
                            pwd: app.globalData.pwd,
                            term: that.data.semester_id
                        }
                    }).then(res => {
                        wx.hideToast();
                        // console.log(res) // 3
                        getMessage = res.result
                        console.log(getMessage)
                        console.log(getMessage.returnStatus)
                        console.log(getMessage.errorMessage)

                        if (getMessage.returnStatus) {
                            wx.hideLoading()
                            // 当周课表信息
                            wx.setStorage({
                                key: 'classInfos',
                                data: getMessage.classArray
                            })
                            // 每日课表汇总
                            wx.setStorage({
                                key: 'classDayInfos',
                                data: getMessage.classWeekDay
                            })
                            // 最近一次课表时间
                            wx.setStorage({
                                key: 'lastDay',
                                data: new Date()
                            });
                            that.setData({
                                classList: getMessage.classArray
                            })
                        } else {
                            // console.log('??? 嘛呀？', getMessage.returnStatus)
                            // 获得失败
                            wx.showToast({
                                title: getMessage.errorMessage,
                                icon: 'none',
                                duration: 2000
                            })

                        }
                    })

                }
            },
            fail: function(res) {
                console.log(res.errMsg)
            }
        })
    }
})