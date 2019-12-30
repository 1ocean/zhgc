// pages/clock/clock.js
const app = getApp()
const util = require('../../utils/util.js')
const api = require('../../utils/api.js')
const promise = require('../../utils/promise.js')
const showModal = promise.showModal
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winheight: 0,
    status: 1,
    press: false, // 是否已经按了打扫
    end: false, // 结束打扫
    AttendanceId: '243434',
    cssImg: app.globalData.cssImg,
    timer: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    util.setWinHeight(this)
    util.setTitle('清洁打卡')

    console.log('页面加载')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this._AttendanceStatus()
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
   * 点击打卡
   */
  onPress: function() {
    if(!this.data.press) {
      this._changeStatus()
    }
  },
  _changeStatus: function(){
    let _status, data = {}, _AttendanceId
    _status = this.data.status
    _AttendanceId = this.data.AttendanceId
    if(this.data.status === 1) { // 当前初始状态
    }

    if(this.data.status === 2) { // 打扫中状态
      if (this.data.press !== false) {
        return false
      }
    }

    if(this.data.status === 3) {
    }

    data.AttendanceStatus = _status
    data.AttendanceId = _AttendanceId
    this._SignIn(data)
  },
  /**
   * 初始化状态
   */
  _cleanReset: function(){
    this.setData({
      press: false,
      end: false
    })
  },
  /**
   * 开始打扫状态
   */
  _cleanStart: function() {
    this.setData({
      press: true,
      end: false
    })
  },
  /**
   * 打扫中状态
   */
  _cleanOver: function() {
    this.setData({
      press: true,
      end: false
    })
  },
  /**
   * 可以结束打扫状态
   */
  _cleanEnd: function(data) {
    this.setData({
      press: false,
      end: true
    })
  },
  _cleanInit: function(data) {
    const that = this
    this.setData({
      status: data.Status
    })
    switch(data.Status) {
      // 可以按开始打扫
      case 1:
        console.log('开始打扫')
        that._cleanReset()
        break;
      // 打扫中不能按
      case 2:
        console.log('打扫中')
        that._cleanOver()
        // data.DateDiff = 5
        if (data.DateDiff !== 0) {
          setTimeout(function(){
            that._AttendanceStatus()
          }, data.DateDiff * 1000)
        }
        break;
      // 可以点击结束打扫
      case 3:
        console.log('可结束打扫')
        that._cleanEnd()
        break;
      // 规定时间内不能重复打扫
      case 4:
        console.log('规定时间内不能重复打扫')
        showModal({
          title: "规定时间内不能重复打扫",
          showCancel: false
        })
        break;
      default:
        break;
    }
  },
  /**
   * 获取考勤打卡状态
   */
  _AttendanceStatus: function() {
    const that = this
    const data = {}
    data.AttendanceId = this.data.AttendanceId
    api.AttendanceStatus({ method: 'GET', data: data}).then((res) => {
      that.setData({
        AttendanceId: res.data.Data.AttendanceId
      })
      that._cleanInit(res.data.Data)
      console.log(res)
    }).catch((res) => {
      console.log('获取打卡状态')
    })
  },
  _SignIn : function(data) {
    const that = this
    // let d = { Status: data.AttendanceStatus}
    // this._cleanInit(d)
    api.SignIn({ method: 'POST', data: data}).then((res) => {
      console.log(res)
      that._AttendanceStatus()
      // that._cleanInit(d)
    }).catch((res) => {
      console.log('提交打开')
    })
  },
})