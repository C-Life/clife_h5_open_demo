## H5框架jssdk文档

### 目录
1. 配置接口 [het.config](#bar1)
2. SDK准备就绪接口 [het.ready](#bar2)
3. 页面准备就绪接口 [het.domReady](#bar3)
4. 接收repaint数据接口 [het.repaint](#bar4)
5. 发送数据接口 [het.send](#bar5)
6. 数据对比接口 [het.diff](#bar6)
7. 设置页面标题接口 [het.setTitle](#bar7)
8. 计算updateFlag值 [het.calcUpdateFlag](#bar8)
9. 计算16进制updateFlag值 [het.hexUpFlag](#bar9)
10. 调用系统toast [het.toast](#bar10)
11. 代理get请求 [het.get](#bar11)
12. 代理post请求 [het.post](#bar12)
13. 配置app [het.nativeConfig](#bar13)
14. 获取app数据 [het.nativeData](#bar14)

### 功能接口
要使用该SDK，首先需要引入SDK文件[hetsdk.js](_public/js/core/hetsdk.js)。引入该文件后，在js全局环境中将自动添加het对象，该对象相应的方法见下列接口说明。

<span id="bar1"></span>
#### 1. 配置接口

##### 方法调用说明
    het.config(SETTINGS)
    // settings格式为json对象，json字段详见参数说明

##### 参数说明
|    参数名称    | 是否必须 | 字段类型 |  参数说明  
|----------------|:--------:|----------|:-----------
| callbackExpire |    否    | integer  | 回调函数过期时间，缺省为30s
| torporTime     |    否    | integer  | 迟钝时间，缺省为5s，当调用[send](#bar5)方法之后，忽略所有在该时间内接收到的[repaint](#bar4)请求 
| webDataMap     |    否    | json     | web <-> app数据映射表，缺省不映射
| useUpdateFlag  |    否    | boolean  | （该参数将弃用，为兼容旧版，暂时保留）是否自动添加updateFlag标记，缺省不添加
| updateFlagMap  |    否    | json     | 配置updateFlag标记映射表，用于自动计算updateFlag，缺省为空
| onceConfigData |    否    | boolean  | 仅接受一次控制数据，缺省为true
| renderConfigData |  否    | boolean  | 是否渲染控制数据，缺省不渲染
| filter         |    否    | object   | 过滤器，可对单个字段设置过滤规则。有纯数字和函数两种。函数形式提供type、data两个参数。
| debugMode      |    否    | string   | 开启debug，缺省不开启. 目前可选模式为print
| company        |    否    | string   | 公司标识，缺省为het
| line           |    否    | string   | 产品线表示，缺省为common

*注：以上列出的为SDK内置参数，只在本地处理，不会被发送至app。可根据app需要添加参数。如参数未在以上列表中，将被发送至app*

##### 返回结果
因该方法将调用app接口，返回内容由app决定。目前暂时无用。

##### 范例
```javascript
het.config({
    debugMode : 'print', // 打印调试数据
    webDataMap : {
        'mode'  : 'devMode',  // 将原始devMode映射为mode
        'power' : 'refgSwitch' // 将原始的refgSwitch映射为power
    },
    updateFlagMap : {
        'mode' : 9, // 模式的标记位为9
        'power' : 14 // 开关的标记位为14
    },
    renderConfigData : true, // 开启控制数据渲染，以便filter能取到控制数据
    filter : {
        'mode' : 0, // 仅取控制数据
        'color' : 1, // 仅取运行数据
        'power' : function(type, data) {
            if (type===1 && data.mode===2) {
                return false; // 运行数据，且模式为2时，舍弃power
            } else {
                return true; // 其它情形均不过滤power
            }
        }
    }

});
```

***********************************************************************

<span id="bar2"></span>
#### 2. SDK准备就绪接口

##### 方法调用说明
    het.ready(CALLBACK)

##### 参数说明
|    参数名称    | 是否必须 | 字段类型 |  参数说明
|----------------|:--------:|----------|:-----------  
| callback       |    是    | function | 回调函数，当sdk准备就绪时，将会执行该方法登记的回调函数。*注意，该回调只会被调用一次。*

##### 返回结果
该方法用于登记回调函数，不返回任何结果

***********************************************************************

<span id="bar3"></span>
#### 3. 页面准备就绪接口
该接口用于在页面准备就绪时调用，其实就是DOMContentLoaded的封装，也可根据需要自己实现
##### 方法调用说明
    het.domReady(CALLBACK)

##### 参数说明
|    参数名称    | 是否必须 | 字段类型 |  参数说明
|----------------|:--------:|----------|:-----------
| callback       |    是    | function | 回调函数，当WEB页面准备就绪时，将会执行该方法登记的回调函数。*注意，该回调只会被调用一次。*

##### 返回结果
该方法用于登记回调函数，不返回任何结果

***********************************************************************

<span id="bar4"></span>
#### 4. 登记用于接收repaint数据的函数

##### 方法调用说明
    het.repaint(CALLBACK)

##### 参数说明
|    参数名称    | 是否必须 | 字段类型 |  参数说明
|----------------|:--------:|----------|:-----------
| callback       |    是    | function | 回调函数，当接收到repaint数据时，将执行该方法登记的回调函数。

##### 返回结果
该方法用于登记回调函数，不返回任何结果

##### 范例
```javascript
het.repaint(function(data, type){
    console.log('接收到数据', data);
    console.log('数据类型为', type===0 ? '控制数据' : '运行数据');
});
```

***********************************************************************

<span id="bar5"></span>
#### 5. 发送数据接口

##### 方法调用说明
    het.send(data, sucCallback, errCallback)

##### 参数说明
|    参数名称    | 是否必须 | 字段类型 |  参数说明
|----------------|:--------:|----------|:-----------
| data           |    是    | json     | 将发送给app的数据，一般是完整的控制数据
| sucCallback    |    否    | function | app方数据处理成功时将调用该方法
| errCallback    |    否    | function | app方数据处理失败时将调用该方法

##### 返回结果
因该方法将调用app接口，返回内容由app决定。目前暂时无用。

***********************************************************************

<span id="bar6"></span>
#### 6. 与控制数据进行对比
将当前数据与控制数据进行对比，可用于决断是否需要发送控制数据

##### 方法调用说明
    het.diff(jsonData)

##### 参数说明
|    参数名称    | 是否必须 | 字段类型 |  参数说明
|----------------|:--------:|----------|:-----------
| jsonData       |    是    | json     | 将该数据与控制数据对比，接收格式形为：`{key1:value1,key2:value2,...}`

##### 返回结果
返回与控制数据有差异的部分，格式与接收格式相同

##### 范例
```java
var data = {
    mode : 1,
    power : 1
};
var diffData = het.diff(data); // 检出与控制数据差异部分
if (Object.keys(diffData).length>0) {
    het.send(data); // 有差异，需要提交
} else {
    het.toast('没有数据需要提交！');
}
```


***********************************************************************

<span id="bar7"></span>
#### 7. 设置页面标题接口
该方法用于设置页面标题，同时将标题发送给app，以供app进行标题更新。
##### 方法调用说明
    het.setTitle(title)

##### 参数说明
|    参数名称    | 是否必须 | 字段类型 |  参数说明
|----------------|:--------:|----------|:-----------
| title          |    是    | string   | 将设置的标题

##### 返回结果
不返回任何结果。

***********************************************************************

<span id="bar8"></span>
#### 8. 计算updateFlag值
该方法用于计算updateFlag值，以供提交控制数据
##### 方法调用说明
    het.calcUpdateFlag(offset)

##### 参数说明
|    参数名称    | 是否必须 | 字段类型 |  参数说明
|----------------|:--------:|----------|:-----------
| offset         |    是    | Integer  | 偏移量（二进制位，从1开始）

##### 返回结果
返回十进制计算结果

***********************************************************************

<span id="bar9"></span>
#### 9. 计算16进制updateFlag值
该方法用于计算16进制的updateFlag值，以供提交控制数据
##### 方法调用说明
    het.hexUpFlag(index, length, upLength, originUpFlag)

##### 参数说明
|    参数名称    | 是否必须 | 字段类型 |  参数说明
|----------------|:--------:|----------|:-----------
| index          |    是    | Integer  | 索引值（二进制位，从0开始）
| length         |    否    | Integer  | 该功能占字节长度，默认为1
| upLength       |    否    | Integer  | 整个updateFlag所占字节长度，默认为4
| originUpFlag   |    否    | string   | 原始updateFlag（十六进制字符串），默认为"00"

##### 返回结果
返回十六进制字符串

***********************************************************************

<span id="bar10"></span>
#### 10. 调用系统toast
该方法用于调用系统toast，以便app方统一toast风格
##### 方法调用说明
    het.toast(msg)

##### 参数说明
|    参数名称    | 是否必须 | 字段类型 |  参数说明
|----------------|:--------:|----------|:-----------
| msg            |    是    | string   | 将要弹出的提示信息

##### 返回结果
因该方法将调用app接口，返回内容由app决定。目前暂时无用。

***********************************************************************

<span id="bar11"></span>
#### 11. 代理get请求
该方法用于让app代理get方式的http请求
##### 方法调用说明
    het.get(url, data, sucCallback, errCallback)

##### 参数说明
|    参数名称    | 是否必须 | 字段类型 |  参数说明
|----------------|:--------:|----------|:-----------
| url            |    是    | string   | 请求地址。如用相对地址，必须“/” 开头（如：/v1/app/get）
| data           |    否    | json     | 发送数据。形式为：`{"name": "张三", "age": 21, ...}`
| sucCallback    |    否    | function | 成功时的回调函数（状态码为200或304时，才认定为成功）
| errCallback    |    否    | function | 失败时的回调函数
| needSign       |    否    | integer  | 接口是否需要签名（相对地址时有效）

##### 返回结果
不返回任何结果。

***********************************************************************

<span id="bar12"></span>
#### 12. 代理post请求
该方法用于让app代理post方式的http请求
##### 方法调用说明
    het.post(url, data, sucCallback, errCallback)

##### 参数说明
|    参数名称    | 是否必须 | 字段类型 |  参数说明
|----------------|:--------:|----------|:-----------
| url            |    是    | string   | 请求地址。如用相对地址，必须“/” 开头（如：/v1/app/get）
| data           |    否    | json     | 发送数据。形式为：`{"name": "张三", "age": 21, ...}`
| sucCallback    |    否    | function | 成功时的回调函数（状态码为200或304时，才认定为成功）
| errCallback    |    否    | function | 失败时的回调函数
| needSign       |    否    | integer  | 接口是否需要签名（相对地址时有效）

##### 返回结果
不返回任何结果。

***********************************************************************

<span id="bar13"></span>
#### 13. 配置app
该方法用于配置app或调用app方法
##### 方法调用说明
    het.nativeConfig(options, sucCallback, errCallback)

##### 参数说明
|    参数名称    | 是否必须 | 字段类型 |  参数说明
|----------------|:--------:|----------|:-----------
| options        |    是    | json     | 配置项(json对象)
| sucCallback    |    否    | function | 成功时的回调函数
| errCallback    |    否    | function | 失败时的回调函数

##### options说明
    options:{
        method : "title", //必填,标识触发app方法名
        line : "common", //选填，产品线开发有独立功能时填写
        company : "het", //选填，外包公司开发有独立功能时填写
        data : {
            msg : "test", //选填，按与app商定字段填写
            ok : function(){}, //选填，按与app商定字段填写
            cancel : function(){} //选填，按与app商定字段填写
        } //data必填,传递给app的数据
    }
##### 返回结果
不返回任何结果。

***********************************************************************

<span id="bar14"></span>
#### 14. 获取app数据
该方法用于主动获取app端的数据
##### 方法调用说明
    het.nativeData(options, sucCallback, errCallback)

##### 参数说明
|    参数名称    | 是否必须 | 字段类型 |  参数说明
|----------------|:--------:|----------|:-----------
| options        |    是    | json     | 配置项(json对象)
| sucCallback    |    否    | function | 成功时的回调函数
| errCallback    |    否    | function | 失败时的回调函数

##### options说明
    options:{
        method : "title", //必填,标识触发app方法名
        line : "common", //选填，产品线开发有独立功能时填写
        company : "het" //选填，外包公司开发有独立功能时填写
    }

##### 返回结果
不返回任何结果。