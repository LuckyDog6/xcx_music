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
    id:'',
    mvlist: [],
    mv: '',
    src:'',
    index:0,
    offset:0,
    hasMore:'',
    img:'http://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id || ""
    this.getmv(id)
    this.setData({
      id
    })
  },
  async getmv(id) {
    var res = await request({ url: '/artist/mv?id=' + id +"&limit=10"+"&offset="+this.data.offset})
    
    var data = await request({
        url: "/mv/url?id=" + res.mvs[this.data.index].id
    });
      
    
    this.setData({
      mvlist: [...this.data.mvlist,...res.mvs],
      hasMore:res.hasMore,
      src:data.data.url
    })
   
    this.setData({
      mv:this.data.mvlist[this.data.index]
    })
    var data2 = await request({
      url: "/artists?id=" + id
    });
    if (data.code !== -460) {
      this.setData({
        img: data2.artist.picUrl
      })
    } else {
      return
    }
  },
  
  async click(e) {
    this.setData({
      index: e.currentTarget.dataset.index
    })
    this.setData({
      mv: this.data.mvlist[this.data.index]
    })
    var data = await request({
      url: "/mv/url?id=" + this.data.mvlist[e.currentTarget.dataset.index].id
    });
    this.setData({
      src: data.data.url
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
    if (!this.data.hasMore) {
      wx.showToast({ title: '没有下一页数据' });
    } else {
      this.setData({
        offset: this.data.offset + 10
      })
      this.getmv(this.data.id)
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})