/**
 * 获取课表的函数
 *  通过传入 term 学期 获得指定学期的课表
 *  （此处还没考虑教务处没有课表的情况）
 * 
 * @param string uid
 * @param string pwd
 * @param string term
 * 
 * @return dict(Object)
 *      classArray      list
 *      classWeekDay    list
 *      returnStatus    bool
 *      errorMessage    string
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
    // 返回数据
    let returnMessage = {
        returnStatus: true
    }
    // 传入的各个数据
    let username = event.uid; //typeof -- string
    let password = event.pwd; //typeof --> string
    let term = event.term; //typeof --> string
    // 数据库
    const db = cloud.database()
    // 查询数据库中是否有这个学期的课表
    let ifHaveThisTerm = false;
    var resultData
    await db.collection('kb_classtables').where({
            uid: username,
            term: term
        }).get()
        .then(result => {
            resultData = result.data;
            console.log(resultData)
            if (resultData.length != 0) {
                ifHaveThisTerm = true
            }
        })
    // 没有本节课则 请求 api 获取
    let classMessage = {}
    if (!ifHaveThisTerm) {
        // 登录 服务器
        await rp({
            uri: api_url + '/wc/CqClassBox/lei',
            method: 'POST',
            formData: {
                pw: '0005f2d9c91740c4af7114db2346004c'
            },
            jar: cookiejar
        })
        // 请求 term 指定学期的课表
        await rp({
            url: api_url + '/wc/CqClassBox/getClassTable',
            method: 'POST',
            formData: {
                username: username,
                password: password,
                term: term
            },
            jar: cookiejar
        }).then(body => {
            console.log('\n\n\nbody', body)
            classMessages = JSON.parse(body)
        }).catch(error => {
            classMessages.messageStatus = false
            classMessages.errorMessage = 'request api error', error
        })

        // 如果数据请求成功 则写入数据库
        if (classMessages.messageStatus) {
            // 将课表信息添加进 kb_classtables 中
            await db.collection('kb_classtables').add({
                data: {
                    term: term,
                    uid: username,
                    termClassTables: classMessages.classMessage,
                }
            })
            
            let returnClassMessages = dealWithClassMessage(classMessages.classMessage)
            // 返回
            returnMessage.classArray = returnClassMessage.classArray
            returnMessage.classWeekDay = returnClassMessage.classWeekDay
            return returnMessage
        } else {
            returnMessage.returnStatus = false
            returnMessage.errorMessage = classMessages.errorMessage
            return returnMessage
        }
    } else {
        let returnClassMessage = dealWithClassMessage(resultData[0].termClassTables)
        // 返回
        returnMessage.classArray = returnClassMessage.classArray
        returnMessage.classWeekDay = returnClassMessage.classWeekDay
        return returnMessage
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
    console.log(classMessage)
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
    let returnClassMessage = {}
    returnClassMessage.classArray = classArray
    returnClassMessage.classWeekDay = classWeekDay
    return returnClassMessage
}