//app.js
var cfg = require('./utils/cfg.js');
App({
  onLaunch: function () {
    // 登录
    wx.showToast({
      title: '登录中',
      icon: "loading",
      mask: true
    })
    //10s后关闭反馈框
    setTimeout(function () { wx.hideToast(); }, 10000)
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: cfg.cfg.http_ip + '/user/getUserInfo', //仅为示例，并非真实的接口地址
          method: "POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值application/json+application/x-www-form-urlencoded
          },
          data: {
            code: res.code
          },
          success: (res) => {
            wx.hideToast();
            if (res.data.code == "0000"){//请求正确，设置userID
              this.globalData.userID = res.data.data.oid;
              console.log("appJS")
              console.log(this.globalData)
              if (this.listCallBack){
                
                this.listCallBack();
              }
            }
          }
        })
      }
    })
  },
  getOid: function () {
    if (this.globalData.userID == null) {
      wx.showToast({
        title: '登录中',
        icon: "loading",
        mask: true
      })
      //10s后关闭反馈框
      setTimeout(function () { wx.hideToast(); }, 10000)
      wx.login({
        success: (res) => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.request({
            url: cfg.cfg.http_ip + '/user/getUserInfo', //仅为示例，并非真实的接口地址
            method: "POST",
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值application/json+application/x-www-form-urlencoded
            },
            data: {
              code: res.code
            },
            success: (res) => {
              this.globalData.userID = res.data.data.oid;
              if (this.globalData.userID != null) {
                wx.hideLoading();
              }
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    cfg: cfg,
    userID: null
  }
})