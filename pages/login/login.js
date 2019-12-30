// pages/login/login.js
const app = getApp()
const util = require('../../utils/util.js')
const api = require('../../utils/api.js')
const promise = require('../../utils/promise.js')
const showToast = promise.showToast
const showModal = promise.showModal
const getStorage = promise.getStorage
const setStorage = promise.setStorage
const redirectTo = promise.redirectTo
const getUserInfo = promise.getUserInfo
const authorize = promise.authorize
const getSetting = promise.getSetting
const login = promise.login
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winheight: 0,
    cssImg: app.globalData.cssImg,
    // title: '象州东服务区智慧公厕'
    title: '智慧厕所@服务互动系统'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.setWinHeight(this)

    getStorage({ key: 'Login'})
    .then((res) => {
      console.log('有用户信息开始自动登录')
      console.log(res.data)
      showToast({
        title: '自动登录',
        icon: 'loading'
      })
      this._login(res.data);
    
    })
    .catch((res) => {
      console.log('请输入账号密码登录')
    })

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

  },
  _login: function(data) {
    const that = this;
    var userData = data;

    // 微信登录
    // login()
    // .then((res) => {
    //   console.log('login:' + JSON.stringify(res))
    //   return getSetting()
    // })
    // .then((res) => {
    //   console.log(res)
    //   if (!res.authSetting['scope.userInfo']) {
    //     return authorize({ scope: 'scope.userInfo' })
    //   }
    // })
    // .then((res) => {
    //   return getUserInfo({
    //     withCredentials: true,
    //     lang: 'zh_CN'
    //   })
    // })
    // .then((res) => {
    //   var userInfo = res.userInfo
    //   var nickName = userInfo.nickName
    //   var openId = userInfo.openId
    //   var unionId = userInfo.unionId

    //   userData.nickName = nickName
    //   userData.openId = openId
    //   userData.unionId = unionId
    //   console.log(userInfo)
    //   console.log(userData)

    //   return api.Login({data: userData, method: 'POST', withOutToken: true})
    // })
    // .then((res) => {
    //   if(!res.data.IsSuccess) {
    //     showModal({
    //       title: res.data.Msg,
    //       showCancel: false
    //     })
    //     return false
    //   }
    //   let RoleId = res.data.Data.RoleId;
    //   let Token = res.data.Data.Token;
    //   let Role = {
    //     role1: 'cheaner', // 清洁工
    //     role2: 'repair', // 修理工
    //     role3: 'leader' // 领班
    //   }

    //   // 存角色
    //   setStorage({key: 'Role', data: Role['role' + RoleId]})
    //     .then((res) => {
    //       console.log('保存角色成功')
    //       return setStorage({key: 'Login', data: userData})
    //     })
    //     .then((res) => {
    //       console.log('保存用户信息成功')
    //       return setStorage({key: 'Token', data: Token})
    //     })
    //     .then((res) => {
    //       console.log('保存token成功')
    //       return redirectTo({url: '/pages/home/home' })
    //     })
    //     .then((res) => {
    //       console.log('登录跳转成功')
    //     })
    //     .catch((res) => {
    //       console.log('失败' + JSON.stringify(res))
    //     })

    // })
    // .catch((res) => {

    // })

   
    api.Login({data: userData, method: 'POST', withOutToken: true}).then((res) => {
      if(!res.data.IsSuccess) {
        showModal({
          title: res.data.Msg,
          showCancel: false
        })
        return false
      }
      let UserId = res.data.Data.UserId
      let RoleId = res.data.Data.RoleId;
      let Token = res.data.Data.Token;
      app.globalData.ToiletId = res.data.Data.ToiletId;
      app.globalData.UserId = res.data.Data.UserId;
      app.globalData.RoleId = res.data.Data.RoleId;
      let Role = {
        role1: 'cheaner', // 清洁工
        role2: 'repair', // 修理工
        role3: 'leader' // 领班
      }

      if (Role['role' + RoleId] === undefined) {
        showModal({
          title: "该用户没有权限",
          showCancel: false
        })
        return false;
      }

      // 存角色
      setStorage({key: 'Role', data: Role['role' + RoleId]})
        .then((res) => {
          console.log('保存角色成功')
          return setStorage({key: 'Login', data: userData})
        })
        .then((res) => {
          console.log('保存用户信息成功')
          return setStorage({key: 'Token', data: Token})
        })
        .then((res) => {
          console.log('保存token成功')
          return redirectTo({url: '/pages/home/home' })
        })
        .then((res) => {
          console.log('登录跳转成功')
        })
        .catch((res) => {
          console.log('失败' + JSON.stringify(res))
        })

    }).catch((res) => {
    })
  },
  formSubmit: function(e){
    console.log(e)
    const that = this
    const data = { 'UserName': e.detail.value.UserName, 'PassWord': e.detail.value.PassWord }
    if( e.detail.value.UserName !== '' && e.detail.value.PassWord !== '') {
      this._login(data)
    } else {
      showModal({
        title: "请输入账号密码",
        showCancel: false
      })
    }
  }
})