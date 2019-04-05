
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
    wx.navigateTo({
      url: '/pages/three4/index?id=' + id + '&nowdate=' + nowdate,
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
      id: options.id,
      nowdate: options.nowdate
    })
    var id = options.id; var nowdate = options.nowdate;
   
      this.setData({
        title: '起心动念',
        titles: [{ 'id': id, 'title': '起心动念' }]
      })
   

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
    var that = this;
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
          duration: 1000
        })
        var shiqings = that.data.shiqing;
        console.log(shiqings)
        shiqings.push({'shiqing':shiqing})
        that.setData({
          shiqing:shiqings
        })
        
        console.log(shiqings)
      } else {
        console.log('0')
        wx.showToast({
          title: '失败请重试',
          icon: 'fail',
          duration: 1000
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