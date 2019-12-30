// component/repair/repair.js
const app = getApp()
const util = require('../../utils/util.js')
const promise = require('../../utils/promise.js')
const showModal = promise.showModal
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 图片列表
    photoList: {
      type: Array,
      value: []
    },
    // 上传最大个数
    photoMax: {
      type: Number,
      value: 9
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _cssImg: app.globalData.cssImg,
    _step: 1
  },

  lifetimes: {
    attached: function () {
      // console.log('attached')
    },
    moved: function () {
      // console.log('moved')
    },
    detached: function () {
      // console.log('detached')
    },
  },

  ready: function () {
    // console.log('ready')
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close: function () {
      // console.log('photo component close执行')
      this.triggerEvent('close', {}, { bubbles: true, composed: true })
    },
    tapCamera: function () {
      this._takePhoto(['camera'])
    },
    tapAlbum: function () {
      this._takePhoto(['album'])
    },
    tapPhoto: function () {
      this._takePhoto(['camera', 'album'])
    },
    removePhoto: function (e) {
      const that = this
      let index = e.currentTarget.dataset.idx;
      showModal({
        title: '提示',
        content: '删除这张图片',
        showCancel: true
      })
        .then((res) => {
          if (res.confirm) {
            that.data.photoList.splice(index, 1);
            let photoList = that.data.photoList;
            that.setData({
              photoList: photoList
            })
          }
        })

    },
    submit: function () {
      this.triggerEvent('submit', { photos: this.data.photoList }, { bubbles: true })
      this.close()
      this.setData({
        _step: 1,
        photoList: []
      })
    },
    _takePhoto: function (types) {
      let that = this
      let photoMax = this.data.photoMax - this.data.photoList.length
      wx.chooseImage({
        count: photoMax,
        sizeType: ['original', 'compressed'],
        sourceType: types,
        success: function (res) {
          let photoList = []
          let tempFilePaths = res.tempFilePaths
          photoList = photoList.concat(that.data.photoList, tempFilePaths)

          that.setData({
            photoList: photoList
          })

          if (types.length === 1) {
            that._nextStep()
          }
        }
      })
    },
    _nextStep: function () {
      let _step = ++this.data._step
      this.setData({
        _step: _step
      })
    },
    _prevStep: function () {
      let _step = --this.data._step
      this.setData({
        _step: _step
      })
    }
  }
})
