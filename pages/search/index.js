/* 
1 输入框绑定 值改变事件 input事件
  1 获取到输入框的值
  2 合法性判断 
  3 检验通过 把输入框的值 发送到后台
  4 返回的数据打印到页面上
2 防抖 （防止抖动） 定时器  节流 
  0 防抖 一般 输入框中 防止重复输入 重复发送请求
  1 节流 一般是用在页面下拉和上拉 
  1 定义全局的定时器id
 */
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    songlist:[],
    // 取消 按钮 是否显示
    isFocus:false,
    // 输入框的值
    inpValue:"",
    index1: 0,
    poster: '',
    name: '',
    author: '',
    src: '',
    duration: 0,
    currentTime: 0,
    play: false
  },
  TimeId:-1,
  // 输入框的值改变 就会触发的事件
  handleInput(e){
    // 1 获取输入框的值
    const {value}=e.detail;
    // 2 检测合法性
    if(!value.trim()){
      this.setData({
        songlist:[],
        isFocus:false
      })
      // 值不合法
      return;
    }
    // 3 准备发送请求获取数据
    this.setData({
      isFocus:true
    })
    clearTimeout(this.TimeId);
    this.TimeId=setTimeout(() => {
      this.qsearch(value);
    }, 1000);
  },
  // 发送请求获取搜索建议 数据
  async qsearch(query){
    const res = await request({ url:"/search?keywords="+query});
    console.log(res);
    this.setData({
      songlist:res.result.songs
    })
    for (var i = 0; i < this.data.songlist.length; i++) {
      var data2 = await request({
        url: "/song/url?id=" + this.data.songlist[i].id
      });
      this.data.songlist[i].src = data2.data[0].url
    }
    this.setData({
      songlist: this.data.songlist
    })
    this.setData({
      poster: this.data.songlist[0].artists[0].img1v1Url,
      name: this.data.songlist[0].name,
      author: this.data.songlist[0].artists[0].name,
      src: this.data.songlist[0].src
    })
  },
  play(e) {
    this.setData({
      index1: e.currentTarget.dataset.index
    })
    this.setData({
      poster: this.data.songlist[this.data.index1].artists[0].img1v1Url,
      name: this.data.songlist[this.data.index1].name,
      author: this.data.songlist[this.data.index1].artists[0].name,
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
  clickplay() {
    if (this.data.play) {
      this.audioCtx.pause()
    } else {
      this.audioCtx.play()
    }
  },
  previous() {
    if (this.data.index1 === 0) {
      this.setData({
        index1: this.data.songlist.length - 1
      })
    } else {
      this.setData({
        index1: this.data.index1 - 1
      })
    }

    this.setData({
      poster: this.data.songlist[this.data.index1].artists[0].img1v1Url,
      name: this.data.songlist[this.data.index1].name,
      author: this.data.songlist[this.data.index1].artists[0].name,
      src: this.data.songlist[this.data.index1].src
    })
    this.audioCtx.play()
  },
  next() {
    if (this.data.index1 === this.data.songlist.length - 1) {
      this.setData({
        index1: 0
      })
    } else {
      this.setData({
        index1: this.data.index1 + 1
      })
    }
    this.setData({
      poster: this.data.songlist[this.data.index1].artists[0].img1v1Url,
      name: this.data.songlist[this.data.index1].name,
      author: this.data.songlist[this.data.index1].artists[0].name,
      src: this.data.songlist[this.data.index1].src
    })
    this.audioCtx.play()
  },
  // 点击 取消按钮
  handleCancel(){
    this.setData({
      inpValue:"",
      isFocus:false,
      songlist:[]
    })
  }
})