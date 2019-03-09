//index.js
var app = getApp()
import Dialog from '../../dist/dialog/dialog';
var wxApi = require('../../utils/wxApi')
var wxRequest = require('../../utils/wxRequest')
var service = require('../../utils/util.js')
var pathUrl = app.globalData.pathUrl;
Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    date: '',
    show: false,
    username: '',
    password: '',
    shows:1
  },
  //日期插件事件
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
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
  },
  glist:function(){
    wx.navigateTo({
      url: '/pages/glist/index'
    })
  },
  nowdate:function(that){
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
    wx.setStorageSync('nowdate',nowDate)
  },
  onSubmit(event){
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
    console.log(nowDate)
    this.setData({
      date: nowDate
    })
    wx.setStorageSync('nowdate', nowDate)

   
    console.log('index onlaunch')
    var shows = wx.getStorageSync('shows');
    console.log(shows)
    this.setData({
      shows:shows
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
              userinfo:res.userInfo
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
                  console.log('获取信息成功');
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
              shows:0
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
                  userinfo:res.userInfo
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
                console.log('获取用户信息失败')
                console.log(res);
                that.setData({
                  shows:0
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
          userinfo:res.userInfo
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
              console.log('获取信息成功');
              console.log(res.data)
              if (res.data.err_code == '003') {
                wx.redirectTo({
                  url: '/pages/zhuce/index',
                })
                // that.getuserInfo(that);
              } else if(res.data.err_code == '001'){
                wx.removeStorageSync('session');
              }else{

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
    


    // var that = this;
    // this.nowdate(that);

    // var url = pathUrl + '/xindex';
    // setTimeout(function () {
    //   service.http(url, {}, function (data) {

    //     var data = data.data;
    //     console.log(data)
    //     if (data.err_code == '000') {
    //       that.setData({
    //         info: data.data,

    //       })
    //     } else {
    //       wx.showToast({ title: data.err_msg });
    //     }
    //   }, function (data) {
    //     wx.showToast({ title: '网络故障,请重新打开' });
    //     console.log(data);
    //   })
    // }, 1000)  
   

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
  getData:function(){
    // wx.request({
    //   header: {
    //     'token': wx.getStorageSync('token')
    //   },
    //   url: 'https://xxxxx.xxxxx',
    //   method: 'GET',
    //   success: res => {
    //     console.log(res);
    //   }
    // })

    console.log('getdata')
  },
  cellclick:function(res){
    var _this = this
    // console.log(res)
    // console.log(_this)
    var id = res.currentTarget.id
    console.log(id)
    var nowdate = wx.getStorageSync('nowdate');
    wx.navigateTo({
      url: '/pages/infors/index?id='+id+'&nowdate='+nowdate
    })
    // if(id == '0'){
    //   var one = !_this.data.one
    //   console.log(id)
    //   _this.setData({
    //     one: one,
    //     two: false,
    //     three: false,
    //     four: false,
    //     five: false,
    //     six: false
    //   })
    // }else if(id == '1'){
    //   var two = !_this.data.two
    //   console.log(id)
    //   _this.setData({
    //     one: false,
    //     two: two,
    //     three: false,
    //     four: false,
    //     five: false,
    //     six: false
    //   })
    // }else if(id == '2'){
    //   var three = !_this.data.three
    //   console.log(id)
    //   _this.setData({
    //     one: false,
    //     two: false,
    //     three: three,
    //     four: false,
    //     five: false,
    //     six: false
    //   })
    // }else if(id == '3'){
    //   var four = !_this.data.four
    //   console.log(id)
    //   _this.setData({
    //     one: false,
    //     two: false,
    //     three: false,
    //     four: four,
    //     five: false,
    //     six: false
    //   })
    // }else if(id =='4'){
    //   var five = !_this.data.five
    //   console.log(id)
    //   _this.setData({
    //     one: false,
    //     two: false,
    //     three: false,
    //     four: false,
    //     five: five,
    //     six: false
    //   })
    // }else if(id =='5'){
    //   var six = !_this.data.six
    //   console.log(id)
    //   _this.setData({
    //     one: false,
    //     two: false,
    //     three: false,
    //     four: false,
    //     five: false,
    //     six: six
    //   })
    // }else{
   
    // }
   
  },
  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
