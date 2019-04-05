import Notify from '../../dist/notify/notify';
var app = getApp()
import Dialog from '../../dist/dialog/dialog';
var wxApi = require('../../utils/wxApi')
var wxRequest = require('../../utils/wxRequest')
var service = require('../../utils/util.js')
var pathUrl = app.globalData.pathUrl;
Page({
  data: {
    bu: 0,
    activeNames: ['0'],
    ess: ["对他人说谎",
      "对自己内心说谎",
      "无法真诚道歉",
      "把自己的行为正当化/唬弄他",
      "找借口",
      "将自己犯过的错推给别人",
      "不守承诺（不守约）",
      "虚荣", "隐藏自己的实力",
      "错误理解别人的好意而从而产生忌恨或对忌恨自己的人同样产生忌恨",
      "暗地里，背地里做事",
      "把别人的秘密说出去",
      "嫉妒", "迁怒于人",
      "偷东西/有借无还/浪费",
      "占用别人得时间（自己可以做的事情让别人帮着做）",
      "剥夺别人的自由", "逃票（不买票，或者买短程票而成乘长程）",
      "伤害他人的心，欺负他人",
      "自己作弊，帮助他人作弊",
      "开小差（趁他人不注意做自己的事情）",
      "偷听",
      "把公司的电话（邮件）用作私用",
      "逃课"
    ],
    shiqing: '',
    shiqing1: '',
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    date: '',
    show: false,
    username: '',
    password: '',
    shows: 1,
    bshow:1
  },
  onChange(event) {
    var that = this;
    that.setData({
      activeNames: event.detail
    });
  },
  toindex:function(){
    console.log(1)
    wx.switchTab({
      url: '/pages/shouye/index',
    })
  },
  tonow: function () {
    console.log(12)
    wx.switchTab({
      url: '/pages/now/index',
    })
  },
  //日期插件事件
  bindDateChange: function (e) {
    var that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      date: e.detail.value
    })
    wx.setStorageSync('nowdate', e.detail.value)
    var nowdata = wx.getStorageSync('nowdate');
    
    console.log(nowdata)
  },
  //默认date是今天 改变时 更改date的值传递过去
  // bindGetUserInfo(e) {
  //   var msg = e.detail.errMsg;
  //   console.log(e)
  //   var that = this;
  //   var session;
  //   if (msg == 'getUserInfo:ok') { //授权点击确定getUserInfo:ok
  //     //确认授权的话 就不显示弹窗
  //     console.log('点击了允许授权')
  //     that.setData({
  //       shows: 1
  //     })
  //     wx.setStorageSync('shows', true)
  //     session = wx.getStorageSync('session');
  //     //app.getuserInfo(that);
  //     // if (session == '') {
  //     //   console.log('session空')
  //     //   that.getUserSessions()
  //     // }
  //     setTimeout(function () {
  //       that.getuserInfo(that)
  //     }, 500)

  //   } else if (msg == 'getUserInfo:fail auth deny') { //授权点击取消授权getUserInfo:fail auth deny
  //     //取消授权  就显示弹窗
  //     console.log('点击了取消授权')
  //   } else {
  //     console.log('未知情况')
  //   }
  //   var userinfo = e.detail.userInfo
  //   var _this = this;
  // },
  glist: function () {
    wx.navigateTo({
      url: '/pages/glist/index'
    })
  },
  
  onSubmit(event) {
    console.log(event)
  },
  onClose(event) {
    if (event.detail === 'confirm') {
      console.log(event);
      // 异步关闭弹窗
      setTimeout(() => {
        console.log(1)
        // this.setData({
        //   show: false
        // });
      }, 1000);
    } else {
      console.log(0)

    }
  },
  onShow: function () {

  
  },
  onLoad: function (options) {
    //var shows =  app.globalData.shows
    var shows = this.data.shows;
    console.log('onload')
    console.log(shows)
    this.setData({
      date:options.nowdate
    })




  },
  shiqing: function (e) {
    console.log(e.target.id);
    var _this = this
    var shiqing = 'shiqing'+e.target.id;
    console.log(shiqing)
    console.log(e.detail);
    wx.setStorageSync('shiqing' + e.target.id, e.detail)
    wx.getStorageInfo({
      success(res) {
        console.log(res.keys)

      }
    })
    console.log(_this.data.shiqing)
  },
  bujinqi: function (e) {
  
    var _this = this
    var bujiid =  e.currentTarget.dataset.id;
    console.log(bujiid)
    var _this = this
    console.log(e.detail);
    wx.setStorageSync(bujiid, e.detail)

  },
  formSubmit: function (e) {
    console.log(e)
    wx.getStorageInfo({
      success(res) {
        console.log(res.keys)

      }
    })
    var _this = this;
    var id = e.detail.target.id
    var point = wx.getStorageSync('buji' + id);
    var shiqing = wx.getStorageSync('shiqing' + id)
  console.log(point+'fen')
    if (!point) {
      console.log('空point')
      wx.showToast({
        title: '分值要大于0',
        icon: 'fail',
        duration: 2000
      })
      return false;
      point = 0;
      wx.setStorageSync('point' + id, point)
    }
    var shiqing = wx.getStorageSync('shiqing' + id);
    if (!shiqing) {
      console.log('事情为空')
      shiqing = '';
      wx.setStorageSync('shiqing' + id, '')
    }
    console.log(e)

    // var nowdata = wx.getStorageSync('nowdate');
    var nowdata = _this.data.date;
    var id = e.detail.target.id;
    console.log('form发生了submit事件，携带数据为：', e.detail.value)

    var url = pathUrl + '/addtongji';
    service.http(url, {
      nowdata: nowdata,
      id: id,
      bu: point,
      shiqing: shiqing
    }, function (data) {
      var data = data.data;
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

})