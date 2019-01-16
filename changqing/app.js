//app.js
App({
    onLaunch: function() {
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                // env:'changqingkebiao',
                traceUser: true,
            })
        }
        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        })

        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
        // 检查登录态是否过期。
        // 自加内容
        wx.checkSession({
            success() {
                // session_key 未过期，并且在本生命周期一直有效
            },
            fail() {
                // session_key 已经失效，需要重新执行登录流程
                wx.login() // 重新登录
            }
        })

    },
    globalData: {
        userInfo: null,
        login_status: false,
        WEEKS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        startClassDay: new Date('2018-9-3'),
        // startClassDay: new Date('2019-2-25'),
    }
})