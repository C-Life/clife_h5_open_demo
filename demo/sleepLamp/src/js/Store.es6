'use strict';
/**
 * 公共store，建议所有store事件都在此文件定义
 * ! 注意，Store方法不能使用箭头函数，否则将报this未定义
 * @type {store}
 */
import {Actions} from './Actions.es6';
import {Funs} from '../../../common/src/fun.es6';

const deviceId = Funs.getUrlParam('deviceId');
const path = location.host === 'weixin.hetyj.com' ? '/clife-wechat-preRelease/wechat/hotel' : '/clife-wechat-test/wechat/hotel';
const source = 8; // 来源

let lightTimer=0; // 亮度计时器
let colorTimer=0; // 色温计时器

export const Store = Reflux.createStore({
    listenables: [Actions],
    onGetData(){
        let _this = this;
        let timestamp = +new Date();
        let url = `${path}/device/data/get?deviceId=${deviceId}`;
        het.get(url, {}, (data)=>{
            data = JSON.parse(data);
            if (data.data) {
                _this.trigger(data.data);
            }
        });
    },
    onChangeSwitch(value){
        let url = `${path}/device/config/set`;
        let data = {
            deviceId: deviceId,
            source: source,
            json: JSON.stringify({
                switchStatus: value,
                updateFlag: Math.pow(2, 0)
            })
        };
        this.trigger({switchStatus:value});
        het.post(url, data, (res)=>{
            let d = JSON.parse(res);
            if (d.code===0) {
                console.log('调节开关成功');
            }
        });
    },
    onChangeMode(value){
        let url = `${path}/device/config/set`;
        let data = {
            deviceId: deviceId,
            source: source,
            json: JSON.stringify({
                sceneMode: value,
                updateFlag: Math.pow(2, 1)
            })
        };
        this.trigger({sceneMode:value});
        het.post(url, data, (res)=>{
            let d = JSON.parse(res);
            if (d.code===0) {
                console.log('调节模式成功');
            }
        });
    },
    onChangeLight(value){
        let url = `${path}/device/config/set`;
        clearTimeout(lightTimer);
        lightTimer = setTimeout(()=>{
            let data = {
                deviceId: deviceId,
                source: source,
                json: JSON.stringify({
                    lightness: value,
                    updateFlag: Math.pow(2, 4)
                })
            };
            het.post(url, data, (res)=>{
                let d = JSON.parse(res);
                if (d.code===0) {
                    console.log('调节亮度成功');
                }
            });
        }, 600);
    },
    onChangeColor(value){
        let url = `${path}/device/config/set`;
        clearTimeout(colorTimer);
        colorTimer = setTimeout(()=>{
            let data = {
                deviceId: deviceId,
                source: source,
                json: JSON.stringify({
                    colorTemp: value,
                    updateFlag: Math.pow(2, 3)
                })
            };
            het.post(url, data, (res)=>{
                let d = JSON.parse(res);
                if (d.code===0) {
                    console.log('调节色温成功');
                }
            });
        }, 600);
    }
});