import {
  request
} from "../../request/index.js";
// 小程序不支持ES7语法async 需要引入外部文件
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    albums: [],
    swiperList: [],
    // 坐标卡数据
    classlist: [{
        "id": 1,
        "path": "/images/index/1.png",
        "text": "榜单热单",
        "url": "/pages/tops/tops"
      },

      {
        "id": 2,
        "path": "/images/index/2.png",
        "text": "歌手热曲",
        "url": "/pages/my/my"
      },

      {
        "id": 3,
        "path": "/images/index/3.png",
        "text": "歌单分类",
        "url": "/pages/tags/tags"
      },

      {
        "id": 4,
        "path": "/images/index/4.png",
        "text": "歌手mv",
        "url": "/pages/singermv/singermv"
      },
    ],
    playList: [],
    newSonglist: [],
    ktvList: [],
    ufolist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio')
    this.getswiperlist()
    this.getSongList()
    this.getPlaylist()
    this.getNewsong()
    this.getKtvlist()
    this.getUfolist()
  },
  async getswiperlist(){
    var data = await request({ url:'/banner?type=1'})
    this.setData({
      swiperList:data.banners
    })
  },
  async getSongList() {
    var data = await request({
      url: "/album?id=6434"
    });
    var data2 = await request({
      url: "/album?id=18896"
    });
    var data3 = await request({
      url: "/album?id=16953"
    });
    var albums1 = this.data.albums
    albums1.push(data)
    albums1.push(data2)
    albums1.push(data3)
    this.setData({
      albums: albums1
    })
  },
  async getPlaylist() {
    var data = await request({
      url: "/playlist/detail?id=6186912"
    });
    var list = data.playlist.tracks
    var num = Math.floor(Math.random() * (list.length - 2))
    this.setData({
      playList: list.slice(num, num + 3)
    })
    for (var i = 0; i < this.data.playList.length; i++) {
      var data = await request({
        url: "/song/url?id=" + this.data.playList[i].id
      });
      this.data.playList[i].src = data.data[0].url
    }
    this.setData({
      playList: this.data.playList
    })
    // console.log(this.data.playList)
  },
  audioPlay: function(options) {
    this.audioCtx.play()
  },
  async getNewsong() {
    var data = await request({
      url: '/personalized/newsong?limit=100'
    })
    var num = Math.floor(Math.random() * (data.result.length))
    this.setData({
      newSonglist: data.result.slice(num, num + 1)
    })
  },
  async getKtvlist() {
    var data = await request({
      url: '/album/newest'
    })
    var num = Math.floor(Math.random() * (data.albums.length - 2))
    this.setData({
      ktvList: data.albums.slice(num, num + 3)
    })
  },
  async getUfolist() {
    var data = await request({
      url: '/personalized/privatecontent/list'
    })
    var num = Math.floor(Math.random() * (data.result.length - 1))
    this.setData({
      ufolist: data.result.slice(num, num + 2)
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

  }
})