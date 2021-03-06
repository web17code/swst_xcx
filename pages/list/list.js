// pages/list/list.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowPopUp:false,//弹框是否显示
    pageNum:1,//当前页码
    cfg:getApp().globalData.cfg,
    nohaveData:false,//列表是否完成标志
    listData:[]//列表数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // if (getApp().globalData.userID==null){//请求还没来
    //   console.log("回调getlistData")
    //   getApp().listCallBack= ()=>{
    //     this.getListData();
    //   }
    // }else{
    //   this.getListData();
    // }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //////获取ID
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //清空列表
    this.data.listData = [];
    //重置页码
    this.data.pageNum = 1;
    //重置是否加载数据标志
    this.data.nohaveData = false;
    if (getApp().globalData.userID == null) {//请求还没来
      console.log("回调getlistData")
      getApp().listCallBack = () => {
        this.getListData();
      }
    } else {
      this.getListData();
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //再加载更多列表
    if (this.data.nohaveData){//没有更多数据，不再请求
      return false;
    }else{
      this.getListData();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '生物合格考，邀请你一起模拟考',
      path:"/pages/list/list"
    }
  },
  goWork:function(e){
    if(getApp().globalData.userID==null){
      getApp().getOid();
      wx.showToast({
        title: '重新登陆',
        icon:'loading'
      })
      return false;
    }
    console.log(e.currentTarget.dataset.num)
    console.log(e.currentTarget)
    if (e.currentTarget.dataset.examstatus==2){//交卷的调解析页面
     
    }else{
      wx.navigateTo({
        url: '../answer/answer?shiJuanId=' + e.currentTarget.dataset.num + '&timuPageNum=' + e.currentTarget.dataset.pagenum + '&examstatus=' + e.currentTarget.dataset.examstatus
      })
    }
    
  },
  showPopup:function(){
    this.setData({
      isShowPopUp: true
    })
  },
  hidePopup:function(){
    this.setData({
      isShowPopUp:false
    })
  },
  //获取列表数据
  getListData:function(){
    console.log(getApp().globalData)
    wx.showToast({
      title: '加载数据',
      icon: "loading",
      mask: true
    })
    //10s后关闭反馈框
    setTimeout(function () { wx.hideToast(); }, 10000)
    var that = this;
    wx.request({
      url: app.globalData.cfg.cfg.http_ip +'/exam/userExams',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': getApp().globalData.Cookie
      },
      data: {
        userId: getApp().globalData.userID,
        userKey: getApp().globalData.userID,
        pageSize:10,
        pageNum:that.data.pageNum,
        
      },
      success: (res) => {
        wx.hideToast();
        console.log(res)
        if (res.data.code == "0000") {//请求正确，设置userID
          if(res.data.data.length<10){//不在请求数据
            that.data.nohaveData = true;
          }else{
            that.data.pageNum = that.data.pageNum + 1;//页码加一为下一页做准备
          }
          var allData = that.data.listData.concat(res.data.data);
          console.log(allData)
          that.setData({
            listData: allData
          })
        }
      }
    })
  },
  lookAnalyse:function(e){
    wx.navigateTo({
      url: '../analyze/analyze?shiJuanId=' + e.currentTarget.dataset.num + '&timuPageNum=' + e.currentTarget.dataset.pagenum
    })
  },
  goreport:function(e){
    wx.navigateTo({
      url: '../chart/chart?shiJuanId=' + e.currentTarget.dataset.num + '&userId=' + getApp().globalData.userID
    })
  }

})