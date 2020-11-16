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
    main: false,
    gologin: true,
    goregister: true,
    username:'',
    password:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  gologin() {
    this.setData({
      main: true,
      gologin: false,
      goregister: true
    })
  },
  goregister() {
    this.setData({
      main: true,
      goregister: false,
      gologin: true
    })
  },
  return1() {
    this.setData({
      main: false,
      gologin: true,
      goregister: true
    })
  },
  getUsername(e) {
    this.setData({
      username:e.detail.value
    })
  },
  
  getPassword(e) {

    this.setData({
      password:e.detail.value
    })
  },
  async register() {
    var res = await request2({url:'/register?username='+this.data.username+'&password='+this.data.password,method:"POST"})
    
    if(res.status===1){
      wx.showModal({
        title: '',
        content: '注册成功',
      })
      this.setData({
        main: true,
        gologin: false,
        goregister: true
      })
    }else{
      wx.showModal({
        title: '',
        content: '该账号已被注册',
      })
      this.setData({
        password: '',
        username:''
      })
    }
  },
  async login() {
    var res = await request2({ url: '/login?username=' + this.data.username + '&password=' + this.data.password, method: "POST" })

    if (res.status === 1) {
      app.globalData.username = this.data.username
      console.log(app.globalData.username)
      wx.switchTab({
        url: '/pages/index/index',
      })
      
    } else {
      wx.showModal({
        title: '',
        content: '账号或密码错误',
      })
      this.setData({
        password: '',
        username: ''
      })
    }
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