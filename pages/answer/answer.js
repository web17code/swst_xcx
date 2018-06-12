// pages/answer.js
const app = getApp()
var timer = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    answerTime: null,//目前耗费的秒数
    minute_s: "",//view中的分
    second_s: "",//view中的秒
    cfg: getApp().globalData.cfg,
    examId: null,//试卷ID
    pageNum: null,//当前的题号（也就是当前页码）
    NowData: {},//当前题目的数据
    total: null,//总体数
    nowChoose:"",//这道题用户选了哪一项
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.startTimer();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.pauseTimer();
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
    return {
      title: '生物合格考，邀请你一起模拟考',
      path: "/pages/list/list"
    }
  },
  //启动定时器，进行计时
  startTimer: function () {
    var that = this;
    if (timer == null) {
      timer = setInterval(function () {
        var answerTime = that.data.answerTime + 1;
        //格式化时间
        var second_s = parseInt(answerTime % 60);
        var minute_s = parseInt(answerTime / 60);
        if (second_s < 10) {
          second_s = "0" + second_s;
        }
        if (minute_s < 10) {
          minute_s = "0" + minute_s;
        }
        that.setData({
          answerTime: answerTime,
          second_s: second_s,
          minute_s: minute_s
        })
      }, 1000)
    } else {//如果没清空并设置timer为null
      that.pauseTimer();
      that.startTimer();
    }
  },
  //暂停定时器
  pauseTimer: function () {
    clearInterval(timer);
    console.log(timer);
    timer = null;
  },
  //重启定时器
  resetTimer: function () {
    var that = this;
    //清空时间
    that.startTimer();
    //启动定时器
  },
  //显示加载层
  showLoadingBlock: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask: true
    })
  },
  //隐藏加载层
  hideLoadingBlock: function () {
    wx.hideLoading();
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
  choose: function (e) {
    console.log(e)
    var that = this;
    var userAnswer = e.currentTarget.dataset.useranswer
    that.setData({
      nowChoose: userAnswer
    })
    wx.showLoading({
      title: '提交选项',
      mask: true
    })
    //5s后关闭反馈框
    setTimeout(function () { wx.hideLoading() }, 5000)
    //提交答案接口
    wx.request({
      url: app.globalData.cfg.cfg.http_ip + '/userQuestion/answer',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': getApp().globalData.Cookie
      },
      data: {
        examId: that.data.examId,
        userId: app.globalData.userID,
        userKey: app.globalData.userID,
        questionId: that.data.NowData.id,
        userAnswer: userAnswer,
        examTime: that.data.answerTime,
        pageNum: that.data.pageNum,
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.code == "0000") {
          wx.hideLoading();
          wx.showLoading({
            title: '加载题目',
          })
          setTimeout(function () { wx.hideLoading() }, 5000)
          console.log("timu.........data")
          if (parseInt(that.data.pageNum) != parseInt(that.data.total)) {
            that.data.pageNum = parseInt(that.data.pageNum) + 1;
            //获取题目
            that.getTimuData();
          } else {
            wx.hideLoading()
            //渲染选择的选项
            // var obj = that.data.NowData;
            // obj.userAnswer = userAnswer;
            // that.setData({
            //   NowData: obj
            // })
            wx.showToast({
              title: '已是最后一题哦',
              icon: 'none',
              mask: true
            })
          }
        }
      }
    })
  },
  //获取题目数据
  getTimuData: function () {
    var that = this;
    wx.request({
      url: app.globalData.cfg.cfg.http_ip + '/userQuestion/questions',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': getApp().globalData.Cookie
      },
      data: {
        examId: that.data.examId,
        pageSize: 1,
        pageNum: that.data.pageNum,
        userId: app.globalData.userID,
        userKey:app.globalData.userID
      },
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        if (res.data.code == "0000" && res.data.data.length == 1) {//结果没问题，更新一下试图
          // try {
          //   res.data.data[0].options = JSON.parse(res.data.data[0].options);
          // } catch (e) {
          //   res.data.data[0].options = [];
          //   //提示题目异常，请下一题
          //   wx.showToast({
          //     title: '题目解析异常',
          //     icon: 'none',
          //     mask: true
          //   })
          // }
          that.setData({
            NowData: res.data.data[0],
            total: res.data.total,
            pageNum: res.data.pageNum,
            nowChoose:""//清空用户之前的选项
          })
          //启动秒表
          that.data.answerTime = res.data.data[0].usedTime;
          that.startTimer();
        }
      }
    })
  },
  submitSJ_check: function () {
    var that = this;
    wx.showLoading({
      title: '提交试卷',
      mask: true
    })
    //5s后关闭反馈框
    setTimeout(function () { wx.hideLoading() }, 5000)
    wx.request({
      url: app.globalData.cfg.cfg.http_ip + '/userQuestion/undoNum',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': getApp().globalData.Cookie
      },
      data: {
        examId: that.data.examId,
        userId: app.globalData.userID,
        userKey: app.globalData.userID
      },
      success: function (res) {
        //5s后关闭反馈框
        wx.hideLoading()
        if (res.data.code == "0000") {
          var str = "";
          if (res.data.data == 0) {
            str = "已完成所有题，确认交卷？"
          } else {
            str = "还有" + res.data.data + "未答，确认交卷？"
          }
          wx.showModal({
            title: '提示',
            content: str,
            success: function (res){
              if (res.confirm) {
                that.submitSJ();
              }
            }
          })
        }
      }
    })
  },
  submitSJ:function(){
    var that =this;
    console.log("交卷")
    console.log("返回首页")
    wx.request({
      url: app.globalData.cfg.cfg.http_ip + '/userExam/complete',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': getApp().globalData.Cookie
      },
      data: {
        examId: that.data.examId,
        userId: app.globalData.userID,
        userKey: app.globalData.userID,
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.code="0000"){
          wx.navigateBack({})
        }
      }
    })
  }
})