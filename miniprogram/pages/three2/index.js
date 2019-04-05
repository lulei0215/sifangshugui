// pages/three2/index.js
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
      datas:[],
      title:'',
      titles:[],
    id: '', nowdate: '',shiqing:[]
  },
  xia:function(e){
    console.log(e);
    var that = this;
    var id = e.target.id;
    var nowdate = that.data.nowdate;
    if(id == 32){
      console.log(32)
      wx.navigateTo({
        url: '/pages/index/index?id=' + id + '&nowdate=' + nowdate,
      })
    }else{
      wx.navigateTo({
        url: '/pages/three3/index?id=' + id + '&nowdate=' + nowdate,
      })
    }
    
  
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
      console.log(options)
      var id = options.id;
      var nowdate = options.nowdate;
      if (id == 1) {
          this.setData({
            id:id,nowdate:nowdate,
            title:'Q1：别人对我做了什么？',
            titles:[{'id':11,'title':'说真话，做实事'},{'id':12,'title':'巧言令色，乡愿'}]
          })
      } else if (id == 2) {
        this.setData({
          id: id, nowdate: nowdate,
          title: 'Q2：我为别人做了什么？',
          titles: [{ 'id': 21, 'title': '有条件为他人做的' }, { 'id': 22, 'title': '无条件为他人做的' }, { 'id': 23, 'title':'巧言令色，乡愿，讨好'}]
        })
      } else {
        this.setData({
          id: id, nowdate: nowdate,
          title: 'Q3：我给别人添了什么麻烦？',
          titles: [{ 'id': 31, 'title': '色难' }, { 'id': 32, 'title':'24条'},]
        })
      }
   

    var session = wx.getStorageSync('session');
    wx.request({
      method: 'POST',
      url:pathUrl + '/xcxjilu',
      data: {
        nowdate: nowdate,id:id,session:session
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data.data)
        that.setData({
          shiqing:res.data.data
        })
      }
    })
  },
hehe: function () {
  console.log(1)
},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  formSubmit: function (e) {
    var that = this
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
        shiqings.push({'shiqing':shiqing})
        that.setData({
          shiqing:shiqings
        })
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