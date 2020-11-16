import {
  request
} from "../../request/index.js";
import {
  request2
} from "../../request/index2.js";
// 小程序不支持ES7语法async 需要引入外部文件
import regeneratorRuntime from '../../lib/runtime/runtime';
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playlist:'',
    // 当前日期天
    date: '',
    // 当前日期月
    month: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getplaylist()
    var date = new Date()
    var mon = ''
    if (date.getMonth() === 0) {
      mon = 'Jan.'
    }
    if (date.getMonth() === 1) {
      mon = 'Feb'
    }
    if (date.getMonth() === 2) {
      mon = 'Mar.'
    }
    if (date.getMonth() === 3) {
      mon = 'Apr.'
    }
    if (date.getMonth() === 4) {
      mon = 'May.'
    }
    if (date.getMonth() === 5) {
      mon = 'Jun.'
    }
    if (date.getMonth() === 6) {
      mon = 'Jul.'
    }
    if (date.getMonth() === 7) {
      mon = 'Aug.'
    }
    if (date.getMonth() === 8) {
      mon = 'Sep.'
    }
    if (date.getMonth() === 9) {
      mon = 'Oct.'
    }
    if (date.getMonth() === 10) {
      mon = 'Nov.'
    }
    if (date.getMonth() === 11) {
      mon = 'Dec.'
    }


    this.setData({
      month: mon,
      date: date.getDate()
    })
  },
  async getplaylist(){
    var res = await request2({ url:'/playList/findAll'})
    for(var i=0;i<res.data.length;i++){
      var res2 = await request({url:'/playlist/detail?id='+res.data[i].id})
      res.data[i].picUrl = res2.playlist.coverImgUrl
      res.data[i].name=res2.playlist.name
      res.data[i].playCount = res2.playlist.playCount
    }
    this.setData({
      playlist:res.data
    })
    console.log(this.data.playlist)
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

  }
})