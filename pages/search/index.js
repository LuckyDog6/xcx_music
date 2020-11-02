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
import {
  request
} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
      data: {
        value:'',
        songlist: [],
        // 取消 按钮 是否显示
        isFocus: false,
        // 输入框的值
        inpValue: "",
        index1: 0,
        poster: '',
        name: '',
        author: '',
        src: '',
        duration: 0,
        currentTime: 0,
        play: false,
        limit: 10,
        offset: 0,
        total: ''
      },
      TimeId: -1,
      // 输入框的值改变 就会触发的事件
      handleInput(e) {
        this.setData({
          songlist: [],
          isFocus: false,
        })
        // 1 获取输入框的值
        const {
          value
        } = e.detail;
        this.setData({
          value: e.detail.value
        })
        // 2 检测合法性
        if (!value.trim()) {
          this.setData({
            songlist: [],
            isFocus: false,
          })
          // 值不合法
          return;
        }
        // 3 准备发送请求获取数据
        this.setData({
          isFocus: true
        })
        clearTimeout(this.TimeId);
        this.TimeId = setTimeout(() => {
          this.qsearch(value);
        }, 1000);
      },
      // 发送请求获取搜索建议 数据
      async qsearch(query) {
        const res = await request({
          url: "/search?keywords=" + query + "&limit=" + this.data.limit + "&offset=" + this.data.offset
        });
        this.setData({
          songlist: [...this.data.songlist, ...res.result.songs],
          total: res.result.songCount
        })
        // for (var i = 0; i < this.data.songlist.length; i++) {
        //   var data2 = await request({
        //     url: "/song/url?id=" + this.data.songlist[i].id
        //   });
        //   this.data.songlist[i].src = data2.data[0].url
        // }
        for (var i = 0; i < this.data.songlist.length; i++) {
          var data3 = await request({
            url: "/song/detail?ids=" + this.data.songlist[i].id
          });
          this.data.songlist[i].picUrl=''
          this.data.songlist[i].picUrl = data3.songs[0].al.picUrl
        }
        this.setData({
          songlist: this.data.songlist
        })
        this.setData({
          poster: this.data.songlist[this.data.index1].picUrl,
          name: this.data.songlist[this.data.index1].name,
          author: this.data.songlist[this.data.index1].artists[0].name,
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
          poster: this.data.songlist[this.data.index1].picUrl,
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
      onReady: function() {
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
          poster: this.data.songlist[this.data.index1].picUrl,
          name: this.data.songlist[this.data.index1].name,
          author: this.data.songlist[this.data.index1].artists[0].name,
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
          poster: this.data.songlist[this.data.index1].picUrl,
          name: this.data.songlist[this.data.index1].name,
          author: this.data.songlist[this.data.index1].artists[0].name,
          src: this.data.songlist[this.data.index1].src
        })
        this.audioCtx.play()
      },
      // 点击 取消按钮
      handleCancel() {
        this.setData({
          inpValue: "",
          isFocus: false,
          songlist: []
        })
      },
      /**
       * 页面上拉触底事件的处理函数
       */
      onReachBottom: function() {
        if (this.data.songlist.length > this.data.total) {
          wx.showToast({
            title: '没有下一页数据'
          });
        } else {
          this.setData({
            offset: this.data.offset + 10
          })
          clearTimeout(this.TimeId);
          this.TimeId = setTimeout(() => {
            this.qsearch(this.data.value);
          }, 1000);
        }
      }
})