const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 设置page高度
const setWinHeight = page => {
  wx.getSystemInfo({
    success: function(res){
      // console.log("windowHeight:" + res.windowHeight)
      page.setData({
        winheight: res.windowHeight
      })
    }
  })
}

// 设置page标题
const setTitle = title => {
  wx.setNavigationBarTitle({
    title: title
  })
}

const navigateTo = (page, params) => {
  let url
  const pages = {
    clock: '/pages/clock/clock',
    report: '/pages/report/report',
    photo: '/pages/photo/photo',
    repair: '/pages/repair/repair',
    device: '/pages/device/device',
    warning: '/pages/warning/warning',
    cleanList: '/pages/cleanList/cleanList',
    cleanReport: '/pages/cleanReport/cleanReport'
  }
  if (params) {
    url = pages[page] + '?' + params
  } else {
    url = pages[page]
  }
  wx.navigateTo({
    url: url,
    success: function(){
      console.log('open ' + page + ' success')
    },
    fail: function(){
      console.log('open ' + page + ' fail')
    },
    complete: function(){
      // console.log('complete')
    }
  })
}

const wxPromise = (fn, opts = {}) => {
  const promise = new Promise((resolve, reject) => {
    opts.success = function(res) {
      if(res.data && res.data.IsNotLogin !== undefined && res.data.IsNotLogin === true) {
        wx.showModal({
          title: res.data.Msg,
          showCancel: false,
          complete: function() {
            wx.redirectTo({ url: '/pages/login/login'})
          }
        })
        reject(res)
      } else {
        resolve(res)
      }
    }
    opts.fail = function(res) {
      reject(res)
    }
    fn(opts)
  })
  return promise
}

module.exports = {
  formatTime: formatTime,
  setWinHeight: setWinHeight,
  setTitle: setTitle,
  navigateTo: navigateTo,
  wxPromise: wxPromise
}
