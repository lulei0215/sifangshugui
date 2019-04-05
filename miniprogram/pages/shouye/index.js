// pages/shouye/index.js
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
    curYear: new Date().getFullYear(), // 年份
    curMonth: new Date().getMonth() + 1,// 月份 1-12
    day: new Date().getDate(), // 日期 1-31 若日期超过该月天数，月份自动增加
    header_show: true, // 主标题是否显示
    prev: true, // 上一个月按钮是否显示
    next: true, // 下一个月按钮是否显示,
  appear:true,
  userinfo: '',
  show: false,
  shows: 1,
  },
  selectDate: function (e) {
    console.log(e.detail.date)
    wx.redirectTo({
      url: '/pages/three/index?date=' + e.detail.date,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
    onShow: function () {
      //判断是否授权  没有授权就显示首选弹窗
      var that = this;
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
                    if (res.data.type == 1) {
                  
                    } else {
              
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
                if (res.data.type == 1) {
                  console.log(nowDate)
                  that.setData({
                    date: nowDate
                  })
                  wx.setStorageSync('nowdate', nowDate)
                } else {
                  var nowsdate = res.data.type;
                  that.setData({
                    date: nowsdate
                  })
                  wx.setStorageSync('nowdate', nowsdate)
                }
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