// 能发送ajax请求的函数模块
// 函数的返回值是promise对象
import axios from 'axios'

export default function ajax(url, data = {}, type = 'GET') {
  if (type.toUpperCase() === 'GET') {
    // 拼请求参数串
    const paramStr = Object.keys(data).map(key => {
      return `${key}=${data[key]}`
    }).join('&')
    const finalUrl = paramStr ? `${url}?${paramStr}` : url
    return axios.get(finalUrl)
  }
  else {
    // 使用axios发post请求 application/json; charset=utf-8 application/x-www-form-urlencoded
    return axios.post(url, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
  }
}
