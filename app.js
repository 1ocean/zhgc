// app.js
const api = require('./utils/api.js')
const promise = require('./utils/promise.js')
const config = require('./utils/config.js')
App({
  onLaunch: function () {
    const that = this

    // 拼接css图片url
    const imgKeys = Object.keys(this.globalData.cssImg)
    imgKeys.map((item, index) => {
      this.globalData.cssImg[item] = this.globalData.imgHost + this.globalData.cssImg[item]
    })

  },
  globalData: {
    // 图片服务器图片目录地址
    imgHost: config.host + '/resources/images/',
    ToiletId:null,
    UserId:null,
    RoleId:null,
    cssImg: {
      bg: 'bg.jpg',
      user: 'zhanhao.png',
      mima: 'mima.png',
      logo: 'logo.png',
      baoxiu: 'icon4.png',
      daka: 'icon2.png',
      shebei: 'icon3.png',
      weixiu: 'icon4.png',
      yujing: 'icon5.png',
      dasao: 'dasao2.png',
      over: 'over.png',
      photo: 'paizhao2.png',
      star: 'star.png',
      caozuo: 'caozuo.png',
      wenjian: 'wendan.png',
      bianji: 'bianji.png',
      add: 'add.png',
      paizhao3: 'paizhao3.png',
      close: 'close.png',
      jia: 'jia.png',
      a: 'a.png',
      default: ''
    },
    // imgHost: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/',
    // cssImg: {
    //   bg: 'u=2275057878,1986477577&fm=26&gp=0.jpg'
    // },
    userInfo: null
  }
})