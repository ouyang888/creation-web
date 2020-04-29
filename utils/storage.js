function get(key) {
  wx.getStorage({
    key: key,
    success: function (res) {
      console.log(res.data)
    },
    fail: function () { },
    complete: function () { }
  })

}
function get_s(key) {
  return wx.getStorageSync(key)
}
function set(key, data, cb) {
  wx.setStorage({
    key: key,
    data: data,
    success: function (res) {
      if (typeof (cb) == "function") {
        cb(res)
      }
    },
    fail: function () { },
    complete: function () { }
  })
}
function remove(key) {
  wx.removeStorage({
    key: key,
    success: function (res) { },
    fail: function () { },
    complete: function () { }
  })
}

module.exports = {
  get,
  get_s,
  set,
  remove
}