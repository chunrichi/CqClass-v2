// changqing/pages/message/message.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    signIn: true,
    // signIn:false,
    c: ['red', 'green', '#b6eb91', 'yellow', '#d0d0d0', '#f8f8f5'],
    wlist: [{
      kcmc: '计算机外部设备@东12-504c',
      courseName: '计算机外部设备',
      roomName: '东12-504c',
      isThisWeekHave: false,
      xqj: 2,
      skjc: 9,
      skcd: 2,
      courseTime: 4
    }, {
      kcmc: '移动开发技术@东13-A-105c',
      courseName: '移动开发技术',
      roomName: '东13-A-105c',
      isThisWeekHave: false,
      xqj: 2,
      skjc: 5,
      skcd: 2,
      courseTime: 2
    }, {
      kcmc: '移动开发技 术@东13-A-105c',
      courseName: '移动开发技术',
      roomName: '东13-A-105c',
      isThisWeekHave: false,
      xqj: 4,
      skjc: 9,
      skcd: 2,
      courseTime: 4
    }, {
      kcmc: '数值分析@东13-A-405c',
      courseName: '数值分析',
      roomName: '东13-A-405c',
      isThisWeekHave: false,
      xqj: 2,
      skjc: 1,
      skcd: 2,
      courseTime: 0
    }, {
      kcmc: '数值分析@东13-A-405c',
      courseName: '数值分析',
      roomName: '东13-A-405c',
      isThisWeekHave: false,
      xqj: 4,
      skjc: 3,
      skcd: 2,
      courseTime: 1
    }, {
      kcmc: '数据挖掘@东13-A-205c,东13-A-204c',
      courseName: '数据挖掘',
      roomName: '东13-A-205c,东13-A-204c',
      isThisWeekHave: false,
      xqj: 2,
      skjc: 5,
      skcd: 2,
      courseTime: 2
    }, {
      kcmc: '数据挖掘@东13-A-205c,东13-A-204c',
      courseName: '数据挖掘',
      roomName: '东13-A-205c,东13-A-204c',
      isThisWeekHave: false,
      xqj: 5,
      skjc: 3,
      skcd: 2,
      courseTime: 1
    }, {
      kcmc: '软件工程@东13-A-102c',
      courseName: '软件工程',
      roomName: '东13-A-102c',
      isThisWeekHave: false,
      xqj: 1,
      skjc: 3,
      skcd: 2,
      courseTime: 1
    }, {
      kcmc: '软件工程@东13-A-102c',
      courseName: '软件工程',
      roomName: '东13-A-102c',
      isThisWeekHave: false,
      xqj: 3,
      skjc: 7,
      skcd: 2,
      courseTime: 3
    }, {
      kcmc: '嵌入式系统设计与应用@东13-A-102c',
      courseName: '嵌入式系统设计与应用',
      roomName: '东13-A-102c',
      isThisWeekHave: false,
      xqj: 2,
      skjc: 3,
      skcd: 2,
      courseTime: 1
    }, {
      kcmc: '嵌入式系统设计与应用@东13-A-102c',
      courseName: '嵌入式系统设计与应用',
      roomName: '东13-A-102c',
      isThisWeekHave: false,
      xqj: 4,
      skjc: 1,
      skcd: 2,
      courseTime: 0
    }, {
      kcmc: '传感器与检测技术@东13-A-105c,东13-A-102c',
      courseName: '传感器与检测技术',
      roomName: '东13-A-105c,东13-A-102c',
      isThisWeekHave: false,
      xqj: 2,
      skjc: 7,
      skcd: 2,
      courseTime: 3
    }, {
      kcmc: '传感器与检测技术@东13-A-105c,东13-A-102c',
      courseName: '传感器与检测技术',
      roomName: '东13-A-105c,东13-A-102c',
      isThisWeekHave: false,
      xqj: 5,
      skjc: 5,
      skcd: 2,
      courseTime: 2
    }, {
      kcmc: '操作系统原理@东13-A-102c',
      courseName: '操作系统原理',
      roomName: '东13-A-102c',
      isThisWeekHave: false,
      xqj: 1,
      skjc: 1,
      skcd: 2,
      courseTime: 0
    }, {
      kcmc: '操作系统原理@东13-A-102c',
      courseName: '操作系统原理',
      roomName: '东13-A-102c',
      isThisWeekHave: false,
      xqj: 3,
      skjc: 1,
      skcd: 2,
      courseTime: 0
    }, {
      kcmc: 'Web开发技术@东13-A-305c',
      courseName: 'Web开发技术',
      roomName: '东13-A-305c',
      isThisWeekHave: false,
      xqj: 2,
      skjc: 7,
      skcd: 2,
      courseTime: 3
    }, {
      kcmc: 'Web开发技术@东13-A-305c',
      courseName: 'Web开发技术',
      roomName: '东13-A-305c',
      isThisWeekHave: false,
      xqj: 5,
      skjc: 5,
      skcd: 2,
      courseTime: 2
    }, {
      kcmc: 'Linux系统及管理@东13-A-102c',
      courseName: 'Linux系统及管理',
      roomName: '东13-A-102c',
      isThisWeekHave: false,
      xqj: 1,
      skjc: 5,
      skcd: 2,
      courseTime: 2
    }, {
      kcmc: 'Linux系统及管理@东13-A-102c',
      courseName: 'Linux系统及管理',
      roomName: '东13-A-102c',
      isThisWeekHave: false,
      xqj: 3,
      skjc: 5,
      skcd: 2,
      courseTime: 2
    }, {
      kcmc: '大学生就业指导@东12-502c',
      courseName: '大学生就业指导',
      roomName: '东12-502c',
      isThisWeekHave: false,
      xqj: 6,
      skjc: 1,
      skcd: 2,
      courseTime: 0
    }, {
      kcmc: '概率论与数理统计@东14-西-107',
      courseName: '概率论与数理统计',
      roomName: '东14-西-107',
      isThisWeekHave: false,
      xqj: 1,
      skjc: 5,
      skcd: 2,
      courseTime: 2
    }, {
      kcmc: '概率论与数理统计@东14-西-107',
      courseName: ' 概率论与数理统计',
      roomName: '东14-西-107',
      isThisWeekHave: false,
      xqj: 3,
      skjc: 5,
      skcd: 2,
      courseTime: 2
    }]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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

  }
})