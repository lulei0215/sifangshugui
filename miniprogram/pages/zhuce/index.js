// page/test/test.js
var app = getApp();
var picPath = app.globalData.picPath;
var service = require('../../utils/util.js')
var pathUrl = app.globalData.pathUrl;
var falg = false, timer;
Page({
  data: {
    shows: 1,
    picPath: picPath,
    phone: '',
    yzmCont: '获取验证码',
    xieyi: false
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的数
    console.log('onload')
    var _this = this;
    // _this.setData({
    //   shows:0
    // })
  },
  // 协议点击
  xieyiClick: function () {
    this.setData({
      xieyi: !this.data.xieyi
    })
  },
  // 跳转到协议页面
  toxieyi: function () {
    wx.navigateTo({
      url: '/page/user-xy/user-xy',
    })
  },
  // 手机号改变
  changePhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  bindGetUserInfo(e) {
    var msg = e.detail.errMsg;
    console.log(e)
    var that = this;
    var session;
    if (msg == 'getUserInfo:ok') {//授权点击确定getUserInfo:ok
      //确认授权的话 就不显示弹窗
      console.log('点击了允许授权')
      this.setData({
        shows: 1
      })
      wx.setStorageSync('shows', true)
      session = wx.getStorageSync('session');
      //app.getuserInfo(that);
      // if (session == '') {
      //   console.log('session空')
      //   that.getUserSessions()
      // }
      setTimeout(function () {
        that.getuserInfo(that)
      }, 500)

    } else if (msg == 'getUserInfo:fail auth deny') {//授权点击取消授权getUserInfo:fail auth deny
      //取消授权  就显示弹窗
      console.log('点击了取消授权')
    } else {
      console.log('未知情况')
    }
    var userinfo = e.detail.userInfo
    var _this = this;
    // if (userinfo) { 
    //   _this.setData({
    //     xianshi: false
    //   })
    //   console.log("点击1")
    // } else {

    // }
  },
  // 获取用户session
  getUserSession: function () {
    var self = this;
    var session = wx.getStorageSync('session')
    if (session != '') {
    } else {
      wx.login({
        success: function (data) {
          wx.request({
            method: 'POST',
            url: pathUrl + '/wxget',
            data: {
              code: data.code
            },
            success: function (res) {
              wx.setStorageSync('session', res.data.data);
            },
            fail: function (res) {
              console.log('网络故障,请重新打开', res)
            }
          })
        },
        fail: function (err) {
          console.log('网络故障,请重新打开', err)
        }
      })
    }
  },
  //微信登陆调取
  getuserInfo: function (that) {
    var that = this
    wx.getUserInfo({
      success: function (res) {
        // success
        console.log('微信登录调取')
        console.log(res)
        console.log('微信登录调取')
        var userInfo = res
        console.log(pathUrl + '/getuser');
        that.getUserSession(function (res, session) {
          console.log(session);
          wx.request({
            method: 'POST',
            url: pathUrl + '/getuser',
            data: {
              userinfo: userInfo,
              session: session
            },
            success: function (res) {
              console.log('获取信息成功shows');
              console.log(res.data)
              if (res.data.err_code == '001') {
                wx.removeStorageSync('session');
                that.getuserInfo(that);
              }
            },
            fail: function (res) {
              console.log('获取信息失败！shows')
            }
          })
        })

      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  
  // 表单提交
  login: function (e) {
    var that = this;
    var formInfo = e.detail.value;
    console.log('dianji')
   
    console.log(formInfo);

    var url = pathUrl + '/yanz';
    service.http(url, {'card':formInfo.yzm}, function (data) {
      var data = data.data;
      if (data.err_code == '000') {
        console.log('chenggong')
        wx.showToast({
          title: data.err_msg,
          duration: 2000,
          icon: 'success',
          success: function () {
            console.log('success')
            wx.navigateBack({//返回
              delta: 1
            })
      
          }
        });
      } else {
        wx.showToast({ title: data.err_msg });
      }
    }, function (data) {
      wx.showToast({ title: '接口请求失败' });
      console.log(data);
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
    console.log('页面关闭');
    clearInterval(timer);
  },

})