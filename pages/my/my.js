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
    mvlist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMvList()
  },
  async getMvList(){
    var data = await request({
      url: "/mv/exclusive/rcmd?limit=10"
    });
    this.setData({
      mvlist:data.data
    })
    for(var i=0;i<this.data.mvlist.length;i++){
      var data = await request({
        url: "/mv/url?id="+this.data.mvlist[i].id
      });

      this.data.mvlist[i].src=data.data.url
    }
    for (var i = 0; i < this.data.mvlist.length; i++) {
      var data = await request({
        url: "/artists?id=" + this.data.mvlist[i].artistId
      });

      this.data.mvlist[i].artistSrc = data.artist.picUrl
      // console.log(data)
    }
    this.setData({
      mvlist:this.data.mvlist
    })
    console.log(this.data.mvlist)
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