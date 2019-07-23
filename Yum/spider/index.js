// 云函数入口文件
const cloud = require('wx-server-sdk')
// 爬虫相关库
const axios = require('axios');
const cheerio = require('cheerio');

import {
    find_class_message,
    password_fixed,
    sleep
} from 'ps';


cloud.init()

/**
 * 请求链接
 */

const Yangtzeu_Base_Url = "http://jwc3.yangtzeu.edu.cn";
const Yangtzeu_Login_Path = Yangtzeu_Base_Url + "/eams/login.action";
const Yangtzeu_Logout_Path = Yangtzeu_Base_Url + "/eams/logout.action";
const Yangtzeu_XueJi = Yangtzeu_Base_Url + "/eams/stdDetail.action";
const Yangtzeu_Tables_Ids = Yangtzeu_Base_Url + "/eams/courseTableForStd.action";
const Yangtzeu_Tables = Yangtzeu_Base_Url + "/eams/courseTableForStd!courseTable.action";


// 云函数入口函数
exports.main = async (event, context) => {
    /**
     * 常量
     */
    const username = event.uid; //typeof -- string
    const password = event.pwd; //typeof --> string 
    
    const wxContext = cloud.getWXContext()
    // 生成请求（设置头）
    const instance = axios.create({
        headers: {
            'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
            'Connection': 'keep-alive',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'
        }
    });
    /**
     * 变量
     */
    let continue_flag = true; // 是否继续执行的标志
    let encrypt_password = ''; // 加密后的密码
    let form_data = {};
    let semester_id = '48';

    let return_message = ''; // 返回消息
    let return_status = false; // 请求状态返回
    /**
     * 设置部分
     */
    instance.defaults.withCredentials = true; // 保存Cookies

    /**
     * 请求部分
     */
    console.log('获取加密字段...');
    await instance.get(Yangtzeu_Login_Path).then(
        res => {
            // 解析界面
            let $ = cheerio.load(res.data);
            let login_script = $('script').eq(-1).html()
            // 加密内容开始的地方
            let first_secret = login_script.search('CryptoJS.SHA1') + "CryptoJS.SHA1('".length;
            // 补全加密前密码
            let fixed_encrypt_password = login_script.slice(first_secret, first_secret + 37) + password;
            // 加密
            encrypt_password = password_fixed(fixed_encrypt_password);
            // 设置cookie
            instance.defaults.headers['Cookie'] = res.headers['set-cookie'][0].replace('Path=/eams;', '').replace('Path=/;', '').replace('HttpOnly', '') +
                '; ' + res.headers['set-cookie'][1].replace('Path=/eams;', '').replace('Path=/;', '').replace('HttpOnly', '') +
                '; ' + res.headers['set-cookie'][2].replace('Path=/eams;', '').replace('Path=/;', '').replace('HttpOnly', '');
        }).catch(
        err => {
            console.error(err);
        }
    );

    // 添加设置：添加post下 formdata的发送方法
    instance.defaults.transformRequest = [function (data) {
        // Do whatever you want to transform the data
        let ret = ''
        for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
    }];

    console.log('模拟登陆...');
    // 模拟登录
    await instance.post(Yangtzeu_Login_Path, {
        username: username,
        password: encrypt_password,
        encodedPassword: '',
        session_locale: 'zh_CN'
    }).then(
        res => {
            // 是否继续执行
            continue_flag = res.data.search('密码错误') == -1 ? true : false;
            return_message = continue_flag ? '' : '密码错误';
            console.log();
        }
    ).catch(
        err => {
            console.error(err);
            return_message = '网页请求失败';
        }
    );

    // 判断是否登陆成功
    if (!continue_flag) {
        // 登陆失败则退出
        return {
            status: continue_flag,
            message: return_message,
            list: []
        };
    }

    console.log('获取课程ids...');
    await sleep(600);

    // 获取课程信息 - 根据指定内容获取个人课程信息
    await instance.get(Yangtzeu_Tables_Ids).then(
        res => {

            let getflag = res.data.search('请不要过快点击') != -1 ? false : true;
            if (!getflag) {
                console.error(res.data.search('请不要过快点击'), '请不要点击过快');
                return false;
            }
            let ids = /.*?bg\.form\.addInput\(form,"ids","(\d+)"\);.*?/g.exec(res.data)[1];
            let startWeek = '';

            form_data = {
                'ignoreHead': '1', // 不知道干啥的
                'setting.kind': 'std', // 课表类型,另一个类型为 班级class
                'startWeek': startWeek, // 开始的周数
                'project.id': '1', // 本科为 1
                'semester.id': semester_id, // 查询的年度：2018 上学期为48; 2017 下半年为 46 类推
                'ids': ids
            }
        }
    ).catch(
        err => {
            console.log(err);
        }
    )


    return {
        event,
        openid: wxContext.OPENID,
        appid: wxContext.APPID,
        unionid: wxContext.UNIONID,
    }
}