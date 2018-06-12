// pages/answer.js
const app = getApp()
var touchDot = 0;//触摸时的原点  
var time = 0;// 时间记录，用于滑动时且时间小于1s则执行左右滑动  
var interval = null;// 记录/清理时间记录
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cfg: getApp().globalData.cfg,
    NowData: {},//当前题目的数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.data.id = options.timuId;
    //请求题目数据
    if (getApp().globalData.userID == null) {//请求还没来
      getApp().timuCallBack = () => {
        this.getTimuData();
      }
    } else {
      this.getTimuData();
    }
  },
  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(this.data.NowData.id)
      return {
        title: '这道题不错呦，分享给你',
        path: "/pages/shareTimu/shareTimu?timuId=" + this.data.NowData.id
      }
    }
    return {
      title: '生物合格考，邀请你一起模拟考',
      path: "/pages/list/list"
    }
  },
  //获取题目数据
  getTimuData: function () {
    console.log(getApp().globalData.userID)
    var that = this;
    wx.request({
      url: app.globalData.cfg.cfg.http_ip + '/question/findById',
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': getApp().globalData.Cookie
      },
      data: {
        id: that.data.id
      },
      success: function (res) {
        wx.hideLoading()
        //that.data.isLoading = fasle;//取消正在加载状态
        console.log(res)
        if (res.data.code == "0000") {//结果没问题，更新一下试图
          console.log(res.data.data)
          that.setData({
            NowData: res.data.data
          })
        }
      }
    })
  },
  goList: function (e) {
    wx.redirectTo({
      url: '../list/list',
    })
  }
})