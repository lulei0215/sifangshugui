import Notify from '../../dist/notify/notify';
var app = getApp()
import Dialog from '../../dist/dialog/dialog';
var wxApi = require('../../utils/wxApi')
var wxRequest = require('../../utils/wxRequest')
var service = require('../../utils/util.js')
var pathUrl = app.globalData.pathUrl;
Page({
  data: {
    bu: 1,
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
    shows: 1
  },
  onChange(event) {
    var that = this;
    that.setData({
      activeNames: event.detail
    });
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
  bindGetUserInfo(e) {
    var msg = e.detail.errMsg;
    console.log(e)
    var that = this;
    var session;
    if (msg == 'getUserInfo:ok') { //授权点击确定getUserInfo:ok
      //确认授权的话 就不显示弹窗
      console.log('点击了允许授权')
      that.setData({
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

    } else if (msg == 'getUserInfo:fail auth deny') { //授权点击取消授权getUserInfo:fail auth deny
      //取消授权  就显示弹窗
      console.log('点击了取消授权')
    } else {
      console.log('未知情况')
    }
    var userinfo = e.detail.userInfo
    var _this = this;
  },
  glist: function () {
    wx.navigateTo({
      url: '/pages/glist/index'
    })
  },
  nowdate: function (that) {
    var this_ = this;
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
    this_.setData({
      date: nowDate
    })
    wx.setStorageSync('nowdate', nowDate)
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
  


    console.log('index onlaunch')
    var shows = wx.getStorageSync('shows');
    console.log(shows)
    this.setData({
      shows: shows
    })
    console.log('onlaunch')
    wx.setStorageSync('shows', true)
    wx.setStorageSync('loginredirect', true)
    var session = wx.getStorageSync('session');
    if (session == '') {
      console.log('最初空')
    }
    //   onShow: function () {
    console.log('index--onShow')


    //判断是否授权  没有授权就显示首选弹窗
    var that = this;
    //首先异步请求 判断 当前入口是小程序还是企业微信的小程序

    //that.globalData.qywx = 1;

    //当前是企业微信登陆状态
    //判断当前的微信授权状态
    wx.checkSession({
      success: function () {
        //ssion 未过期，并且在本生命周期一直有效
        console.log("已经登陆");
        //that.getuserInfo(that);
        wx.getUserInfo({
          success: function (res) {
            // success
            //that.globalData.userinfo = res.userInfo;
            that.setData({
              userinfo: res.userInfo
            })
            var userInfo = res
            // var userInfo = res.userInfo;
            // userInfo.encryptedData = res.encryptedData;
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
                  console.log('获取信息成功22222222222');
                  console.log(res.data.data.user_status)

                  if (res.data.data.user_status == '1') {
                    //wx.removeStorageSync('session');
                    //that.getuserInfo(that);
                    console.log('未激活用户')
                    wx.navigateTo({
                      url: '/pages/zhuce/index',
                    })
                    console.log('变了333')
                  }
                  if(res.data.type == 1){ 
                    console.log(nowDate)
                    that.setData({
                      date: nowDate
                    })
                    wx.setStorageSync('nowdate', nowDate)
                  }else{
                    var nowsdate = res.data.type;
                    that.setData({
                      date: nowsdate
                    })
                    wx.setStorageSync('nowdate', nowsdate) 
                  }
                  console.log('变了222222')
                },
                fail: function (res) {
                  console.log('获取信息失败！')
                  console.log('变了2')
                }
              })


            })

          },
          fail: function (res) {
            console.log(res);
            //  that.globalData.shows = 0
            that.setData({
              shows: 0
            })
            console.log('没有授权')
            wx.setStorageSync('shows', 0)
            console.log('变了')
          }
        })
      },
      fail: function () {
        console.log("登录过期了")
        //登录态过期
        wx.login({
          success: function (res) {
            console.log("重新登陆成功login", res)
            // that.getuserInfo(that);
            wx.getUserInfo({
              success: function (res) {
                // success
                // that.globalData.userinfo = res.userInfo;
                that.setData({
                  userinfo: res.userInfo
                })
                var userInfo = res
                // var userInfo = res.userInfo;
                // userInfo.encryptedData = res.encryptedData;
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
                      console.log('获取信息成功111111111');
                      console.log(res.data)
                      if (res.data.err_code == '001') {
                        wx.removeStorageSync('session');
                        // that.getuserInfo(that);
                      }
                    },
                    fail: function (res) {
                      console.log('获取信息失败！')
                    }
                  })
                })

              },
              fail: function (res) {
                console.log('获取用户信息失败')
                console.log(res);
                that.setData({
                  shows: 0
                })
                //that.globalData.shows = 0
                wx.setStorageSync('shows', false)
              }
            })
          }
        })
      }
    })
  },
  // onShow: function () {
  //   console.log('onshow')
  //   this.setData({
  //     show:true
  //   })
  // },
  //微信登陆调取
  getuserInfo: function (that) {
    wx.getUserInfo({
      success: function (res) {
        // success
        //that.globalData.userinfo = res.userInfo;
        that.setData({
          userinfo: res.userInfo
        })
        var userInfo = res
        // var userInfo = res.userInfo;
        // userInfo.encryptedData = res.encryptedData;
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
              console.log('获取信息成功9999999');
              console.log(res.data)
              if (res.data.err_code == '003') {
                wx.redirectTo({
                  url: '/pages/zhuce/index',
                })
                // that.getuserInfo(that);
              } else if (res.data.err_code == '001') {
                wx.removeStorageSync('session');
              } else {

              }
            },
            fail: function (res) {
              console.log('获取信息失败！')
            }
          })
        })

      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  onLoad: function (options) {
    //var shows =  app.globalData.shows
    var shows = this.data.shows;
    console.log('onload')
    console.log(shows)





  },
  // 获取用户session
  getUserSession: function (callback) {
    var self = this;
    var session = wx.getStorageSync('session')
    if (session != '') {
      callback(null, session)
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
              callback(null, res.data.data);
            },
            fail: function (res) {
              console.log('网络故障,请重新打开', res)
              callback(res)
            }
          })
        },
        fail: function (err) {
          console.log('网络故障,请重新打开', err)
          callback(err)
        }
      })
    }
  },
  shiqing: function (e) {
    console.log(e.target.id);
    var _this = this
    console.log(e.detail);
    wx.setStorageSync('shiqing' + e.target.id, e.detail)
    console.log(_this.data.shiqing)
  },
  bujinqi: function (e) {
    console.log(e.currentTarget.dataset.id)
    var bujiid = e.currentTarget.dataset.id;
    // var aa = document.getElementById(bujiid)
    // console.log(aa)
    var _this = this
    console.log(e.detail);
    wx.setStorageSync('point' + bujiid, e.detail)
    console.log(_this.data.bu)

  },
  formSubmit: function (e) {
    var _this = this;
    var id = e.detail.target.id
    var point = wx.getStorageSync('point' + id);
    console.log(e.detail.target.id)
    if (!point) {
      console.log('空point')
      point = 1;
      wx.setStorageSync('point' + id, 1)
    }
    var shiqing = wx.getStorageSync('shiqing' + id);
    if (!shiqing) {
      console.log('事情为空')
      shiqing = '';
      wx.setStorageSync('shiqing' + id, '')
    }
    console.log(e)

    var nowdata = wx.getStorageSync('nowdate');
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