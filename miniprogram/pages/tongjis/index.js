var app = getApp()
var service = require('../../utils/util.js')
var wxCharts = require("../../utils/wxcharts.js");
var lineChart = null;
var columnCanvas = null;
var columnCanvas1 = null;
var startPos = null;
//定义记录初始屏幕宽度比例，便于初始化
var windowW = 0;
var pathUrl = app.globalData.pathUrl;
Page({
  data: {
    one: false,
    data: "",
    info: "",
    ss: false,
    date: '',
    date7: '',
    shuju: [],
    shuju1: [],
    shuju2: [],
    shuju3: []
  },
  sousuo: function () {

    var that = this;
    var data1 = that.data.date;
    var data7 = that.data.date7;
    var url = pathUrl + '/wxtongjis';
    service.http(url, { 'nowdata': data1, 'nowdata7': data7 }, function (data) {
      var data = data.data;
      console.log(data)
      if (data.err_code == '000') {
        if (data.data != false) {
          console.log('data非空')
          console.log(data.nowdata)
          var nowdata = data.nowdata;
          var nowdata7 = data.data7;
          var nowdatas7 = data.datariqi;
          var nowdateriqi = data.nowdateriqi
          console.log(nowdata7)
          that.setData({
            shuju: nowdata,//第一条数据
            shuju1: nowdata7,//第二条数据
            shuju2: nowdatas7,//第三条日期
            shuju3: nowdateriqi//第三条数据
          })
          console.log(that.data.shuju)
        }


        setTimeout(function () {
          var windowWidth = 320;
          try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
          } catch (e) {
            console.error('getSystemInfoSync failed!');
          }
          var simulationData1 = that.createSimulationDatas2();
          columnCanvas = new wxCharts({//搜索 展示第二图
            canvasId: 'columnCanvas',
            type: 'line',
            categories: simulationData1.categories,
            animation: true,
            // background: '#f5f5f5',
            series: [{
              name: '24条',
              data: simulationData1.data,
              format: function (val, name) {
                return val;
              }
            }],
            xAxis: {
              disableGrid: true
            },
            yAxis: {
              title: '对应24条总分值',
              format: function (val) {
                return val;
              },
              min: 0,
              max: 10
            },
            width: windowWidth,
            height: 200,
            dataLabel: true,
            dataPointShape: true,
            extra: {
              lineStyle: 'solide'
            }
          });
console.log('第二个图加载完成')
          var simulationData2 = that.createSimulationDatas3();

          columnCanvas1 = new wxCharts({//搜索第三个图
            canvasId: 'columnCanvas1',
            type: 'line',
            categories: simulationData2.categories,
            animation: true,
            // background: '#f5f5f5',
            series: [{
              name: '日期',
              data: simulationData2.data,
              format: function (val, name) {
                return val;
              }
            }],
            xAxis: {
              disableGrid: true
            },
            yAxis: {
              title: '对应日期总分数',
              format: function (val) {
                return val;
              },
              min: 0,
              max: 10
            },
            width: windowWidth,
            height: 200,
            dataLabel: true,
            dataPointShape: true,
            extra: {
              lineStyle: 'solide'
            }
          });
        }, 2000)


      } else {
        wx.showToast({ title: data.err_msg });
      }
    }, function (data) {
      wx.showToast({ title: '网络故障' });
      console.log(data);
    })
  },
  createSimulationDatas2: function () {//搜索第二图
    var that = this;
    var shuju1 = that.data.shuju1;
    var datas = that.data.shuju2
    console.log(datas);
    var categories = [];
    var data = [];
    data = shuju1;
    for (var i = 0; i < 24; i++) {
      categories.push(i + 1);
      //data.push(shuju[i]);
    }
    // data[4] = null;
    return {
      categories: categories,
      data: data
    }
  },
  createSimulationDatas3: function () {//搜索第三图
    console.log('第三个图')
    var that = this;
    var shuju1 = that.data.shuju1;
    var datas = that.data.shuju2
    console.log(datas);
    var categories = [];
    var data = [];
    data = shuju1;
    for (var i = 0; i < 24; i++) {
      categories.push(i + 1);
      //data.push(shuju[i]);
    }
    // data[4] = null;
    return {
      categories: categories,
      data: data
    }
  },
  createSimulationData: function () {
    var that = this;
    var shuju = that.data.shuju;
    console.log(shuju)
    var categories = [];
    var data = [];
    data = shuju;
    for (var i = 0; i < 24; i++) {
      categories.push(i + 1);
      //data.push(shuju[i]);
    }
    // data[4] = null;
    return {
      categories: categories,
      data: data
    }
  },
  createSimulationData1: function () {
    var that = this;
    var shuju1 = that.data.shuju1;
    var datas = that.data.shuju2
    console.log(datas);
    var categories = [];
    var data = [];
    data = shuju1;
    for (var i = 0; i < 24; i++) {
      categories.push(i + 1);
      //data.push(shuju[i]);
    }
    // data[4] = null;
    return {
      categories: categories,
      data: data
    }
  },
  createSimulationData2: function () {
    console.log('第三个图')
    var that = this;
    // shuju2: nowdatas7,//第三个数据
    //   shuju3: nowdateriqi//第三个日期
    var shuju3 = that.data.shuju3;
    var datas = that.data.shuju2;
    console.log(datas);
    var categories = [];
    var data = [];
    categories = shuju3
    data = datas;
    // for (var i = 0; i < 24; i++) {
    //   categories.push(i + 1);
    //   //data.push(shuju[i]);
    // }
    // data[4] = null;
    return {
      categories: categories,
      data: data
    }
  },
  onShow: function () {
    console.log('onshowss')
    var that = this;
    var date7 = that.getBeforeDate(7)
    console.log(date7)
    that.setData({
      date7: date7
    })
    that.nowdate(that);
    var data1 = that.data.date;
    var data7 = that.data.date7;
    var url = pathUrl + '/wxtongji';
    service.http(url, { 'nowdata': data1, 'nowdata7': data7 }, function (data) {
      var data = data.data;
      console.log(data)
      if (data.err_code == '000') {
        if (data.data != false) {
          console.log('data非空')
          console.log(data.nowdata)
          var nowdata = data.nowdata;
          var nowdata7 = data.data7;
          var nowdatas7 = data.datariqi;
          var nowdateriqi = data.nowdateriqi
          console.log(nowdata7)
          that.setData({
            shuju: nowdata,//第一个数据
            shuju1: nowdata7,//第二个数据
            shuju2: nowdatas7,//第三个数据
            shuju3: nowdateriqi//第三个日期
          })
          console.log(that.data.shuju)
        }
//===
        var windowWidth = 320;
        try {
          var res = wx.getSystemInfoSync();
          windowWidth = res.windowWidth;
        } catch (e) {
          console.error('getSystemInfoSync failed!');
        }

        var simulationData = that.createSimulationData();
        lineChart = new wxCharts({//第一个图
          canvasId: 'lineCanvas',
          type: 'line',
          categories: simulationData.categories,
          animation: true,
          // background: '#f5f5f5',
          series: [{
            name: '24条',
            data: simulationData.data,
            format: function (val, name) {
              return val;
            }
          }],
          xAxis: {
            disableGrid: true
          },
          yAxis: {
            title: '对应分值',
            format: function (val) {
              return val;
            },
            min: 0,
            max: 10
          },
          width: windowWidth,
          height: 200,
          dataLabel: true,
          dataPointShape: true,
          extra: {
            lineStyle: 'solide'
          }
        });
        var simulationData1 = that.createSimulationData1();
        columnCanvas = new wxCharts({//第二个图
          canvasId: 'columnCanvas',
          type: 'line',
          categories: simulationData1.categories,
          animation: true,
          // background: '#f5f5f5',
          series: [{
            name: '24条',
            data: simulationData1.data,
            format: function (val, name) {
              return val;
            }
          }],
          xAxis: {
            disableGrid: true
          },
          yAxis: {
            title: '对应分值',
            format: function (val) {
              return val;
            },
            min: 0,
            max: 10
          },
          width: windowWidth,
          height: 200,
          dataLabel: true,
          dataPointShape: true,
          extra: {
            lineStyle: 'solide'
          }
        });
        var simulationData2 = that.createSimulationData2();
        columnCanvas = new wxCharts({//第3个图
          canvasId: 'columnCanvas1',
          type: 'line',
          categories: simulationData2.categories,
          animation: true,
          // background: '#f5f5f5',
          series: [{
            name: '日期',
            data: simulationData2.data,
            format: function (val, name) {
              return val;
            }
          }],
          xAxis: {
            disableGrid: true
          },
          yAxis: {
            title: '对应日期总分值',
            format: function (val) {
              return val;
            },
            min: 0,
            max: 10
          },
          width: windowWidth,
          height: 200,
          dataLabel: true,
          dataPointShape: true,
          extra: {
            lineStyle: 'solide'
          }
        });
//==
      } else {
        wx.showToast({ title: data.err_msg });
      }
    }, function (data) {
      wx.showToast({ title: '网络故障' });
      console.log(data);
    })


   







  }, bindDateChange7: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date7: e.detail.value
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
    // var id = 1;
    // var nowdata = e.detail.value;
    // wx.request({
    //   url: 'https://www.easy-mock.com/mock/5be42c3b6d38dd2824b552e6/id/',
    //   method: 'post',
    //   data: {
    //     id: id,
    //     nowdata: nowdata,
    //   }, success: function (result) {
    //    console.log(result)
    //   }
    // })
  },
  getBeforeDate: function (n) {
    var n = n;
    var s = '';
    var d = new Date();
    var year = d.getFullYear();
    var mon = d.getMonth() + 1;
    var day = d.getDate();
    if (day <= n) {
      if (mon > 1) {
        mon = mon - 1;

      } else {
        year = year - 1;
        mon = 12;

      }

    }
    d.setDate(d.getDate() - n);
    year = d.getFullYear();
    mon = d.getMonth() + 1;
    day = d.getDate();
    s = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
    return s;
  },
  nowdate: function (that) {
    var that = that
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    var nowDate = year + "-" + month + "-" + day;
    console.log(nowDate)
    this.setData({
      date: nowDate
    })
  },
  onLoad: function (options) {
    console.log('load')
    // var that = this

    // var id = 1;
    // var userid = 1;




    // var url = pathUrl + '/wxtongji';

    // service.http(url, { 'id': id, 'userid': userid }, function (data) {

    //   var data = data.data;
    //   console.log(data)
    //   if (data.err_code == '000') {
    //     if (data.data != false) {
    //       console.log('data非空')
    //       console.log(data.nowdata)
    //       var nowdata = data.nowdata;
    //       that.setData({
    //         shuju: nowdata
    //       })
    //       console.log(that.data.shuju)
    //     }


    //   } else {
    //     wx.showToast({ title: data.err_msg });
    //   }
    // }, function (data) {
    //   wx.showToast({ title: '网络故障' });
    //   console.log(data);
    // })







    //   var that = this;
    //   this.nowdate(that);
    //   // 生命周期函数--监听页面加载
    // //  showView: (options.showView == "true" ? true : false)
    //   var id = 1;
    //   var userid = 1;
    //   var nowdata = '';
    //   wx.request({
    //     url: 'http://lulei.ren/xcxtongji',
    //     method: 'post',
    //     data: {
    //       userid:userid,
    //       id: id,
    //       nowdata: nowdata
    //     }, success: function (result) {
    //       console.log(123)
    //       console.log(result.data)
    //       if(result.data.statusCode == '200'){
    //         that.setData({
    //           info:result.data.data
    //         })
    //       }else{
    //           console.log('0')
    //       }
    //     }
    //   })
  }
  , onChangeShowState: function () {
    var that = this;
    that.setData({
      one: (!that.data.one)
    })
  }
})