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
    console.log("----微信登录")
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log("---login、开始请求")

        'https://api.weixin.qq.com/sns/jscode2session?appid=wx4eb2f0dea3e93ece&secret=a7efd1afb584c5a201af3e7aadc397b8&js_code=' + res.code + '&grant_type=authorization_code'

        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx4eb2f0dea3e93ece&secret=a7efd1afb584c5a201af3e7aadc397b8&js_code=' + res.code + '&grant_type=authorization_code',
          method: "get",
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值application/json+application/x-www-form-urlencoded
          },
          // data: {
          //   code: res.code,
          //   version: 2
          // },
          success: (res) => {
            console.log('openID接口')
            console.log(res)
          }
        })


        wx.request({
          url: cfg.cfg.http_ip + '/user/getUserInfo', 
          method: "POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值application/json+application/x-www-form-urlencoded
          },
          data: {
            code: res.code,
            version:2
          },
          success: (res) => {
            console.log("---login、调用接口完成")
            wx.hideToast();
            if (res.data.code == "0000"){//请求正确，设置userID
              this.globalData.Cookie = 'JSESSIONID='+res.data.data.session_key;
              this.globalData.userID = res.data.data.user.oid;
              if (this.listCallBack){
                this.listCallBack();
              }
              if (this.timuCallBack) {
                this.timuCallBack();
              }
            }
          }
        })
      }
    })
  },
  getOid: function () {
    //if (this.globalData.userID == null) {
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
            url: cfg.cfg.http_ip + '/user/getUserInfo',
            method: "POST",
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值application/json+application/x-www-form-urlencoded
            },
            data: {
              code: res.code,
              version: 2
            },
            success: (res) => {
              this.globalData.userID = res.data.data.oid;
              this.globalData.Cookie = 'JSESSIONID=' + res.data.data.user.session_key;
              if (this.globalData.userID != null) {
                wx.hideLoading();
              }
            }
          })
        }
      })
    //}
  },
  globalData: {
    userInfo: null,
    cfg: cfg,
    userID: null,
    Cookie:null
  },
  //获取JSESSIONID,
})