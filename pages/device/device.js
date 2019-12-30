// pages/device/device.js
const app = getApp()
const util = require('../../utils/util.js')
const api = require('../../utils/api.js')
const promise = require('../../utils/promise.js')
const stopPullDownRefresh = promise.stopPullDownRefresh
const showLoading = promise.showLoading;
const hideLoading = promise.hideLoading;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winheight: 0,
    cssImg: app.globalData.cssImg,
    scrollheight: 0,
    tapStatus: 'no',
    Page: {
      no: { // 未维修
        PageIndex: 1,
        Status: 4,
        PageSize: 10,
        canReachBottom: true,
        rows: []
      },
      doing: { // 正在维修
        PageIndex: 1,
        Status: 5,
        PageSize: 10,
        canReachBottom: true,
        rows: []
      },
      finish: { // 已完成
        PageIndex: 1,
        Status: 1,
        PageSize: 10,
        canReachBottom: true,
        rows: []
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // util.setWinHeight(this)
    util.setTitle('设备维修')

    this._GetWorkSheetByStatus(this.data.tapStatus)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const that = this
    wx.createSelectorQuery().select('#table').boundingClientRect(function(rect){
      let height
      wx.getSystemInfo({
        success: function(res){
          height = res.windowHeight - 1.5*rect.top
          height = Math.floor(height / 80) * 80
          // console.log(height)
          that.setData({
            scrollheight: height
          })
        }
      })
    }).exec()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // console.log('onShow')
    this._GetWorkSheetByStatus(this.data.tapStatus)
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
   * 滚动到顶部触发
   */
  upper: function() {
    // console.log('滚动到顶部触发')
  },
  /**
   * 滚动到底部触发
   */
  lower: function() {
    const that = this
    let PageIndex = this.data.Page[this.data.tapStatus]['PageIndex'] + 1
    if(this.data.Page[this.data.tapStatus]['canReachBottom']) {
      if(this.data.tapStatus === 'no'){
        this.setData({
          'Page.no.PageIndex': PageIndex
        },function(){
          that._GetWorkSheetByStatus(that.data.tapStatus)
        })
      }
      if(this.data.tapStatus === 'doing'){
        this.setData({
          'Page.doing.PageIndex': PageIndex
        },function(){
          that._GetWorkSheetByStatus(that.data.tapStatus)
        })
      }
      if(this.data.tapStatus === 'finish'){
        this.setData({
          'Page.finish.PageIndex': PageIndex
        },function(){
          that._GetWorkSheetByStatus(that.data.tapStatus)
        })
      }
    }
    // console.log('滚动到底部触发')
  },
  /**
   * 滚动触发
   */
  scroll: function() {
    // console.log('滚动触发')
  },
  /**
   * 切换tab
   */
  tapTouch: function(e){
    const that = this
    // console.log(e)
    const status = e.currentTarget.dataset.status
    if(status === 'no'){
      this.setData({
        'Page.no.PageIndex': 1,
        'Page.no.canReachBottom': true,
        'Page.no.rows': []
      })
    }
    if(status === 'doing'){
      this.setData({
        'Page.doing.PageIndex': 1,
        'Page.doing.canReachBottom': true,
        'Page.doing.rows': []
      })
    }
    if(status === 'finish'){
      this.setData({
        'Page.finish.PageIndex': 1,
        'Page.finish.canReachBottom': true,
        'Page.finish.rows': []
      })
    }
    this.setData({
      tapStatus: status
    },function(){
      that._GetWorkSheetByStatus(status)
    })
  },
  /**
   * 点击按钮
   */
  tapHandle: function(e){
    const page = e.currentTarget.dataset.page
    const workSheetId = e.currentTarget.dataset.sheetId
    util.navigateTo(page, "workSheetId=" + workSheetId)
  },
  _GetWorkSheetByStatus: function(tapStatus) {
    const that = this
    let data = {}
    data.Status = this.data.Page[tapStatus]['Status'];
    data.PageIndex = this.data.Page[tapStatus]['PageIndex'];
    data.PageSize = this.data.Page[tapStatus]['PageSize'];
    // console.log("Status:" + this.data.Page[tapStatus]['Status'] + "    PageIndex:" + this.data.Page[tapStatus]['PageIndex'])
    api.GetWorkSheetByStatus({ method: 'GET', data: data}).then((res) => {
      let rows
      if(res.data.Data.rows.length === 0){
        if(tapStatus === 'no'){
          that.setData({
            'Page.no.canReachBottom': false
          })
        }
        if(tapStatus === 'doing'){
          that.setData({
            'Page.doing.canReachBottom': false
          })
        }
        if(tapStatus === 'finish'){
          that.setData({
            'Page.finish.canReachBottom': false
          })
        }
        showLoading({
          title: '无更多数据...'
        })
      } else {
        showLoading({
          title: '获取数据中...'
        })
      }
      if(this.data.Page[tapStatus]['PageIndex'] === 1){
        rows = []
        rows = rows.concat(res.data.Data.rows)
        if(tapStatus === 'no'){
          that.setData({
            'Page.no.rows': rows
          })
        }
        if(tapStatus === 'doing'){
          that.setData({
            'Page.doing.rows': rows
          })
        }
        if(tapStatus === 'finish'){
          that.setData({
            'Page.finish.rows': rows
          })
        }
        stopPullDownRefresh()
      }else {
        rows = this.data.Page[tapStatus]['rows']
        rows = rows.concat(res.data.Data.rows)
        if(tapStatus === 'no'){
          that.setData({
            'Page.no.rows': rows
          })
        }
        if(tapStatus === 'doing'){
          that.setData({
            'Page.doing.rows': rows
          })
        }
        if(tapStatus === 'finish'){
          that.setData({
            'Page.finish.rows': rows
          })
        }
      }
      setTimeout(function(){
        hideLoading()
      },500)
    })
    .catch((res) => {
      if(tapStatus === 'no'){
        that.setData({
          'Page.no.canReachBottom': false
        })
      }
      if(tapStatus === 'doing'){
        that.setData({
          'Page.doing.canReachBottom': false
        })
      }
      if(tapStatus === 'finish'){
        that.setData({
          'Page.finish.canReachBottom': false
        })
      }
      console.log('获取数据失败')
    })
  }
})