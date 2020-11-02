import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    songlist: [],
    singername:'',
    desc: '',
    artImg: '',
    index1: 0,
    poster: '',
    name: '',
    author: '',
    src: '',
    duration: 0,
    currentTime: 0,
    play: false,
    limit:12,
    offset:0,
    total:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id || "";
    var singername = options.name || "";
    this.setData({
      singername,
      id
    })
    this.getsinger(id)
    this.getsonglist(id)
  },
  async getsinger(id){
    const res = await request({ url:'/artist/desc?id='+id})

    this.setData({
      desc: res.briefDesc.slice(0, 70)
    })
    if (res.topicData!==null){
      this.setData({
        artImg: res.topicData[0].coverUrl
      })
    }else{
      this.setData({
        artImg: "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg"
      })
    }
  },
  async getsonglist(id){
    const data = await request({ url: "/artist/songs?id=" + id+'&limit='+this.data.limit+'&offset='+this.data.offset});
    this.setData({
      total:data.total
    })
    // for (var i = 0; i < data.songs.length; i++) {
    //   var data2 = await request({
    //     url: "/song/url?id=" + data.songs[i].id
    //   });
    //   data.songs[i].src = data2.data[0].url
    // }
   
    for (var i = 0; i < data.songs.length; i++) {
      var data3 = await request({
        url: "/song/detail?ids=" + data.songs[i].id
      });
      data.songs[i].al.picUrl = data3.songs[0].al.picUrl
    }
    this.setData({
      songlist: [...this.data.songlist, ...data.songs]
    })
    this.setData({
      poster: this.data.songlist[this.data.index1].al.picUrl,
      name: this.data.songlist[this.data.index1].name,
      author: this.data.songlist[this.data.index1].ar[0].name,
      src: this.data.songlist[this.data.index1].src
    })
  },
  async play(e) {
    this.setData({
      index1: e.currentTarget.dataset.index
    })
    var data2 = await request({
      url: "/song/url?id=" + this.data.songlist[this.data.index1].id
    });
    this.data.songlist[this.data.index1].src = data2.data[0].url
    this.setData({
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
    this.audioCtx = wx.createAudioContext('myAudio')
  },
  bindtimeupdate(res) {
    this.setData({
      duration: parseInt(res.detail.duration),
      currentTime: parseInt(res.detail.currentTime)
    })
    // console.log('bindtimeupdate', parseInt(res.detail.currentTime), '时间总时长-->', parseInt(res.detail.duration));
  },
  change(e) {
    this.audioCtx.pause()
    this.audioCtx.seek(e.detail.value)
    this.setData({
      currentTime: e.detail.value
    })
    this.audioCtx.play()
  },
  audioplay() {
    this.setData({
      play: true
    })
  },
  audiopause() {
    this.setData({
      play: false
    })
  },
  async clickplay(e) {
    this.setData({
      index1: this.data.index1
    })
    var data2 = await request({
      url: "/song/url?id=" + this.data.songlist[this.data.index1].id
    });
    this.data.songlist[this.data.index1].src = data2.data[0].url
    this.setData({
      src: this.data.songlist[this.data.index1].src
    })
    if (this.data.play) {
      this.audioCtx.pause()
    } else {
      this.audioCtx.play()
    }
  },
  async previous() {
    if (this.data.index1 === 0) {
      this.setData({
        index1: this.data.songlist.length - 1
      })
    } else {
      this.setData({
        index1: this.data.index1 - 1
      })
    }
    var data2 = await request({
      url: "/song/url?id=" + this.data.songlist[this.data.index1].id
    });
    this.data.songlist[this.data.index1].src = data2.data[0].url
    this.setData({
      poster: this.data.songlist[this.data.index1].al.picUrl,
      name: this.data.songlist[this.data.index1].name,
      author: this.data.songlist[this.data.index1].ar[0].name,
      src: this.data.songlist[this.data.index1].src
    })
    this.audioCtx.play()
  },
  async next() {
    if (this.data.index1 === this.data.songlist.length - 1) {
      this.setData({
        index1: 0
      })
    } else {
      this.setData({
        index1: this.data.index1 + 1
      })
    }
    var data2 = await request({
      url: "/song/url?id=" + this.data.songlist[this.data.index1].id
    });
    this.data.songlist[this.data.index1].src = data2.data[0].url
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
    if(this.data.songlist.length>this.data.total){
      wx.showToast({ title: '没有下一页数据' });
    }else{
      this.setData({
        offset: this.data.offset + 8
      })
      this.getsonglist(this.data.id);
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})