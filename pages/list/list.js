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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // //发送时间数据
    // console.log("发送链接")
    // wx.request({
    //   url: 'http://118.25.46.132:8080/gjwl_sys/sysadmin/userAction_Demo',
    //   method: "GET",
    //   success: function (res) {
    //     console.log(res)
    //     console.log("0.....0" + res)
    //   }
    // })
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
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        userId: getApp().globalData.userID,
        pageSize:10,
        pageNum:that.data.pageNum
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
  reDo:function(e){
    console.log("重做")
    // wx.navigateTo({
    //   url: '../analyze/analyze?shiJuanId=' + e.currentTarget.dataset.num + '&timuPageNum=' + e.currentTarget.dataset.pagenum
    // })
  },
  lookAnalyse:function(e){
    wx.navigateTo({
      url: '../analyze/analyze?shiJuanId=' + e.currentTarget.dataset.num + '&timuPageNum=' + e.currentTarget.dataset.pagenum
    })
  }


})