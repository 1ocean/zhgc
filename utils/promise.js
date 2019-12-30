const utils = require('./util.js');
const wxPromise = utils.wxPromise;

// ajax
const request = (opts) => {
  let options = {};

  // 不需要token
  if (opts.withOutToken) {
    Object.assign(options, opts);
    return wxPromise(wx.request, options);
  } else {
    return getStorage({key: 'Token'}).then((res) => {
      options = {
        header: {
          "X-Token": res.data
        }
      }
      Object.assign(options, opts);
      return wxPromise(wx.request, options);
    }).catch((res)=>{
      Object.assign(options, opts);
      return wxPromise(wx.request, options);
      console.log('添加Token失败')
    })
  }
}

// 下拉刷新结束事件
const stopPullDownRefresh = (opts) => {
  return wxPromise(wx.stopPullDownRefresh, opts)
}

// 显示消息提示框
const showToast = (opts) => {
  return wxPromise(wx.showToast, opts)
}

// 显示模态对话框
const showModal = (opts) => {
  return wxPromise(wx.showModal, opts)
}

// 隐藏模态对话框
const hideToast = (opts) => {
  return wxPromise(wx.hideToast, opts)
}

// showLoading
const showLoading = (opts) => {
  return wxPromise(wx.showLoading, opts)
}

// hideLoading
const hideLoading = (opts) => {
  return wxPromise(wx.hideLoading, opts)
}

// 获取Storage
const getStorage = (opts) => {
  return wxPromise(wx.getStorage, opts)
}

// 设置Storage
const setStorage = (opts) => {
  return wxPromise(wx.setStorage, opts)
}
// 清楚Storage
const clearStorage = (opts) => {
  return wxPromise(wx.clearStorage, opts)
}

// 跳转
const redirectTo = (opts) => {
  return wxPromise(wx.redirectTo, opts)
}

// 返回上个页面
const navigateBack = (opts) => {
  return wxPromise(wx.navigateBack, opts)
}

// 获取用户信息
const getUserInfo = (opts) => {
  return wxPromise(wx.getUserInfo, opts)
}

// 授权
const authorize = (opts) => {
  return wxPromise(wx.authorize, opts)
}

// 获取授权信息
const getSetting = (opts) => {
  return wxPromise(wx.getSetting, opts)
}

// 登录
const login = (opts) => {
  return wxPromise(wx.login, opts)
}


// 上传文件
const uploadFile = (opts) => {
  let options = {};
  return getStorage({key: 'Token'}).then((res) => {
    options = {
      header: {
        "X-Token": res.data,
        "Content-Type": "multipart/form-data"
      }
    }
    Object.assign(options, opts);
    return wxPromise(wx.uploadFile, options);
  }).catch((res)=>{
    Object.assign(options, opts);
    return wxPromise(wx.uploadFile, options);
    console.log('添加Token失败')
  })
}

module.exports = {
  request: request,
  stopPullDownRefresh: stopPullDownRefresh,
  showToast: showToast,
  hideToast: hideToast,
  showLoading: showLoading,
  hideLoading: hideLoading,
  showModal: showModal,
  getStorage: getStorage,
  setStorage: setStorage,
  redirectTo: redirectTo,
  navigateBack: navigateBack,
  getUserInfo: getUserInfo,
  authorize: authorize,
  getSetting: getSetting,
  login: login,
  uploadFile: uploadFile,
  clearStorage: clearStorage
}