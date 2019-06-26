/**
 * 校验登录函数
 *  用来校验密码是否正确
 * 
 * @param string uid
 * @param string pwd
 * 
 * @return Object 
 *  loginStatus bool 
 *  errorMessage string
 */

// 云函数入口文件
const cloud = require('wx-server-sdk')
var rp = require('request-promise');

// 开启 request-promise 的 cookies记录
const api_url = 'http://39.107.243.115';
var cookiejar = rp.jar();

rp = rp.defaults({
  jar: cookiejar
})

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // 传入的各个数据
  let username = event.uid; //typeof -- string
  let password = event.pwd; //typeof --> string  
  // 返回
  returnMessage = {}
  // 登录 服务器
  await rp({
    uri: api_url + '/wc/CqClassBox/lei',
    method: 'POST',
    formData: {
      pw: '0005f2d9c91740c4af7114db2346004c'
    }
  })
  // 请求 term 指定学期的课表
  await rp({
    url: api_url + '/wc/CqClassBox/loginTest',
    method: 'POST',
    formData: {
      username: username,
      password: username
    }
  }).then(body => {
    // console.log('\n\n\nbody', body)
    returnMessage = JSON.parse(body)
  }).catch(error => {
    returnMessage.loginStatus = false
    returnMessage.errorMessage = '请求服务器失效，请联系管理员'
  })
  return returnMessage
}