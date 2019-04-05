
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
    activeNames: ['0'],
    datas: [],
    title: '',
    titles: [],
    id: '', nowdate: '', shiqing: []
  },
  xia: function (e) {
    console.log(e);
    var that = this;
    var id = e.target.id;
    var nowdate = that.data.nowdate;
    wx.redirectTo({
      url: '/pages/three3/index?id=' + id + '&nowdate=' + nowdate,
    })
  },
  onChange(event) {
    var that = this;
    that.setData({
      activeNames: event.detail
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options);
    that.setData({
      id:options.id,
      nowdate:options.nowdate
    })
    var id = options.id; var nowdate = options.nowdate;
    if(id == 11){
      this.setData({
        title: '说真话，做实事',
        titles: [{ 'id': 111, 'title': '起心动念' }]
      })
    }else if(id == 12){
      this.setData({
        title: '巧言令色，乡愿',
        titles: [{ 'id': 121, 'title': '起心动念' }]
      })
    }else if(id == 21){
      this.setData({
        title: '有条件为他人做的',
        titles: [{ 'id': 211, 'title': '起心动念' }]
      })
    }else if(id == 22){
      this.setData({
        title: '无条件为他人做的',
        titles: [ { 'id': 221, 'title': '起心动念' }]
      })
    }else if(id == 23){
      this.setData({
        title: '巧言令色，乡愿，讨好',
        titles: [{ 'id': 231, 'title': '起心动念' }]
      })
    }else if(id == 31){
      this.setData({
        title: '色难',
        titles: [{ 'id': 311, 'title': '起心动念' }]
      })
    }else{
      this.setData({
        title: '24条',
        titles: [ { 'id': 321, 'title': '起心动念' }]
      })
    }

    var session = wx.getStorageSync('session');
    wx.request({
      method: 'POST',
      url: pathUrl + '/xcxjilu',
      data: {
        nowdate: nowdate, id: id, session: session
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data.data)
        that.setData({
          shiqing: res.data.data
        })
      }
    })
  


  },
  formSubmit: function (e) {
    console.log(e)
    var id = this.data.id;
    var nowdate = this.data.nowdate;
    var shiqing = e.detail.value.shiqing;

    var url = pathUrl + '/addxcxjilu';
    service.http(url, {
      nowdate: nowdate,
      id: id,
      shiqing: shiqing
    }, function (data) {
      var data = data.data;
      console.log(data)
      if (data.err_code == '200') {
        console.log('1')
        wx.showToast({
          title: '添加成功',
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
})