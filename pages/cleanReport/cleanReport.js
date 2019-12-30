// pages/cleanReport/cleanReport.js
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
    imgs:[],
    workSheetId:"",
    ReportStatus:"",
    RegionTime:"",
    ReportArea:"",
    RepairName:"",
    textArea:"",
    userTextArea:"",
    cleanPerson:"",
    cleanTime:"",
    ToiletName:""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      workSheetId: options.workSheetId
    })
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
  userTextAreaChange(e){
    this.setData({
      userTextArea:e.detail.value
    })
  },
  submitRepairRecord: function () {
    this._UpdateRepairRecord()
  },
  CloseWorkSheets(){
    let data ={
      worksheetId: this.data.workSheetId
    }
    api.CloseWorkSheet({method:'post',data:data}).then((res)=>{
      if (res.data.IsSuccess) {
        showModal({
          title: res.data.Msg,
          showCancel: false
        })
          .then((res) => {
            navigateBack({
              delta: 2
            })
          })
          .catch((res) => {
          })
      }
    })
  },
  _UpdateRepairRecord: function () {
    const that = this;
    const RepairOption=[];
    RepairOption.push(that.data.userTextArea)
    console.log(RepairOption)
    let data = {
      UserId: app.globalData.UserId,
      WorkSheetId: that.data.workSheetId,
      RepairOption: RepairOption
    }
    api.AuditedWorkSheet({ method: 'POST', data: data }).then((res) => {
      if (res.data.IsSuccess) {
        showModal({
          title: res.data.Msg,
          showCancel: false
        })
          .then((res) => {
            navigateBack({
              delta: 2
            })
          })
          .catch((res) => {
          })
      }
    })
  },
  _GetRepairRecord: function (workSheetId) {
    const that = this
    let data = {
      Id: workSheetId
    }
    api.GetWorkSheetInfoById({ method: 'POST', data: data }).then((res) => {
      let imgs = res.data.Data.WorkSheetPicInfo;
      let date = res.data.Data.ReportTime.split("T")[0]
      this.setData({
        ToiletName: res.data.Data.ToiletName,
        ReportStatus: res.data.Data.SheetStatusName,
        RegionTime: date,
        ReportArea: res.data.Data.RegionName,
        RepairName: res.data.Data.FixName,
        textArea: res.data.Data.EquipmentName,
        cleanPerson: res.data.Data.FixName,
        cleanTime: res.data.Data.ReportTime,
        imgs: imgs,
      })
    })
  },
})