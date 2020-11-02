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
    mvlist: [],
    mv:'',
    limit:10,
    src:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id=options.id||""
    this.getmv(id)
    this.getMvList()
  },
  async getmv(id){
    var res = await request({ url:'/mv/detail?mvid='+id})

    var data = await request({
      url: "/mv/url?id=" + id
    });
    // res.data.src = data.data.url
    this.setData({
      mv: res.data,
      src: data.data.url
    })
    var data2 = await request({
      url: "/artists?id=" + res.data.artistId
    });
    if(data.code!==-460){
      res.data.artistSrc = data2.artist.picUrl
      this.setData({
        mv: res.data
      })
    }else{
      return
    }
  },
  async getMvList() {
    var data = await request({
      url: "/mv/exclusive/rcmd?limit="+this.data.limit
    });
    this.setData({
      mvlist: data.data
    })
    // for (var i = 0; i < this.data.mvlist.length; i++) {
    //   var data = await request({
    //     url: "/mv/url?id=" + this.data.mvlist[i].id
    //   });

    //   this.data.mvlist[i].src = data.data.url
    // }
    for (var i = 0; i < this.data.mvlist.length; i++) {
      var data = await request({
        url: "/artists?id=" + this.data.mvlist[i].artistId
      });
      if (data.code!==-460){
        this.data.mvlist[i].artistSrc = data.artist.picUrl
      }else{
        return
      }
      
      
    }
    this.setData({
      mvlist: this.data.mvlist
    })
  },
  async click(e){
    this.setData({
      mv:this.data.mvlist[e.currentTarget.dataset.index]
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
    if(this.data.mvlist.length>59){
      wx.showToast({ title: '没有下一页数据' });
    }else{
      this.setData({
        limit: this.data.limit + 10
      })
      this.getMvList()
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})