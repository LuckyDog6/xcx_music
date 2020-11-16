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
    user: {},
    nick: true,
    passwd:true,
    name:true,
    sex:true,
    desc:true,
    src:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getInfo()
  },
  async getInfo() {
    var res = await request2({
      url: '/getInfo?username='+app.globalData.username
    })
    
    this.setData({
      user: res.data
    })
    
  },
  image(){
    var that=this
    wx.chooseImage({
      count:1,
      success: function(res) {
        let src=res.tempFilePaths[0]
        that.setData({
          src
        })
        wx.uploadFile({
          url: 'http://8.129.165.149/music/updateConsumerPic?username=' + that.data.user.username,
          filePath: src,
          name: 'file',
          success:function(res){
            wx.showToast({
              title: '更新成功',
              success: function () {
                
                setTimeout(function () { 
                  that.getInfo()
                }, 2000) //延迟时间
              },
            })
          }
        })
      },
    })
  },
  async changeDate(e) {
    this.data.user.birth = e.detail.value
    this.setData({
      user: this.data.user
    })
    var res = await request2({
      url: '/update',
      data: this.data.user,
      method: "POST"
    })
    if (res.status === 1) {
      wx.showToast({
        title: '更新成功',
        success: function() {
          setTimeout(function() {}, 2000) //延迟时间
        },
      })

    } else {
      wx.showToast({
        title: '更新失败',
      })
    }
  },
  async changeZone(e) {
    this.data.user.address = e.detail.value.toString()
    this.setData({
      user: this.data.user
    })
    console.log(this.data.user)
    var res = await request2({
      url: '/update',
      data: this.data.user,
      method: "POST"
    })
    if (res.status === 1) {
      wx.showToast({
        title: '更新成功',
        success: function() {
          setTimeout(function() {}, 2000) //延迟时间
        },
      })
    } else {
      wx.showToast({
        title: '更新失败',
      })
    }
  },
  nickname() {
    this.setData({
      nick: false
    })
  },
  passw(){
    this.setData({
      passwd: false
    })
  },
  nam(){
    this.setData({
      name: false
    })
  },
  se(){
    this.setData({
      sex: false
    })
  },
  des(){
    this.setData({
      desc: false
    })
  },
  cancel(e) {
    this.setData({
      nick: true,
      passwd:true,
      name:true,
      sex:true,
      desc:true
    })
  },
  async confirm(e) {
    var res = await request2({
      url: '/update',
      data: this.data.user,
      method: "POST"
    })
    if (res.status === 1) {
      wx.showToast({
        title: '更新成功',
        success: function () {
          setTimeout(function () { }, 2000) //延迟时间
        },
      })

    } else {
      wx.showToast({
        title: '更新失败',
      })
    }
    this.setData({
      nick: true,
      passwd: true,
      name:true,
      sex: true,
      desc: true
    })
  },
  nickn(e){
    this.data.user.nickname=e.detail.value.trim()
    this.setData({
      user:this.data.user
    })
    
  },
  passwd(e){
    this.data.user.password=e.detail.value.trim()
    this.setData({
      user:this.data.user
    })
    
  },
  name(e){
    this.data.user.name=e.detail.value.trim()
    this.setData({
      user:this.data.user
    })
    
  },
  radioChange(e){
    this.data.user.sex=e.detail.value.trim()
    this.setData({
      user:this.data.user
    })
    
  },
  desc(e){
    this.data.user.desc=e.detail.value.trim()
    this.setData({
      user:this.data.user
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