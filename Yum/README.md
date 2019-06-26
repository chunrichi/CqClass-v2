# 长青课表-云开发部分

## 简介

[长青盒子](https://github.com/chunrichi/CqClass-v2) 云开发部分的代码

- 语言 nodejs
- 包管理 npm

## 目录结构

```text
├───getClassTable       // 获取课表信息
│       index.js
│       package.json
├───loginTest           // 账号密码校验
│       index.js
│       package.json
└───signIn              // 登录
        index.js
        package.json
```

## 安装说明

> **注意**：由于是个人开发，api随时可能会随着服务器更改

### 环境安装

1. request 库

    `npm install request --save`

    官方文档：https://github.com/request/request

2. request-promise 库

    `npm install request-promise --save`

    官方文档：https://github.com/request/request-promise

## 功能简介

### `signIn`

登录函数

> 用来第一次使用的用户登录信息，并将部分信息保存到数据

保存的信息涵盖：

1. 姓名
2. 性别
3. 专业
4. 学号
5. 年级
6. 课表信息

```text
@param string uid  用户学号
@param string pwd  教务处密码
@param string term 当前学期代号 49为2018年下学期（此数据基本固定）
@return dict(Object)
    messageStatus       bool    是否获取成功
    returnClassMessage  dict    返回课表信息
    returnUserMessage   dict    返回用户信息
```

### `getClassTable`

获取课表的函数

> 通过传入 term 学期 获得指定学期的课表
（此处还没考虑教务处没有课表的情况）

```text
@param string uid
@param string pwd
@param string term
@return dict(Object)
    classArray      list
    classWeekDay    list
    returnStatus    bool
    errorMessage    string
```

### `loginTest`

校验登录函数

> 用来校验密码是否正确

```text
@param string uid
@param string pwd

@return Object
    loginStatus bool
    errorMessage string
```