import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    leftMenuList:[],
    // 被点击的左侧的菜单
    currentIndex: 0,
    rightContent: []
  },
  Cates: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getcatlist()
   
  },
  async getcatlist(){
    var data = await request({ url:'/playlist/highquality/tags'})
    this.setData({
      leftMenuList:data.tags
    })
    /* 
  0 web中的本地存储和 小程序中的本地存储的区别
    1 写代码的方式不一样了 
      web: localStorage.setItem("key","value") localStorage.getItem("key")
  小程序中: wx.setStorageSync("key", "value"); wx.getStorageSync("key");
    2:存的时候 有没有做类型转换
      web: 不管存入的是什么类型的数据，最终都会先调用以下 toString(),把数据变成了字符串 再存入进去
    小程序: 不存在 类型转换的这个操作 存什么类似的数据进去，获取的时候就是什么类型
  1 先判断一下本地存储中有没有旧的数据
    {time:Date.now(),data:[...]}
  2 没有旧数据 直接发送新请求 
  3 有旧的数据 同时 旧的数据也没有过期 就使用 本地存储中的旧数据即可
   */

    //  1 获取本地存储中的数据  (小程序中也是存在本地存储 技术)
    const Cates = wx.getStorageSync("cates");
    // 2 判断
    if (!Cates) {
      // 不存在  发送请求获取数据
      this.getplaylist();
    } else {
      // 有旧的数据 定义过期时间  10s 改成 5分钟
      if (Date.now() - Cates.time > 1000 * 60 * 5) {
        // 重新发送请求
        this.getplaylist();
      } else {
        // 可以使用旧的数据
        this.Cates = Cates;
        let rightContent = this.Cates.data.artists
        this.setData({
          rightContent
        })
      }
    }
  },
  async getplaylist() {
    var data = await request({ url: "/top/playlist/highquality?cat="+this.data.leftMenuList[0].name});
    console.log(this.data.leftMenuList[0].name)
    console.log(data)
    this.Cates = data;
    // 把接口的数据存入到本地存储中
    // wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
    let rightContent = data.playlists;
    console.log(rightContent)
    this.setData({
      rightContent
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 左侧菜单的点击事件
  async handleItemTap(e) {
    /* 
    1 获取被点击的标题身上的索引
    2 给data中的currentIndex赋值就可以了
    3 根据不同的索引来渲染右侧的商品内容
     */
    const index = e.currentTarget.dataset.index;
    const name = e.currentTarget.dataset.name;
    var data = await request({ url: "/top/playlist/highquality?cat=" + name });
    // this.Cates = data;
    // // 把接口的数据存入到本地存储中
    // wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
    let rightContent = data.playlists;
    this.setData({
      currentIndex: index,
      rightContent,
      // 重新设置 右侧内容的scroll-view标签的距离顶部的距离
      scrollTop: 0
    })

  }
})