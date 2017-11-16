'use strict';
/**
 * 公共Actions，所有action均需统一在此文件登记，以防重名造成store冲突
 * @type {actions}
 */

export const Actions = Reflux.createActions([
    'getData', // 拉取数据
    'changeSwitch', // 调节模式
    'changeMode', // 调节模式
    'changeLight', // 调节亮度
    'changeColor', // 调节色温
]);