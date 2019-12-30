// pages/cleanList/cleanList.js
const app = getApp();
const util = require('../../utils/util.js')
const api = require('../../utils/api.js')
const promise = require('../../utils/promise.js')
const showModal = promise.showModal;
const showLoading = promise.showLoading;
const hideLoading = promise.hideLoading;
const getStorage = promise.getStorage;
const navigateBack = promise.navigateBack
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 决定厕所选项展示哪个厕所
    toiletArea: null,
    // 总厕所
    toilets: [],
    // 当前厕所
    toilet: '',
    toiletId:'',
    // 工单ID
    CAWorkSheetId: '',
    Token: '',
    show: false,
    photos: [],
    textAreaData: '',
    disposePeopleId: '',
    area: "",
    RegionArea: "",
    areas: [{
        RegionId: 1,
        RegionName: "公用"
      },
      {
        RegionId: 2,
        RegionName: "女厕所"
      },
      {
        RegionId: 3,
        RegionName: "男厕所"
      }
    ],
    disposePeoples: [],
    disposePeople: "",
    tapStatus: 'order',
    cssImg: app.globalData.cssImg,
    uploadImgs: [],
    deleteUploadImgIndex: null,
    index: null,
    cycle: ['moumou', 'asdas', 'asdasds'],
    rows: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    util.setWinHeight(this)
    const that = this
    // 获取GUID
    api.CreateGuid({
      method: 'GET'
    }).then((res) => {
      that.setData({
        CAWorkSheetId: res.data.Data
      })
      console.log('获取GUID成功')
    }).catch((res) => {
      console.log('获取GUID失败')
    })
    this._GetWorkSheetByStatus(this.data)
    getStorage({
      key: 'Token'
    }).then(res => {
      this.setData({
        Token: res.data
      })
    });
    let formData = {};
    formData.ToiletIds = [];
    const ToiletIds = app.globalData.ToiletId;
    formData.ToiletIds.push(ToiletIds);
    api.GetToilets({
      method: 'GET',
    }).then((res) => {
      const obj = [];
      for (let i of res.data.Data) {
        obj.push(i)
      }
      this.setData({
        toilets: obj
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  bindTextAreaBlur(e) {
    console.log(e)
    this.setData({
      textAreaData: e.detail.value
    })
  },
  bindDisposePeoplePickerChange: function(e) {
    this.setData({
      disposePeople: e.detail.value,
      disposePeopleId: this.data.disposePeoples[e.detail.value]
    })
    console.log(this.data.disposePeopleId)
    // console.log(this.data)
  },
  bindAreaPickerChange: function(e) {

    this.setData({
      RegionArea: parseInt(e.detail.value),
      area: parseInt(e.detail.value) + 1
    })
    // console.log(e)
    // console.log(this.data)
  },
  // 厕所选择事件
  bindToiletPickerChange(e) {
    this.setData({
      toilet:e.detail.value,
      toiletArea: parseInt(e.detail.value),
      toiletId: this.data.toilets[e.detail.value]
    })
    let array =[];
    array.push(this.data.toilets[e.detail.value].Id)
    let ID = { ToiletIds: array }
    console.log(this.data.toiletId)
    api.GetHandleListByToiletID({
      method: 'POST',
      data: ID
    }).then((res) => {
      let obj1 = [];
      for (let i of res.data.Data){
        obj1.push({UserName: i.UserName, UserId: i.UserId})
      } 
      console.log(obj1)
        this.setData({
          disposePeoples: obj1
        })
    })
  },
  goDetails(e) {
    console.log(e)
    const page = e.currentTarget.dataset.page;
    const workSheetId = e.currentTarget.dataset.sheetId
    util.navigateTo(page, "workSheetId=" + workSheetId)
  },
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.RegionId
    })
  },
  showDetailImg(e) {
    console.log(e)
    this.setData({
      deleteUploadImgIndex: e.currentTarget.dataset.index,
    })
  },
  /**
   * 隐藏遮罩
   */
  close: function(e) {
    // console.log('photo page close执行')
    this.setData({
      show: false
    })
  },

  /**
   * 立即报修
   */
  submit: function(e) {
    this.setData({
      photos: e.detail.photos
    })
  },
  //提交工单
  submitAll() {
    let data = {};
    data.PicUrl = this.data.photos;
    this._CreateWorkSheet(data)
  },
  // 立即报修方法
  _CreateWorkSheet: function(data) {
    const that = this;
    let formData = {};
    let count = 0;
    let filePath;
    console.log(JSON.stringify(data))
    if (this.data.toiletId === '') {
      showModal({
        title: "请选择报修厕所",
        showCancel: false
      })
      return false
    }
    if (data.PicUrl.length === 0) {
      showModal({
        title: "请选择照片",
        showCancel: false
      })
      return false
    }
    if (this.data.area === "") {
      showModal({
        title: "请选择区域",
        showCancel: false
      })
      return false
    }
    if (this.data.disposePeopleId === "") {
      showModal({
        title: "请选择区域",
        showCancel: false
      })
      return false
    }
    showLoading({
      title: '图片上传中...'
    })
    // let ToiletId = app.globalData.ToiletId;
    let area = this.data.area;
    let UserId = app.globalData.UserId;
    let textAreaData = this.data.textAreaData;
    let Fixer = this.data.disposePeopleId.UserId;
    let toilet = this.data.toiletId.Id;
    formData.UserId = UserId;
    formData.ToiletId = toilet;
    formData.RegionId = area;
    formData.ReportContent = textAreaData;
    formData.Fixer = Fixer;
    // formData.PicUrl = data.PicUrl;
    formData.WorkSheetId = this.data.CAWorkSheetId;
    console.log(JSON.stringify(formData))

    function upload() {
      console.log(data.PicUrl[count])
      api.CreateCAWorkSheet({
        method: 'POST',
        filePath: data.PicUrl[count],
        name: 'file',
        formData: formData
      }).then((res) => {
        let _res = JSON.parse(res.data)
        count++;
        console.log('第' + count + '次上传');
        if (_res.IsSuccess) {
          console.log(count + '张,上传成功')
        }
        if (data.PicUrl.length === count && _res.IsSuccess) {
          console.log('上传成功,清除数据')
          hideLoading()
          that.setData({
            photos: [],
          })
          showModal({
            title: _res.Msg,
            showCancel: false
          })
        }

        if (data.PicUrl.length - 1 >= count) {
          upload();
        }
      }).catch((res) => {
        console.log('上传失败')
      })
    }

    upload()
  },
  _GetWorkSheetByStatus: function(opts) {
    const that = this
    let data = {}
    data.Status = 100;
    data.PageIndex = 1;
    data.PageSize = 99999;
    console.log(this.data.PageIndex)
    api.GetWorkSheetByStatus({
      method: 'GET',
      data: data
    }).then((res) => {
      const data = res.data.Data.rows;
      let rows = []
      for (let i of data) {
        const ReportTimes = i.ReportTime;
        const ReportContents = i.ReportContent;
        const WorkSheetId = i.WorkSheetId;
        rows.push({
          ReportTime: ReportTimes,
          ReportContent: ReportContents,
          WorkSheetId: WorkSheetId
        })
      }
      this.setData({
        rows
      })
    })
  },
  openCamera() {
    this.setData({
      show: true,
    })
  },
  tapTouch: function(e) {
    const that = this
    // console.log(e)
    const status = e.currentTarget.dataset.status
    if (status === 'order') {
      this.setData({
        'Page.no.PageIndex': 1,
        'Page.no.canReachBottom': true,
        'Page.no.rows': []
      })
    }
    if (status === 'list') {
      this.setData({
        'Page.doing.PageIndex': 1,
        'Page.doing.canReachBottom': true,
        'Page.doing.rows': []
      })
    }
    this.setData({
      tapStatus: status
    })
    // , function () {
    //   that._GetWorkSheetByStatus(status)
    // })
  },
})