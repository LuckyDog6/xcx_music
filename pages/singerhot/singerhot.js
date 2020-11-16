import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    leftMenuList: [{
      'name': '华语男歌手',
      'type': 1,
      'area': 7,
    },
    {
      'name': '华语女歌手',
      'type': 2,
      'area': 7,
    },
    {
      'name': '华语组合',
      'type': 3,
      'area': 7,
    },
    {
      'name': '欧美男歌手',
      'type': 1,
      'area': 96,
    },
    {
      'name': '欧美女歌手',
      'type': 2,
      'area': 96,
    },
    {
      'name': '欧美组合',
      'type': 3,
      'area': 96,
    },
    {
      'name': '日本男歌手',
      'type': 1,
      'area': 8,
    },
    {
      'name': '日本女歌手',
      'type': 2,
      'area': 8,
    },
    {
      'name': '日本组合',
      'type': 3,
      'area': 8,
    },
    {
      'name': '韩国男歌手',
      'type': 1,
      'area': 16,
    },
    {
      'name': '韩国女歌手',
      'type': 2,
      'area': 16,
    },
    {
      'name': '韩国组合',
      'type': 1,
      'area': 16,
    },
    {
      'name': '其他男歌手',
      'type': 1,
      'area': 0,
    },
    {
      'name': '其他女歌手',
      'type': 2,
      'area': 0,
    },
    {
      'name': '其他组合',
      'type': 1,
      'area': 7,
    },
    ],
    // 被点击的左侧的菜单
    currentIndex: 0,
    rightContent: []
  },
  Cates: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    console.log(Cates)
    // 2 判断
    if (!Cates) {
      // 不存在  发送请求获取数据
      this.getSingers();
    } else {
      // 有旧的数据 定义过期时间  10s 改成 5分钟
      if (Date.now() - Cates.time > 1000 * 60 * 5) {
        // 重新发送请求
        this.getSingers();
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
  async getSingers() {
    var data = await request({ url: "/artist/list?type=" + 1 + "&area=" + 7 });
    this.Cates = data;
    // 把接口的数据存入到本地存储中
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
    let rightContent = data.artists;
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
    console.log(e)
    const index = e.currentTarget.dataset.index;
    const type = e.currentTarget.dataset.type;
    const area = e.currentTarget.dataset.area;
    var data = await request({ url: "/artist/list?type=" + type + "&area=" + area });
    // this.Cates = data;
    // // 把接口的数据存入到本地存储中
    // wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
    let rightContent = data.artists;
    this.setData({
      currentIndex: index,
      rightContent,
      // 重新设置 右侧内容的scroll-view标签的距离顶部的距离
      scrollTop: 0
    })

  }
})