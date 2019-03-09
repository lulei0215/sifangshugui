var app = getApp()
import Dialog from '../../dist/dialog/dialog';
var wxApi = require('../../utils/wxApi')
var wxRequest = require('../../utils/wxRequest')
var service = require('../../utils/util.js')
var pathUrl = app.globalData.pathUrl;
Page({
  data: {
    one: false,
    data: "",
    info: "",
    ss: false,
    date: '',
    date7: '',
    date2: '',
    date3: '',
    shuju: [],
    shuju1: [],
    shuju2: [],
    shuju3: [],
    tableData: [],
    tableData1: [],
    tableData2:[],
    threeArray: [], //模拟将后台获取到的数组对象数据按照一行3个的单元数据的格式切割成新的数组对象（简单的说：比如获取到数组是9个元素，切分成，3个元素一组的子数组）
  },
  onLoad: function () {
    let that = this;
    let threeArray = [];
    let a = [];
    // 使用for循环将原数据切分成新的数组
    // for(let j = 0 ; j < 2;j++){
    //   for (let i = 0, len = 24; i < len; i += 1) {
       
    //     a[i]={'id':1};
    //  //   threeArray.push(a);
    //   }
    // }
    // console.log(a);
    // console.log(threeArray);
    // that.setData({
    //   threeArray: threeArray
    // })
    console.log(threeArray);
  },
  onShow: function(){
    console.log('onshowss')
    var that = this;
    var date7 = that.getBeforeDate(7)
    var date = that.getBeforeDate(0)
    var date2 = that.getBeforeDate(7)
    var date3 = that.getBeforeDate(0)
    console.log(date7)
    that.setData({
      date7: date7,
      date:date,
      date2: date2,
      date3: date3
    })
  },
  getBeforeDate: function (n) {
    var n = n;
    var s = '';
    var d = new Date();
    var year = d.getFullYear();
    var mon = d.getMonth() + 1;
    var day = d.getDate();
    if (day <= n) {
      if (mon > 1) {
        mon = mon - 1;

      } else {
        year = year - 1;
        mon = 12;

      }

    }
    d.setDate(d.getDate() - n);
    year = d.getFullYear();
    mon = d.getMonth() + 1;
    day = d.getDate();
    s = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
    return s;
  },
  bindDateChange7: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date7: e.detail.value
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindDateChange2: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date2: e.detail.value
    })
  },
  bindDateChange3: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date3: e.detail.value
    })
  },
  serch: function (e) {
    var that = this;
    var id = e.target.dataset.id;
    console.log(id)
    if(id == 1){
      var data1 = that.data.date;
      var data7 = that.data.date7;
    }else{
      var data1 = that.data.date3;
      var data7 = that.data.date2;
    }
    console.log(data1);
    console.log(data7);
    var url = pathUrl + '/wxbiaoge';
    service.http(url, { 'nowdata': data1, 'nowdata7': data7 }, function (data) {
      var data = data.data;
      console.log(data)
      if (data.err_code == '000') {
        if (data.data != false) {
          console.log('data非空')
         
          var datas = data.datas;
         
          console.log(data)
          if (id == 1) {
            that.setData({
              tableData1: datas,//第一条数据
            })
          } else {
            that.setData({
              tableData2: datas,//第一条数据
            })
          }
         
        }
      } else {
        wx.showToast({ title: data.err_msg });
      }
    }, function (data) {
      wx.showToast({ title: '网络故障' });
      console.log(data);
    })


  }
})
