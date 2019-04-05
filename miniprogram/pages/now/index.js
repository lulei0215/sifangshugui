// pages/now/index.js
import Notify from '../../dist/notify/notify';
var app = getApp()
import Dialog from '../../dist/dialog/dialog';
var wxApi = require('../../utils/wxApi')
var wxRequest = require('../../utils/wxRequest')
var service = require('../../utils/util.js')
var pathUrl = app.globalData.pathUrl;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowdate:[],
    datas:[],
    sort:1
  },
  shun:function(){
    var sort = this.data.sort;
    if(sort != 1){
      var nowdate = this.nowdate();
      var that = this;
      var url = pathUrl + '/wxnows';
      service.http(url, {
        'nowdata': nowdate,
        'nowdata7': nowdate
      }, function (data) {
        console.log(data)
        var data = data.data;
        that.setData({
          datas: data.datas,
          sort:1
        })
        console.log(data)

      }, function (data) {
        wx.showToast({
          title: '网络故障,请重新打开'
        });
        console.log(data);
      })
    }
  },
  fan:function(){
    var sort = this.data.sort;
    if (sort == 1) {
      var nowdate = this.nowdate();
      var that = this;
      var url = pathUrl + '/wxnowss';
      service.http(url, {
        'nowdata': nowdate,
        'nowdata7': nowdate
      }, function (data) {
        console.log(data)
        var data = data.data;
        that.setData({
          datas: data.datas,
          sort:2
        })
        console.log(data)

      }, function (data) {
        wx.showToast({
          title: '网络故障,请重新打开'
        });
        console.log(data);
      })
    } 
  },
  nowdate: function () {
  
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
    return nowDate;

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  bujinqi: function (e) {

    var _this = this
    var bujiid = e.currentTarget.dataset.id;
    console.log(bujiid)
    var _this = this
    console.log(e.detail);
    wx.setStorageSync(bujiid, e.detail)

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var nowdate = this.nowdate();
    var that = this;
    var url = pathUrl + '/wxnows';
    service.http(url, {
      'nowdata': nowdate,
      'nowdata7': nowdate
    }, function (data) {
      console.log(data)
      var data = data.data;
      that.setData({
        datas:data.datas
      })
      console.log(data)

    }, function (data) {
      wx.showToast({
        title: '网络故障,请重新打开'
      });
      console.log(data);
    })
  },
  formSubmit: function (e) {
   console.log(e);

    var url = pathUrl + '/editnow';
    service.http(url, {
      nowdata: e.detail.value
    }, function (data) {

      data = data.data;
      console.log(data)
      if (data.err_code == '000') {
        console.log('1')
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
      } else {
        console.log('0')
        wx.showToast({
          title: '失败请重试',
          icon: 'fail',
          duration: 2000
        })
      }
    }, function (data) {
      wx.showToast({
        title: '网络故障,请重新打开'
      });
      console.log(data);
    })
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

  }
})