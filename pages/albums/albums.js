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
    songlist:[],
    album:'',
    desc:'',
    artImg:'',
    index1:0,
    poster:'',
    name:'',
    author:'',
    src:'',
    duration:0,
    currentTime:0,
    play:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id || "";
    this.getsonglist(id)
    // console.log(id)
    
    
  },
  async getsonglist(id){
    var data = await request({
      url: "/album?id="+id
    });
    for (var i = 0; i < data.songs.length; i++) {
      var data2 = await request({
        url: "/song/url?id=" + data.songs[i].id
      });
      data.songs[i].src = data2.data[0].url
    }
    var data3 = await request({
      url: "/artist/desc?id=" + data.album.artist.id
    });
    var img = data3.topicData[0].rectanglePicUrl
    this.setData({
      songlist:data.songs,
      album:data.album,
      desc: data.album.description.slice(0,50),
      artImg:img
    })
    this.setData({
      poster: this.data.songlist[0].al.picUrl,
      name: this.data.songlist[0].name,
      author: this.data.songlist[0].ar[0].name,
      src: this.data.songlist[0].src
    })
  },
  play(e){
    this.setData({
      index1: e.currentTarget.dataset.index
    })
    this.setData({
      poster: this.data.songlist[this.data.index1].al.picUrl,
      name: this.data.songlist[this.data.index1].name,
      author: this.data.songlist[this.data.index1].ar[0].name,
      src: this.data.songlist[this.data.index1].src
    })
    this.audioCtx.play()
    // this.setData({
    //   play:true
    // })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.audioCtx=wx.createAudioContext('myAudio')
  },
  bindtimeupdate(res) {
    this.setData({
      duration: parseInt(res.detail.duration),
      currentTime: parseInt(res.detail.currentTime)
    })
    // console.log('bindtimeupdate', parseInt(res.detail.currentTime), '时间总时长-->', parseInt(res.detail.duration));
  },
  change(e){
    this.audioCtx.pause()
    this.audioCtx.seek(e.detail.value)
    this.setData({
      currentTime: e.detail.value
    })
    this.audioCtx.play()
  },
  audioplay(){
    this.setData({
      play:true
    })
  },
  audiopause(){
    this.setData({
      play:false
    })
  },
  clickplay(){
    if(this.data.play){
      this.audioCtx.pause()
    }else{
      this.audioCtx.play()
    }
  },
  previous(){
    if(this.data.index1===0){
      this.setData({
        index1:this.data.songlist.length-1
      })
    }else{
      this.setData({
        index1: this.data.index1 - 1
      })
    }
    
    this.setData({
      poster: this.data.songlist[this.data.index1].al.picUrl,
      name: this.data.songlist[this.data.index1].name,
      author: this.data.songlist[this.data.index1].ar[0].name,
      src: this.data.songlist[this.data.index1].src
    })
    this.audioCtx.play()
  },
  next(){
    if (this.data.index1 === this.data.songlist.length-1) {
      this.setData({
        index1: 0
      })
    } else {
      this.setData({
        index1: this.data.index1 + 1
      })
    }
    this.setData({
      poster: this.data.songlist[this.data.index1].al.picUrl,
      name: this.data.songlist[this.data.index1].name,
      author: this.data.songlist[this.data.index1].ar[0].name,
      src: this.data.songlist[this.data.index1].src
    })
    this.audioCtx.play()
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