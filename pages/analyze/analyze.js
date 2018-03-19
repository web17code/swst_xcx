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
    examId: null,//试卷ID
    pageNum: null,//当前的题号（也就是当前页码）
    NowData: {},//当前题目的数据
    total: null,//总体数
   // isLoading:false//正在加载
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.data.examId = options.shiJuanId;
    this.data.pageNum = options.timuPageNum;
    //请求题目数据
    this.getTimuData();
  },
  next: function () {
    var that = this;
    if (parseInt(that.data.pageNum) != parseInt(that.data.total)) {
      that.data.pageNum = that.data.pageNum + 1;
      this.getTimuData();
    } else {
      wx.showToast({
        title: '已是最后一题哦',
        icon: 'none',
        mask: true
      })
    }
  },
  prev: function () {
    var that = this;
    if (parseInt(that.data.pageNum) != 1) {
      that.data.pageNum = that.data.pageNum - 1;
      this.getTimuData();
    } else {
      wx.showToast({
        title: '没有上一题哦',
        icon: 'none',
        mask: true
      })
    }
  },
  //获取题目数据
  getTimuData: function () {
    var that = this;
    wx.request({
      url: app.globalData.cfg.cfg.http_ip + '/userQuestion/analyse',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        examId: that.data.examId,
        pageSize: 1,
        pageNum: that.data.pageNum,
        userId: app.globalData.userID,
      },
      success: function (res) {
        wx.hideLoading()
        //that.data.isLoading = fasle;//取消正在加载状态
        console.log(res)
        if (res.data.code == "0000" && res.data.data.length == 1) {//结果没问题，更新一下试图
          try {
            res.data.data[0].options = JSON.parse(res.data.data[0].options);
          } catch (e) {
            res.data.data[0].options = [];
            //提示题目异常，请下一题
            wx.showToast({
              title: '题目解析异常',
              icon: 'none'
            })
          }
          that.setData({
            NowData: res.data.data[0],
            total: res.data.total,
            pageNum: res.data.pageNum
          })
        }
      }
    })
  },
  // 触摸开始事件  
  touchStart: function (e) {
    if (interval!=null){
      return false;
    }
    time = 0;
    touchDot = e.touches[0].pageX; // 获取触摸时的原点  
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      time++;
    }, 100);
    console.log(time,interval)
  },
  // 触摸结束事件  
  touchEnd: function (e) {
    var touchMove = e.changedTouches[0].pageX;
    console.log("touchMove:" + touchMove + " touchDot:" + touchDot + " diff:" + (touchMove - touchDot));
    // 向左滑动    
    if (touchMove - touchDot <= -40 && time < 10) {
      this.next();
    }
    // 向右滑动  
    if (touchMove - touchDot >= 40 && time < 10) {
      this.prev();
    }
    clearInterval(interval); // 清除setInterval  
    interval = null;
    time = 0;
  }
})