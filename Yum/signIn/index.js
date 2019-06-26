/**
 * 登录函数
 *  用来第一次使用的用户登录信息，并将部分信息保存到数据
 * 
 *  保存的信息涵盖：
 *      1. 姓名
 *      2. 性别
 *      3. 专业
 *      4. 学号
 *      5. 年级
 *      6. 课表信息
 * 
 * @param string uid  用户学号
 * @param string pwd  教务处密码
 * @param string term 当前学期代号 49为2018年下学期（此数据基本固定）
 * 
 * @return dict(Object)
 *  messageStatus       bool    是否获取成功
 *  returnClassMessage  dict    返回课表信息
 *      classArray      list    课表信息
 *      classWeekDay    list    每天课表信息
 *  returnUserMessage   dict    返回用户信息
 *      studentName     string  姓名
 *      department      string  专业
 */

// 云函数入口文件
const cloud = require('wx-server-sdk')
var rp = require('request-promise');

// 开启 request-promise 的 cookies记录
const api_url = 'http://39.107.243.115';
var cookiejar = rp.jar();
// cookiejar.setCookie(cookie, api_url); //请求api_url的所有cookies
rp = rp.defaults({
    jar: cookiejar
})

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
    // 数据库
    const db = cloud.database()

    // 输入 账号 密码
    var username = event.uid;
    var password = event.pwd;
    var term = event.term;

    // 查询是否已经有过该用户的课表
    var ifHavaTheUser = false;
    var userData = {}
    await db.collection('kb_users').where({
            uid: username
        }).get()
        .then(result => {
            let resultData = result.data;
            if (resultData.length != 0) {
                ifHavaTheUser = true
                userData = resultData[0]
            }
        })

    // 存储信息
    var userMessage = {};

    // 返回状态
    var messageStatus = true;

    // 没有该用户 则直接请求 API
    if (!ifHavaTheUser) {
        // 登录 服务器
        await rp({
            uri: api_url + '/wc/CqClassBox/lei',
            method: 'POST',
            formData: {
                pw: '0005f2d9c91740c4af7114db2346004c'
            },
            jar: cookiejar
        })

        // 请求 爬虫
        await rp({
            url: api_url + '/wechart/CqClassBox/login',
            method: 'POST',
            formData: {
                username: username,
                password: username
            },
            jar: cookiejar
        }).then(body => {
            // console.log('\n\n\nbody', body)
            userMessage = JSON.parse(body)
        }).catch(error => {
            userMessage.messageStatus = false
            userMessage.errorMessage = 'request api error'
        })

        // 如果获取成功
        if (userMessage.messageStatus) {
            // 存储信息
            // 将个人信息存储进 kb_users 中
            await db.collection('kb_users').add({
                // data 字段表示需新增的 JSON 数据
                data: {
                    uid: username,
                    grade: userMessage.studentMessage.grade,
                    gradeClass: userMessage.studentMessage.gradeClass,
                    major: userMessage.studentMessage.major,
                    sex: userMessage.studentMessage.sex,
                    studentName: userMessage.studentMessage.studentName,
                }
            })
            // 将课表信息添加进 kb_classtables 中
            await db.collection('kb_classtables').add({
                data: {
                    term: term,
                    uid: username,
                    termClassTables: userMessage.classMessage
                }
            })
            console.log('userMessage',userMessage)
            // 信息处理
            let returnClassMessage = dealWithClassMessage(userMessage.classMessage)
            let returnUserMessage = {
                studentName: userMessage.studentMessage.studentName,
                department: userMessage.studentMessage.major
            }
            
            // 返回
            return {
                returnClassMessage,
                returnUserMessage,
                messageStatus
            }
        } else {
            // 请求失败
            messageStatus = false
            let errorMessage = userMessage.errorMessage
            return {
                messageStatus,
                errorMessage
            }
        }
    } else {
        // 有该用户
        // 校验账号密码
        const res = await cloud.callFunction({
            name: 'loginTest',
            data: {
                uid: username,
                pwd: password
            }
        })
        messageStatus = res.result.loginStatus
        errorMessage = res.result.errorMessage

        let termClassTables = {}
        await db.collection('kb_classtables').where({
                uid: username,
                term: term
            }).get()
            .then(result => {
                let resultData = result.data;
                // console.log(resultData)
                if (resultData.length != 0) {
                    termClassTables = resultData[0].termClassTables
                } else {
                    // 应该不会出现这种状况 除非我手贱删了
                    termClassTables = []
                }
            })
        console.log('termClassTables',termClassTables)
        let returnClassMessage = dealWithClassMessage(termClassTables)
        let returnUserMessage = {
            studentName: userData.studentName,
            department: userData.major
        }

        // 校验成功
        if (messageStatus) {
            return {
                messageStatus,
                returnClassMessage,
                returnUserMessage
            }
        } else {
            // 失败
            return {
                messageStatus,
                errorMessage
            }
        }
    }
}

/*
生成课表返回内容
 */
function dealWithClassMessage(classMessage) {
    // 返回
    let classArray = [] // 作为课表用
    let classWeekDay = { // 作为每日课程用
        Sunday: [],
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: []
    }
    const Weeks = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    // 对所有课程进行处理
    for (let course of classMessage) {
        let courseObject = {}
        courseObject.courseName = course.courseName
        courseObject.roomName = course.roomName
        courseObject.weekDay = course.weekDay
        courseObject.courseTime = course.courseTime
        courseObject.vaildWeeks = course.vaildWeeks

        // 生成课表内容
        classArray.push(courseObject)

        courseObject.teacherName = course.teacherName
        courseObject.vaildWeek = course.vaildWeeks.indexOf('1') + '-' + course.vaildWeeks.lastIndexOf('1')
        classWeekDay[Weeks[course.weekDay]].push(courseObject)
    }
    // 对每日课程进行排序
    for (let day of Weeks) {
        classWeekDay[day].sort((a, b) => {
            return a.courseTime - b.courseTime
        })
    }
    let returnMessage = {}
    returnMessage.classArray = classArray
    returnMessage.classWeekDay = classWeekDay
    return returnMessage
}