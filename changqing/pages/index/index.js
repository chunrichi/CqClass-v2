// changqing/pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    schoolName: '长江大学',
    Week: 'Wednesday',
    week: new Date().getDay(), // 今天的周数
    theDay: new Date().toLocaleDateString(), //今日时间
    login_status: false, //登录状态
    // login_status: true, //登录状态
    todayClass: [{
        crouseName: '概率论与数理统计',
        roomName: '东12-A-121',
        crouseTime: 2
      },
      {
        crouseName: '高等数学',
        roomName: '东13-D-141',
        crouseTime: 3
      },
      {
        crouseName: '高等数学',
        roomName: '东13-D-141',
        crouseTime: 3
      },
      {
        crouseName: '高等数学',
        roomName: '东13-D-141',
        crouseTime: 3
      },
      {
        crouseName: '高等数学',
        roomName: '东13-D-141',
        crouseTime: 3
      }
    ], //今日课程
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