// pages/home/home.js
const app = getApp()
const util = require('../../utils/util.js')
const promise = require('../../utils/promise.js')
const getStorage = promise.getStorage
const setStorage = promise.setStorage
const redirectTo = promise.redirectTo
const clearStorage = promise.clearStorage
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winheight: 0,
    cssImg: app.globalData.cssImg,
    role: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    util.setWinHeight(this)
    util.setTitle('日常工作')

    getStorage({key: 'Role'})
      .then((res) => {
        // that.setData({
        //   role: 'repair'
        // })
        that.setData({
          role: res.data
        })
        console.log('获取角色成功')
      })
      .catch((res) => {
        console.log('获取角色失败')
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
  /**
   * 点击按钮
   */
  tapHandle: function(e){
    const page = e.currentTarget.dataset.page
    util.navigateTo(page)
  },
  //退出登录
  exit:function(){
    wx.showLoading({ title: '退出登陆中' })
    clearStorage({ key: 'Login' })
      .then((res) => {
        console.log('退出成功')
      })
    redirectTo({ url: '../login/login' })
    wx.hideLoading()

    // Api.logout({ token: token }).then(data => {

    

    //   wx.removeStorageSync('token')
    //   refreshPageData()
    //   // wx.reLaunch({ url: "../login/login" })
    //   })
    
  }
})