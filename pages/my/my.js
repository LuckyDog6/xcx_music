import {
  request
} from "../../request/index.js";
import {
  request2
} from "../../request/index2.js";
// 小程序不支持ES7语法async 需要引入外部文件
import regeneratorRuntime from '../../lib/runtime/runtime';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    username: '',
    classlist: [{
        "id": 1,
        "path": "/images/my/love.png",
        "text": "我的喜欢",
        "url": "/pages/mylove/mylove"
      },

      {
        "id": 2,
        "path": "/images/my/playlist.png",
        "text": "收藏歌单",
        "url": "/pages/favPlaylist/favPlaylist"
      },

      {
        "id": 3,
        "path": "/images/my/album.png",
        "text": "收藏专辑",
        "url": "/pages/favalbum/favalbum"
      },

      {
        "id": 4,
        "path": "/images/my/singer.png",
        "text": "关注歌手",
        "url": "/pages/mysinger/mysinger"
      },
    ],
    recentlyList:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },
  async getRecentlyPlay() {
    var res = await request2({
      url: '/recentlyPlay/findAll'
    })
    res.data = res.data.reverse()
    for (var i =0; i <3; i++) {
      var res2 = await request({
        url: '/song/detail?ids=' + res.data[i].id
      })
      res.data[i].name = res2.songs[0].name
      res.data[i].singer = res2.songs[0].ar[0].name
      res.data[i].picUrl = res2.songs[0].al.picUrl
    }
    this.setData({
      recentlyList: res.data.slice(0,3)
    })
    console.log(this.data.recentlyList)
  },
  async getInfo() {
    var res = await request2({
      url: '/getInfo?username=' + this.data.username
    })
    this.setData({
      user: res.data
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
    this.setData({
      username: app.globalData.username
    })
    this.getInfo()
    this.getRecentlyPlay()
    console.log(app.globalData.bgplay)
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
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})