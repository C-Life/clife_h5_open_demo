'use strict';
/**
 * 公共store，建议所有store事件都在此文件定义
 * ! 注意，Store方法不能使用箭头函数，否则将报this未定义
 * @type {store}
 */
import {Actions} from './Actions.es6';
import {Funs} from '../../../common/src/fun.es6';


// 数据过滤计时器
let dataFilterTimers = {
    switchStatus : 0,
    sceneMode : 0,
    lightness : 0,
    colorTemp : 0
};
let lightTimer=0; // 亮度计时器，防止操作过频繁
let colorTimer=0; // 色温计时器，防止操作过频繁

// 返回过滤后的数据
function dataFilter(data) {
    let time = (new Date).getTime();
    let result = {};
    for (let k in data) {
        if (typeof dataFilterTimers[k] !== 'undefined') {
            if (dataFilterTimers[k] < time) {
                dataFilterTimers[k] = 0;
                result[k] = data[k];
            }
        } else {
            result[k] = data[k];
        }
    }
    return result;
}

// 设置过滤器过期时间
function setDataTimer(...keys) {
    let time = (new Date).getTime() + 10e3; // 10秒内不接收新数据
    for (let i in keys) {
        dataFilterTimers[keys[i]] = time;
    }
}

export const Store = Reflux.createStore({
    listenables: [Actions],
    onRepaint(data){
        if (data) {
            data.tips = '';
            data.tipsShow = false;
            if (data.onlineStatus && data.onlineStatus!=0) {
                data.tips = '设备不在线';
                data.tipsShow = true;
            }
            this.trigger(dataFilter(data));
        } else if (data.msg) {
            this.trigger({tips: json.msg, tipsShow: true});
        }
    },
    onChangeSwitch(value){
        setDataTimer('switchStatus');
        this.trigger({switchStatus:value});
        het.send({switchStatus: value}, (res)=>{

            if (res.code===0) {
                console.log('调节开关成功');
            }
        });
    },
    onChangeMode(value){
        let modes = [
            {colorTemp:0, lightness:10, sceneMode:1},
            {colorTemp:2, lightness:8, sceneMode:2,},
            {colorTemp:1, lightness:2, sceneMode:3,}
        ]
        setDataTimer('colorTemp', 'lightness', 'sceneMode');
        this.trigger(modes[value]);
        het.send(modes[value], (res)=>{
            if (res.code===0) {
                console.log('调节模式成功');
            }
        });
    },
    onChangeLight(value){
        clearTimeout(lightTimer);
        lightTimer = setTimeout(()=>{
            het.send({lightness: value}, (res)=>{
                if (res.code===0) {
                    console.log('调节亮度成功');
                }
            });
        }, 600);
        setDataTimer('lightness');
        this.trigger({lightness:value});
    },
    onChangeColor(value){
        clearTimeout(colorTimer);
        colorTimer = setTimeout(()=>{
            het.send({colorTemp: value}, (res)=>{
                if (res.code===0) {
                    console.log('调节色温成功');
                }
            });
        }, 600);
        setDataTimer('colorTemp');
        this.trigger({colorTemp:value});
    }
});