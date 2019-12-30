// pages/repair/repair.js
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
    roleId:'',
    winheight: 0,
    cssImg: app.globalData.cssImg,
    Status: 6,
    PageIndex: 1,
    PageSize: 10,
    canReachBottom: true,
    rows: [],
    xcRows:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.setWinHeight(this)
    util.setTitle('查看工单')
    this._GetWorkSheetByStatus(this.data)
    this.setData({
      roleId: app.globalData.RoleId
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
    let opts = {
      PageIndex: 1
    }
    this.setData({
      PageIndex: opts.PageIndex,
      canReachBottom: true
    })
    this._GetWorkSheetByStatus(opts)
    console.log('下拉刷新')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let PageIndex = this.data.PageIndex + 1
    let opts = {
      PageIndex: PageIndex
    }
    if(this.data.canReachBottom) {
      this.setData({
        PageIndex: opts.PageIndex
      })
      this._GetWorkSheetByStatus(opts)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  goDetails(e) {
    console.log(e)
    const page = e.currentTarget.dataset.page;
    const workSheetId = e.currentTarget.dataset.sheetId
    util.navigateTo(page, "workSheetId=" + workSheetId)
  },
  closeOrder: function (e) {
    console.log(e)
    console.log(this.data.xcRows)
    const that = this
    let xcRows = this.data.xcRows
    let rows = this.data.rows
    let data = {
      worksheetId: e.target.dataset.sheetId
    }
    xcRows[e.target.dataset.orderIndex]['WorkSheetType'] = "已关闭"
    rows[e.target.dataset.orderIndex]['WorkSheetType'] = "已关闭"
    api.CloseWorkSheet({ method: 'POST', data: data })
      .then((res) => {
        if (res.data.IsSuccess) {
          console.log('关闭工单成功')
          that.setData({
            xcRows: xcRows,
            rows:rows
          })
        }
      })
      .catch((res) => {
        console.log('修改状态失败')
      })
  },
  /**
   * 去处理
   */
  goDetails(e) {
    console.log(e)
    const page = e.currentTarget.dataset.page;
    const workSheetId = e.currentTarget.dataset.sheetId
    util.navigateTo(page, "workSheetId=" + workSheetId)
  },
  _GetWorkSheetByStatus: function(opts) {
    const that = this
    let data = {}
    let data1 = {}
    let RoleId=null
    //2 后台定义未关闭
    //4 后台定义未维修
    data.Status = 4;
    data.PageIndex = opts.PageIndex;
    data.PageSize = this.data.PageSize;
    data.Fixer = app.globalData.UserId;
    data1.PageIndex = opts.PageIndex;
    data1.PageSize = this.data.PageSize;
    console.log(JSON.stringify(data))
    console.log(JSON.stringify(data1))
    api.GetWorkSheetByStatus({ method: 'GET', data: data}).then((res) => {
      let rows
      if(res.data.Data.rows.length === 0){
        that.setData({
          canReachBottom: false
        })
        showLoading({
          title: '无更多数据...'
        })
      } else {
        showLoading({
          title: '获取数据中...'
        })
      }
      if(data.PageIndex === 1){
        rows = []
        rows = rows.concat(res.data.Data.rows)
        that.setData({
          rows: rows
        })
        stopPullDownRefresh()
      }else {
        rows = this.data.rows
        rows = rows.concat(res.data.Data.rows)
        that.setData({
          rows: rows
        })
      }
      setTimeout(function(){
        hideLoading()
      },500)
      data.Status = 2;
        api.GetWorkSheetByStatus({ method: 'GET', data: data }).then((res) => {
          let rows
          if (res.data.Data.rows.length === 0) {
            that.setData({
              canReachBottom: false
            })
            showLoading({
              title: '无更多数据...'
            })
          } else {
            showLoading({
              title: '获取数据中...'
            })
          }

          for (let i of res.data.Data.rows ){
            if (app.globalData.UserId === i.CreateUserId) {
              rows = this.data.rows
              rows = rows.concat(res.data.Data.rows)
              that.setData({
                rows: rows
              })
            }
          }
          
          setTimeout(function () {
            hideLoading()
          }, 500)

        })
          .catch((res) => {
            that.setData({
              canReachBottom: false
            })
            console.log('获取数据失败')
          })
      
      
    })
    .catch((res) => {
      that.setData({
        canReachBottom: false
      })
      console.log('获取数据失败')
    })
    
   
      api.GetWorkSheetByFQR({ method: 'GET', data: data1 }).then((res) => {
        let xcRows
        let rows
        if (res.data.Data.rows.length === 0) {
          that.setData({
            canReachBottom: false
          })
          showLoading({
            title: '无更多数据...'
          })
        } else {
          showLoading({
            title: '获取数据中...'
          })
        }
        if (data1.PageIndex === 1) {
          xcRows = []
          rows =[]
          xcRows = xcRows.concat(res.data.Data.rows)
          rows = rows.concat(res.data.Data.rows)
          that.setData({
            xcRows: xcRows,
            rows: rows
          })
          stopPullDownRefresh()
        } else {
          xcRows = this.data.xcRows
          rows = this.data.rows
          xcRows = xcRows.concat(res.data.Data.rows)
          rows = rows.concat(res.data.Data.rows)
          that.setData({
            xcRows: xcRows,
            rows: rows
          })
        }
        console.log(this.data)
        setTimeout(function () {
          hideLoading()
        }, 500)
      })
    
    
    
  }
})