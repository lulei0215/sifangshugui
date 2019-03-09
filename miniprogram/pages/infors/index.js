// pages/infors/index.js
import Toast from '../../dist/toast/toast';
var app = getApp()
var service = require('../../utils/util.js')
var pathUrl = app.globalData.pathUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'',
    intro:'',
    bu:1,
    shiqing:'',
    id:'',
    date:''
  },
  shiqing:function(e){
    var _this = this
    console.log(e.detail);
    _this.setData({
      shiqing: e.detail
    })
    console.log(this.data.shiqing)
  },
  bujinqi:function(e){
    var _this = this
    console.log(e.detail);
    _this.setData({
      bu:e.detail
    })
    console.log(this.data.bu)

  },
  formSubmit: function (e) {
    var _this = this;

    // var date = new Date();
    // var year = date.getFullYear();
    // var month = date.getMonth() + 1;
    // var day = date.getDate();
    // if (month < 10) {
    //   month = "0" + month;
    // }
    // if (day < 10) {
    //   day = "0" + day;
    // }
    // var nowdata = year + "-" + month + "-" + day;
    var nowdata = wx.getStorageSync('nowdate');
    var id = _this.data.id;
    var shiqing = _this.data.shiqing;
    var bu = _this.data.bu;
    console.log('form发生了submit事件，携带数据为：', e.detail.value)

    var url = pathUrl + '/addtongji';
    service.http(url, {nowdata: nowdata,id: id,bu: bu,shiqing: shiqing}, function (data) {
      var data = data.data;
      console.log(data)
      // if (data.err_code == '000') {
      //   that.setData({
      //     info: data.data,

      //   })
      // } else {
      //   wx.showToast({ title: data.err_msg });
      // }
      if (data.err_code == '000') {
        console.log('1')
        Toast('添加成功-进入统计里查看');
      } else {
        console.log('0')
        Toast('添加失败-请重试');
      }
    }, function (data) {
      wx.showToast({ title: '网络故障,请重新打开' });
      console.log(data);
    })

    // wx.request({
    //   url: 'https://www.easy-mock.com/mock/5be42c3b6d38dd2824b552e6/example/id',
    //   method: 'post',
    //   data: {
    //     nowdata:nowdata,
    //     id: id,
    //     bu:bu,
    //     shiqing: shiqing
    //   }, success: function (e) {
    //     if(e.statusCode == 200){
    //       console.log('1')
    //       Toast('添加成功-进入统计里查看');
    //     }else{
    //       console.log('0')
    //       Toast('添加失败-请重试');
    //     }
    //     //console.log(e)
    //    // that.toAsktime();
    //   }
    // })
  },
  formReset: function () {
    console.log('form发生了reset事件')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    console.log(options)
    _this.setData({
      id: options.id
    })
    if(options.id == 1){
      this.setData({
        title:'1.	对他人说谎',
        intro: '举例：妈妈说：功课做完了才能够去玩。你怎么已经在玩了？回答：做完了。举例：妈妈说：洗完手才能吃饭。你洗手了没？回答：洗过了（其实没洗）。举例：朋友邀我出去聊聊，我其实懒得出门，于是回答：哎，我工作很忙啊。实在没时间。'
          });
    
    } else if (options.id == 2) {
      this.setData({
        title: '2.	对自己内心说谎',
        intro: '举例：老师说：想选班长的请举手。自己心里想选，但是又不好意思，所以就不举手。举例：其实心里很渴望转入名校就读，可是自己又不够努力读书、转学，反而告诉自己跟旁人：我现在这个学校也不错了。我不想转学了。举例：明明很清楚地自己拿了一个不该拿的钱或东西，反而告诉自己：这个是我该拿的，没有问题。'
      });
       } else if (options.id == 3) {
      this.setData({
        title: '3.	无法真诚道歉',
        intro: '举例：跟同学吵架、打架，老师要我互相道歉，嘴巴大声说：对不起。其实心里心不甘情不愿。举例：是为了息事宁人才去道歉，其实心里面只想去应付应付，而不是真诚道歉。'
      });

    } else if (options.id == 4) {
      this.setData({
        title: '4.	把自己的行为正当化（强辩自己是正确的，为自己辩解）',
        intro: '举例：明明知道自己也有不对的地方，却要强辩找一堆理由来证明自己是对的。唬弄他举例：糊弄小孩、朋友，“如果你不听我的，你就会有。。。不良的后果”举例：对同事、下属，夸大事情的严重性，唬弄他们，“如果没有如期达成，这结果会。。。非常严重”。'
      });
    } else if (options.id == 5) {
      this.setData({
        title: '5.	找借口',
        intro: '举例：明明自己迟到，却怪今天特别堵车、出租车不好搭。举例：明明自己工作没有依照计划完成，却将理由归咎于别的单位没有配合好。'
      });
    } else if (options.id == 6) {
      this.setData({
        title: '6.	将自己犯过的错推给别人',
        intro: '举例：明明自己工作没有依照计划完成，却将理由归咎于别的单位没有配合好。举例：在工作上，检讨某件事情的过失时，我们最先的反应常常是：“不是我。。。”'
      });
    } else if (options.id == 7) {
      this.setData({
        title: '7.	不守承诺（不守约）',
        intro: '举例：答应单位在一定的时间之内要完成某件工作，结果没有完成。（在这件不守承诺上，7，也许我们会找一个借口，5，来为自己解释，4，同时把责任推给别6，对自己无法信守承诺上又无法真诚的道歉，3，随便口头道歉了事。）'
      });
    } else if (options.id == 8) {
      this.setData({
        title: '8.	虚荣',
        intro: '举例：苏太太跟大家分享：“我一直以为自己不买名牌包包，不穿名牌衣服，自己很不虚荣。后来发觉自己很得意自己儿子读的是名校，实际是用自己儿子读名校来满足自己的虚荣心却不自知。”自吹自雷（吹牛）举例：有时为了面子夸大事实。显摆，炫耀举例：（很多是自己不知道的情况下而展现的行为）装作知道，装作不知道举例：其实自己不知道，却装作知道，自吹自擂（吹牛）。举例：装作不知道，其实是刻意得要展现。 '
      });
    } else if (options.id == 9) {
      this.setData({
        title: '9.	隐藏自己的实力（特意过低的展现自己）',
        intro: '举例：明明自己有能力承担，但由于自己的自私、冷漠，不愿承担。夸大自己的实力（特意过高的展现自己）举例：明明自己没有这个能力，没有这个本事，却要令人相信自己有这个实力。 '
      });
    } else if (options.id == 10) {
      this.setData({
        title: '10.	错误理解别人的好意而从而产生忌恨或对忌恨自己的人同样产生忌恨。',
        intro: '举例：别人给自己一个建议，自己却把它当成别人在批评自己。忠言逆耳，自己把忠言当成逆耳的批评之言，而产生了忌恨。举例：别人因误会而忌恨自己，自己不但没有设法去化解误会，反而忌恨别人。  本来是自己的错反倒反咬一口举例：恶人先告状。'
      });
    } else if (options.id == 11) {
      this.setData({
        title: '11.	暗地里，背地里做事',
        intro: '举例：有些事情自己不愿意公开，怕被人知道，就暗地里悄悄做。'
      });
    } else if (options.id == 12) {
      this.setData({
        title: '12.	把别人的秘密说出去',
        intro: ''
      });
    } else if (options.id == 13) {
      this.setData({
        title: '13.	嫉妒',
        intro: ''
      });
    } else if (options.id == 14) {
      this.setData({
        title: '14.	迁怒于人',
        intro: '举例：挑软柿子吃。老婆骂了我，我没发出气，转而骂找小孩的麻烦。举例：领导批评了我，我只能忍气吞声，回到自己单位给自己的部属脸色。'
      });
    } else if (options.id == 15) {
      this.setData({
        title: '15.	偷东西',
        intro: '举例：顺手就摘了令居家院子果树上的水果，还挺得意地跟小朋友们分享。举例：不经意的拿了或用了别人的东西，不告而取有借无还举例：过了好久，发觉书架上有一本书还没换给同学。浪费（金钱，物品，资源）举例：吃东西，不吃完，多了都浪费了；水龙头老开着浪费水资源。'
      });
    } else if (options.id == 16) {
      this.setData({
        title: '16.	占用别人得时间（自己可以做的事情让别人帮着做）',
        intro: '举例：“妈妈帮我倒一杯水”举例：在工作单位推说自己忙，请领导或属下或同事来处理本来自己可以做的事。破坏现场的气氛（泼冷水）举例：有时候自己太随性了，情绪管理不良，使得在不当的场合或不当的时间。。。迟到举例：让一大堆人等自己，占用别人的时间。让别人听到自己得唠叨，牢骚（很长的电话）举例：有时候自己发个讯息给朋友，朋友没有及时回还会生气。'
      });
    } else if (options.id == 17) {
      this.setData({
        title: '17.	剥夺别人的自由',
        intro: '举例：自己出差、度假，请爸妈照顾自己的小孩或宠物。举例：在工作上，因为自己的原因，需要属下、同事来加班完成。'
      });
    } else if (options.id == 18) {
      this.setData({
        title: '18.	逃票（不买票，或者买短程票而成乘长程）',
        intro: '举例：小时候进电影院、乘公车，能逃票反而挺开心的。'
      });
    } else if (options.id == 19) {
      this.setData({
        title: '19.	伤害他人的心，欺负他人',
        intro: '举例：没有站在他人的立场着想，而有意或无意地伤害到他人。无视他人的存在举例：上课时间看别的书。举例：工作开会时，人坐在那儿开会，却自己在查看e-mail，电脑讯息… 完全无视、不尊重会议主持人及其他参加的人。'
      });
    } else if (options.id == 20) {
      this.setData({
        title: '20.	自己作弊，帮助他人作弊 ',
        intro: '举例：当学生时，能帮别人作弊还得意洋洋。'
      });
    } else if (options.id == 21) {
      this.setData({
        title: '21.	开小差（趁他人不注意做自己的事情）',
        intro: '举例：当学生上课时、在职场上开会时，经常发生而自己却习以为常。玩弄他人的感情举例：利用别人的真心好意，而达到自己的利益。利用他人的真心（善意）举例：小孩子时常用撒娇达到目的，但成人呢？'
      });
    } else if (options.id == 22) {
      this.setData({
        title: '22.	偷听',
        intro: '举例：爸爸妈妈越不让小孩知道的事情小孩越想知道。偷看 举例：越标明“机密”，“极机密”的资料大伙儿约想知道'
      });
    } else if (options.id == 23) {
      this.setData({
        title: '23.	把公司的电话（邮件）用作私用 ',
        intro: '举例：这些都是习以为常，认为是正当行为了。'+
'把公司的办公用品带回家'+
'举例：回家加班的情况越来越普遍了，但很可能没有注意到。很多公司的办公用品却一直留在家里。'+
        '工作时间做私事'+
'举例：上班聊天、上电脑、上网购物。。。都习以为常了。'
      });
    } else if (options.id == 24) {
      this.setData({
        title: '24.	逃课 ',
        intro: '举例：让别人代替点名'
      });
    }else{

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