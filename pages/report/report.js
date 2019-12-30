// pages/report/report.js
const app = getApp()
const util = require('../../utils/util.js')
const api = require('../../utils/api.js')
const promise = require('../../utils/promise.js')
const showModal = promise.showModal
const navigateBack = promise.navigateBack
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winheight: 0,
    cssImg: app.globalData.cssImg,
    ToiletName:'',
    workSheetId: '',
    ReportTime: '',
    RegionName: '',
    ReportContent: '',
    RepairTime: '',
    RepairUser: '',
    RepairOpinion: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.setWinHeight(this)
    util.setTitle('维修报告')
    this.setData({
      workSheetId: options.workSheetId
    })
    // console.log(options.workSheetId)
    this._GetRepairRecord(options.workSheetId)
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
   * 添加新的备注
   */
  add: function(e) {
    let new_remark
    new_remark = this.data.RepairOpinion
    if(new_remark[new_remark.length - 1] === '') {
      return false
    }
    new_remark.push('')
    this.setData({
      RepairOpinion: new_remark
    })
  },
  submitRepairRecord: function(){
    this._UpdateRepairRecord()
  },
  finishBtn: function() {
    this._AuditedWorkSheet()
  },
  reset: function() {
    let index = this.data.RepairOpinion.length - 1
    let RepairOpinion = this.data.RepairOpinion
    RepairOpinion[index] = ''
    this.setData({
      RepairOpinion: RepairOpinion
    })
  },
  eventInput: function(e){
    let index = e.currentTarget.dataset.idx;
    let v = e.detail.value
    let RepairOpinion = this.data.RepairOpinion
    RepairOpinion[index] = v
    this.setData({
      RepairOpinion: RepairOpinion
    })
  },
  _GetRepairRecord: function(workSheetId){
    const that = this
    let data = {
      workSheetId: workSheetId
    }
    api.GetRepairRecord({ method: 'GET', data: data}).then((res) => {
      let RepairOpinion = ['']
      if(res.data.IsSuccess){
        // res.data.Data.RepairOpinion = ['哈哈','嘿嘿']
        RepairOpinion = res.data.Data.RepairOpinion.concat(RepairOpinion)
        that.setData({
          ReportTime: res.data.Data.ReportTime,
          RegionName: res.data.Data.RegionName,
          ReportContent: res.data.Data.ReportContent,
          RepairTime: res.data.Data.ReportTime,
          RepairUser: res.data.Data.RepairUser,
          RepairOpinion: RepairOpinion,
          ToiletName: res.data.Data.ToiletName
        })
      }
    })
  },
  _UpdateRepairRecord: function(){
    const that = this
    let data = {
      WorkSheetId: this.data.workSheetId,
      RepairOption: this.data.RepairOpinion
    }
    api.UpdateRepairRecord({ method: 'POST', data: data}).then((res) => {
      if(res.data.IsSuccess){
        showModal({
          title: res.data.Msg,
          showCancel: false
        })
        .then((res) => {
          navigateBack({
            delta: 1
          })
        })
        .catch((res) => {
        })
      }
    })
  },
  _AuditedWorkSheet: function(){
    const that = this
    let data = {
      worksheetId: this.data.workSheetId
    }
    api.AuditedWorkSheet({ method: 'POST', data: data}).then((res) => {
      if(res.data.IsSuccess){
        showModal({
          title: res.data.Msg,
          showCancel: false
        })
        .then((res) => {
          navigateBack({
            delta: 1
          })
        })
        .catch((res) => {
        })
      }
    })
  }
})