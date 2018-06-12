import * as echarts from '../ec-canvas/echarts';

const app = getApp();
var name = null;
var score = null;
function setOption(chart) {
  const option = {
    title: { text: null }, // 隐藏图表标题
    legend: { enabled: false }, // 隐藏图例
    backgroundColor: "#ffffff",
    color: ["#37A2DA", "#FF9F7F"],//
    tooltip: {},
    xAxis: {
      show: false
    },
    yAxis: {
      show: false
    },
    radar: {
      radius: '55%',
      name: {
        formatter: function (params) {
          var newParamsName = "";// 最终拼接成的字符串
          var paramsNameNumber = params.length;// 实际标签的个数
          var provideNumber = 5;// 每行能显示的字的个数
          var rowNumber = Math.ceil(paramsNameNumber / provideNumber);// 换行的话，需要显示几行，向上取整
          /**
           * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
           */
          // 条件等同于rowNumber>1
          if (paramsNameNumber > provideNumber) {
            /** 循环每一行,p表示行 */
            for (var p = 0; p < rowNumber; p++) {
              var tempStr = "";// 表示每一次截取的字符串
              var start = p * provideNumber;// 开始截取的位置
              var end = start + provideNumber;// 结束截取的位置
              // 此处特殊处理最后一行的索引值
              if (p == rowNumber - 1) {
                // 最后一次不换行
                tempStr = params.substring(start, paramsNameNumber);
              } else {
                // 每一次拼接字符串并换行
                tempStr = params.substring(start, end) + "\n";
              }
              newParamsName += tempStr;// 最终拼成的字符串
            }

          } else {
            // 将旧标签的值赋给新标签
            newParamsName = params;
          }
          //将最终的字符串返回
          return newParamsName
        }
      },
      axisLabel: {
        inside: true,

      },
      shape: 'polygon',
      indicator: name,
      splitArea: {
        show: true,
        areaStyle: {
          color: ["#efefef", "#FFFFFF"]  // 图表背景网格的颜色
        }
      }
    },
    series: [{
      name: '生物试卷',
      type: 'radar',
      data: [{
        value: score//[430, 340, 500, 300, 490, 400], //
      }
      ]
    }]
  };
  chart.setOption(option);
}

Page({
  onLoad: function (option) {
    var that = this;
    this.data.examId = option.shiJuanId;
    this.data.userId = option.userId;
    wx.request({
      url: app.globalData.cfg.cfg.http_ip + '/userQuestion/score/spiderMap',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': getApp().globalData.Cookie
      },
      data: {
        userId: getApp().globalData.userID,
        userKey: getApp().globalData.userID,
        examId: option.shiJuanId
      },
      success: function (res) {
        name = res.data.data.name;
        score = res.data.data.score;
        for (var i = 0; i < name.length; i++) {
          name[i] = { name: name[i], max: 10 }
        }
        that.ecComponent = that.selectComponent('#mychart-dom-bar');
        that.init();
      }
    })
  },
  data: {
    ec: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true,
    },
    examId: null,
    userId: null
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
  // 点击按钮后初始化图表
  init: function () {
    this.ecComponent.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOption(chart);

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;

      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },

  dispose: function () {
    if (this.chart) {
      this.chart.dispose();
    }
  },
  reDo: function (e) {
    var that= this;
    wx.showModal({
      title: '提示',
      content: '您确定要重新测试？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.cfg.cfg.http_ip + '/userExam/redo',
            method: "POST",
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Cookie': getApp().globalData.Cookie
            },
            data: {
              userId: getApp().globalData.userID,
              userKey: getApp().globalData.userID,
              examId: that.data.examId
            },
            success: (res) => {
              console.log(res)
              console.log(res.data)
              if (res.data.code == "0000") {
                wx.redirectTo({
                  url: '../answer/answer?shiJuanId=' + that.data.examId + '&timuPageNum=1'
                })
              }
            }
          })
        }
      }
    })
  }
});

