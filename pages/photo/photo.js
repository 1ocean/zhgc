// pages/photo/photo.js
const app = getApp()
const util = require('../../utils/util.js')
const api = require('../../utils/api.js')
const promise = require('../../utils/promise.js')
const showModal = promise.showModal;
const showLoading = promise.showLoading;
const hideLoading = promise.hideLoading;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    toilet:'',
    toilets:[],
    toiletArea:null,
    toiletId:'',
    winheight: 0,
    cssImg: app.globalData.cssImg,
    show: false,
    area: '',
    damage: '',
    damageName: '',
    photos: [],
    areas: [], // 厕所区域
    damages: [], // 损坏内容
    WorkSheetId: '' // GUID
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.setWinHeight(this)
    util.setTitle('一键报修')
    api.GetToilets({
      method: 'GET',
    }).then((res) => {
      console.log(res.data.Data)
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
  onReady: function () {
    this._GetTolietArea()
    this._GetDamageContent()
    this._CreateGuid()
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
   * 选择器
   */
  bindAreaPickerChange: function (e) {
    this.setData({
      area: e.detail.value
    })
    // console.log(e)
    // console.log(this.data)
  },
  bindDamagePickerChange: function (e) {
    let _damageName = this.data.damages[e.detail.value - 0]['Name'];
    this.setData({
      damage: e.detail.value,
      damageName: _damageName
    })
    // console.log(e)
    // console.log(this.data)
  },
  /**
   * 拍照
   */
  chooseImage: function (e) {
    this.setData({
      show: true
    })
  },
  /**
   * 重置遮罩
   */
  resetMask: function () {
    this.setData({
      show: false,
      uploadTag: true,
      photolistTag: false
    })
  },
  /**
   * 隐藏遮罩
   */
  close: function () {
    // console.log('photo page close执行')
    this.setData({
      show: false
    })
  },
  /**
   * 显示照片列表
   */
  showPhotoList: function () {
    this.setData({
      uploadTag: false,
      photolistTag: true
    })
  },
  // 厕所选择事件
  bindToiletPickerChange(e) {
    this.setData({
      toilet: e.detail.value,
      toiletArea: parseInt(e.detail.value),
      toiletId: this.data.toilets[e.detail.value]
    })
    let array = [];
    array.push(this.data.toilets[e.detail.value].Id)
    let ID = { ToiletIds: array }
  },
  /**
   * 立即报修
   */
  submit: function (e) {
    let data = {}
    this.setData({
      photos: e.detail.photos
    })
    if (this.data.area !== '') {
      data.RegionId = this.data.areas[this.data.area]['RegionId']
    } else {
      data.RegionId = ''
    }
    data.ReportContent = this.data.damageName
    if (this.data.damage !== '') {
      data.ReportId = this.data.damages[this.data.damage]['Id']
    } else {
      data.ReportId = ''
    }
    data.PicUrl = this.data.photos
    data.WorkSheetId = this.data.WorkSheetId
    this._CreateWorkSheet(data)
  },
  // 获取损坏内容类型
  _GetDamageContent: function () {
    const that = this
    // 获取损坏内容类型
    api.GetDamageContent({ method: 'GET' }).then((res) => {
      that.setData({
        damages: res.data.Data
      })
    }).catch((res) => {
      console.log('获取损坏内容类型失败')
    })
  },
  _GetTolietArea: function () {
    const that = this
    // 获取厕所区域
    api.GetTolietArea({ method: 'GET' }).then((res) => {
      that.setData({
        areas: res.data.Data
      })
    }).catch((res) => {
      console.log('获取厕所区域失败')
    })
  },
  // 立即报修方法
  _CreateWorkSheet: function (data) {
    const that = this
    let formData = {};
    let count = 0;
    let filePath;
    formData.toiletId = this.data.toiletId.Id
    formData.RegionId = data.RegionId
    formData.ReportContent = data.ReportContent
    formData.ReportId = data.ReportId
    formData.WorkSheetId = data.WorkSheetId
    console.log(JSON.stringify(data))
    if (this.data.toiletId === '') {
      showModal({
        title: "请选择报修厕所",
        showCancel: false
      })
      return false
    }
    if (data.RegionId === '') {
      showModal({
        title: "请选择报修区域",
        showCancel: false
      })
      return false
    }
    if (data.ReportContent === '') {
      showModal({
        title: "请选择报修项目",
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
    showLoading({
      title: '图片上传中...'
    })

    function upload() {
      console.log(data.PicUrl[count])
      api.CreateWorkSheet({ method: 'POST', filePath: data.PicUrl[count], name: 'file', formData: formData }).then((res) => {
        let _res = JSON.parse(res.data)
        count++;
        console.log('第' + count + '次上传');
        if (_res.IsSuccess) {
          console.log(count + '张,上传成功')
        }
        if (data.PicUrl.length === count && _res.IsSuccess) {
          console.log('上传成功,清除数据')
          hideLoading()
          that._CreateGuid()
          that.setData({
            photos: [],
            area: '',
            damage: '',
            damageName: ''
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
  // 获取GUID
  _CreateGuid: function () {
    const that = this
    // 获取GUID
    api.CreateGuid({ method: 'GET' }).then((res) => {
      that.setData({
        WorkSheetId: res.data.Data
      })
    }).catch((res) => {
      console.log('获取GUID失败')
    })
  }
})