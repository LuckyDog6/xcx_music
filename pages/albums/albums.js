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
    songlist:[],
    album:'',
    desc:'',
    artImg:'',
    index1:0,
    hidden:-1,
    poster:'',
    name:'',
    author:'',
    src:'',
    duration:0,
    currentTime:0,
    play:false,
    username:'',
    myLove:[],
    myAlbums:[],
    id:'',
    favorite:-1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id || "";
    this.getsonglist(id)
    this.getMyLove()
    this.getMyBlaums()
    this.setData({
      username:app.globalData.username,
      id
    })
    
    
  },
  async getMyBlaums(){
    var res = await request2({ url:'/myAlbums/findAllId'})
    this.setData({
      myAlbums:res.data
    })
    this.setData({
      favorite: this.data.myAlbums.indexOf(this.data.id.toString())
    })
  },

  async getMyLove(){
    var res = await request2({url:'/myLove/findAllId'})
    this.setData({
      myLove:res.data
    })
    
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
    var img = ''
    if (data3.topicData!=null){
      img = data3.topicData[0].rectanglePicUrl
    }else{
      img ='https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg'
    }
    this.setData({
      songlist:data.songs,
      album:data.album,
      desc: data.album.description.slice(0,50),
      artImg:img
    })

    this.setData({
      hidden: this.data.myLove.indexOf(this.data.songlist[0].id.toString()),
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
      hidden: this.data.myLove.indexOf(this.data.songlist[this.data.index1].id.toString()),
      poster: this.data.songlist[this.data.index1].al.picUrl,
      name: this.data.songlist[this.data.index1].name,
      author: this.data.songlist[this.data.index1].ar[0].name,
      src: this.data.songlist[this.data.index1].src
    })
    this.audioCtx.play()
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
  },
  change(e){
    this.audioCtx.pause()
    this.audioCtx.seek(e.detail.value)
    this.setData({
      currentTime: e.detail.value
    })
    this.audioCtx.play()
  },
  async audioplay(){
    var res = await request2({ url: '/recentlyPlay/add?id=' + this.data.songlist[this.data.index1].id + '&username=' + this.data.username + '&src=' + this.data.songlist[this.data.index1].src })
    this.setData({
      play:true
    })
    console.log("我播放了")
    
    
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
      hidden: this.data.myLove.indexOf(this.data.songlist[this.data.index1].id.toString()),
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
      hidden: this.data.myLove.indexOf(this.data.songlist[this.data.index1].id.toString()),
      poster: this.data.songlist[this.data.index1].al.picUrl,
      name: this.data.songlist[this.data.index1].name,
      author: this.data.songlist[this.data.index1].ar[0].name,
      src: this.data.songlist[this.data.index1].src
    })
    this.audioCtx.play()
  },
  async loved(e){
    var that = this
    var love = this.data.songlist[e.currentTarget.dataset.index]
    var res = await request2({url:'/myLove/add?id='+love.id+'&username='+this.data.username+'&src='+love.src})
    if(res.status===1){
      wx.showToast({
        title: '已添加至喜欢列表',
      })
      setTimeout(function () {
        that.getMyLove()
        that.setData({
          hidden: -2
        })
      }, 500) //延迟时间
    }else{
      wx.showToast({
        title: '该曲目已在喜欢列表',
      })
    }
    
  },
  async love(e){
    var that=this
    var love = this.data.songlist[e.currentTarget.dataset.index]
    var res = await request2({url:'/myLove/delete?id='+love.id+'&username='+this.data.username})
    if(res.status===1){
      wx.showToast({
        title: '已从喜欢列表移除',
      })
      setTimeout(function () {
        that.getMyLove()
        that.setData({
          hidden: -1
        })
      }, 500) //延迟时间
    }else{
      wx.showToast({
        title: '该曲目已在喜欢列表',
      })
    }
    
  },
  async favorited(e){
    var that = this
    var res = await request2({ url:'/myAlbums/add?id='+this.data.id+'&username='+this.data.username})
    if (res.status === 1) {
      wx.showToast({
        title: '已收藏',
      })
      setTimeout(function () {
        that.setData({
          favorite: -2
        })
      }, 500) //延迟时间
    } else {
      wx.showToast({
        title: '',
      })
    }
  },
  async favorite(e){
    var that = this
    var res = await request2({ url:'/myAlbums/delete?id='+this.data.id+'&username='+this.data.username})
    if (res.status === 1) {
      wx.showToast({
        title: '已从收藏列表移除',
      })
      setTimeout(function () {
        that.setData({
          favorite: -1
        })
      }, 500) //延迟时间
    } else {
      wx.showToast({
        title: '',
      })
    }
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