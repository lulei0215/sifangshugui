// const openIdUrl = require('./config').openIdUrl

App({
  globalData: {
    shows: 0,
    qywx: false,
    hasLogin: false,
    openid: null,
    userinfo: '',
    shouquan: false,
    pathUrl: 'https://24.lulei.ren',
    picPath: 'https://24.lulei.ren/home/image'
  },
  onLaunch: function () {
    wx.setStorageSync('shows', 1)

  },
  onShow: function () {
    console.log('app onshow')
    var shows = this.globalData.shows
    console.log(shows)
    session = wx.getStorageSync('session');
    if (session == '') {
      console.log('app onshow空')
    }
    var session = wx.getStorageSync('session')
    if (session == '') {
      var that = this;
      //首先异步请求 判断 当前入口是小程序还是企业微信的小程序
      wx.getSystemInfo({
        success: function (res) {
          that.globalData.qywx = 1;
          //当前是企业微信登陆状态
          if (res.hasOwnProperty('environment')) {
            //判断当前的企业微信授权状态
            wx.qy.checkSession({
              success: function () {
                console.log('企业微信授权状态未过期')
                that.getqyuserInfo(that);
                //session_key 企业微信授权状态未过期，并且在本生命周期一直有效
              },
              fail: function () {
                // session_key 企业微信授权状态已经失效，需要重新执行登录流程
                console.log('企业微信授权状态过期')
                wx.qy.login({
                  success: function (res) {
                    console.log("重新登陆成功login", res)
                    //企业微信登录态过期
                    wx.request({
                      method: 'POST',
                      url: that.globalData.pathUrl + '/qywxget',
                      data: {
                        code: res.code
                      },
                      success: function (res) {
                        console.log(res);
                        console.log('过期拉取用户成功', res)
                        wx.setStorageSync('session', res.data.data);
                        callback(null, res.data.data);
                        that.getqyuserInfo(that);
                      },
                      fail: function (res) {
                        console.log('网络故障,请重新打开', res)
                        callback(res)
                      }
                    })
                  }
                })
              }
            })
          } else {
            //判断当前的微信授权状态
            wx.checkSession({
              success: function () {
                //ssion 未过期，并且在本生命周期一直有效
                console.log("已经登陆");
                //that.getuserInfo(that);
                wx.getUserInfo({
                  success: function (res) {
                    // success
                    that.globalData.userinfo = res.userInfo;
                    var userInfo = res
                    // var userInfo = res.userInfo;
                    // userInfo.encryptedData = res.encryptedData;
                    that.getUserSession(function (res, session) {
                      console.log(session);

                      wx.request({
                        method: 'POST',
                        url: that.globalData.pathUrl + '/getuser',
                        data: {
                          userinfo: userInfo,
                          session: session
                        },
                        success: function (res) {
                          console.log('获取信息成功');
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
                    console.log(res);
                    that.globalData.shows = 0
                    console.log(123)
                  }
                })
              },
              fail: function () {
                console.log("登录过期")
                //登录态过期
                wx.login({
                  success: function (res) {
                    console.log("重新登陆成功login", res)
                    // that.getuserInfo(that);
                    wx.getUserInfo({
                      success: function (res) {
                        // success
                        that.globalData.userinfo = res.userInfo;
                        var userInfo = res
                        // var userInfo = res.userInfo;
                        // userInfo.encryptedData = res.encryptedData;
                        that.getUserSession(function (res, session) {
                          console.log(session);
                          wx.request({
                            method: 'POST',
                            url: that.globalData.pathUrl + '/getuser',
                            data: {
                              userinfo: userInfo,
                              session: session
                            },
                            success: function (res) {
                              console.log('获取信息成功');
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
                        console.log(res);
                        that.globalData.shows = 0
                      }
                    })
                  }
                })
              }
            })
          }
        }
      });
    }
  },
  onHide: function () {
    console.log('App Hide')
  },

  //企业微信登陆调取12
  getqyuserInfo: function (that) {

    wx.qy.getEnterpriseUserInfo({
      success: function (res) {
        // success
        that.globalData.userinfo = res.userInfo;
        var userInfo = res.userInfo;
        // var userInfo = res.userInfo;
        // userInfo.encryptedData = res.encryptedData;
        that.getqyUserSession(function (res, session) {
          console.log(session);
          wx.request({
            method: 'POST',
            url: that.globalData.pathUrl + '/getqyuser',
            data: {
              userinfo: userInfo,
              session: session
            },
            success: function (res) {
              console.log('获取信息成功');
              console.log(res)
              console.log('获取信息成功');
              if (res.data.err_code == '001') {
                wx.removeStorageSync('session');
                that.getqyuserInfo(that);
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
  //微信登陆调取
  getuserInfo: function (that) {
    wx.getUserInfo({
      success: function (res) {
        // success
        that.globalData.userinfo = res.userInfo;
        var userInfo = res
        // var userInfo = res.userInfo;
        // userInfo.encryptedData = res.encryptedData;
        that.getUserSession(function (res, session) {
          console.log(session);
          wx.request({
            method: 'POST',
            url: that.globalData.pathUrl + '/getuser',
            data: {
              userinfo: userInfo,
              session: session
            },
            success: function (res) {
              console.log('获取信息成功');
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
        console.log(res);
      }
    })
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
            url: self.globalData.pathUrl + '/wxget',
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
  // 获取企业微信用户session
  getqyUserSession: function (callback) {
    var self = this;
    var session = wx.getStorageSync('session')
    if (session != '') {
      callback(null, session)
    } else {
      wx.qy.login({
        success: function (data) {
          wx.request({
            method: 'POST',
            url: self.globalData.pathUrl + '/qywxget',
            data: {
              code: data.code
            },
            success: function (res) {
              console.log(res);
              console.log('拉取用户成功', res)
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
  }
})
