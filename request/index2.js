// 同时发送异步代码的次数
let ajaxTimes = 0;
// 对wx.request做promise封装
export const request2 = (params) => {
  // 判断 url中是否带有 /my/ 请求的是私有的路径 带上header token
  let header = {
    ...params.header
  };
  if (params.url.includes("/my/")) {
    // 拼接header 带上token
    header["Authorization"] = wx.getStorageSync("token");
  }
  ajaxTimes++;
  // 显示加载中 效果
  wx.showLoading({
    title: "加载中",
    mask: true
  });
  // 定义公共的url
  const baseUrl = "http://8.129.165.149/music";
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      header: header,
      url: baseUrl + params.url,
      success: (result) => {
        resolve(result.data);
      },
      fail: (err) => {
        reject(err);
      },
      complete: () => {
        ajaxTimes--;
        if (ajaxTimes === 0) {
          //  关闭正在等待的图标
          wx.hideLoading();
        }
      }
    });
  })
}