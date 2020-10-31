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
    value:'',
    albums:[],
    swiperList:[
      {
        "id":1,
        "src":"/images/swiper/1.jpg"
      },
      {
        "id":2,
        "src":"/images/swiper/2.jpg"
      },
      {
        "id":3,
        "src":"/images/swiper/3.jpg"
      },
      {
        "id":4,
        "src":"/images/swiper/4.jpg"
      },
      {
        "id":5,
        "src":"/images/swiper/5.jpg"
      },
      {
        "id":6,
        "src":"/images/swiper/6.jpg"
      },
      {
        "id":7,
        "src":"/images/swiper/7.jpg"
      },
      {
        "id":8,
        "src":"/images/swiper/8.jpg"
      },
    ],
    // 坐标卡数据
    classlist: [{
      "id": 1,
      "path": "/images/index/1.png",
      "text": "喜欢",
      "url": ""
    },

    {
      "id": 2,
      "path": "/images/index/2.png",
      "text": "本地",
      "url": ""
    },

    {
      "id": 3,
      "path": "/images/index/3.png",
      "text": "歌单",
      "url": ""
    },

    {
      "id": 4,
      "path": "/images/index/4.png",
      "text": "已购",
      "url": ""
    },
    ],
    playList:[],
    newSonglist:[],
    ktvList:[],
    ufolist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio')
    this.getSongList()
    this.getPlaylist()
    this.getNewsong()
    this.getKtvlist()
    this.getUfolist()
  },
  
  async getSongList(){
    var data = await request({
      url: "/album?id=6434"
    });
    var data2 = await request({
      url: "/album?id=18896"
    });
    var data3 = await request({
      url: "/album?id=16953"
    });
    var albums1= this.data.albums
    albums1.push(data)
    albums1.push(data2)
    albums1.push(data3)
    this.setData({
      albums:albums1
    })
    console.log(this.data.albums)
  },
  async getPlaylist(){
    var data = await request({
      url: "/playlist/detail?id=6186912"
    });
    var list=data.playlist.tracks
    var num = Math.floor(Math.random() * (list.length-2))
    this.setData({
      playList:list.slice(num,num+3)
    })
    for(var i=0;i<this.data.playList.length;i++){
      var data = await request({
        url: "/song/url?id="+this.data.playList[i].id
      });
      
      this.data.playList[i].src=data.data[0].url
      
      
    }
    this.setData({
      playList:this.data.playList
    })
    // console.log(this.data.playList)
  },
  audioPlay:function(options){
    console.log("点击了")
    this.audioCtx.play()
  },
  async getNewsong(){
    var data = await request({ url:'/personalized/newsong?limit=100'})
    var num= Math.floor(Math.random() *(data.result.length))
    this.setData({
      newSonglist:data.result.slice(num,num+1)
    })
  },
  async getKtvlist(){
    var data = await request({ url:'/personalized/djprogram'})
    var num = Math.floor(Math.random() * (data.result.length-2))
    this.setData({
      ktvList:data.result.slice(num,num+3)
    })
    console.log(data.result)
  },
  async getUfolist(){
    var data = await request({ url: '/personalized/privatecontent/list' })
    var num = Math.floor(Math.random() * (data.result.length-1))
    this.setData({
      ufolist: data.result.slice(num,num+2)
    })
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