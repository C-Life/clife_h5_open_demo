// import {Funs} from '../../../common/src/fun.es6';
import {BaseComponent} from '../../../common/src/BaseComponent.class.es6';
import {Actions} from './Actions.es6';
import {Store} from './Store.es6';
import Range from './../../../common/src/lib/range.jsx';


var {Router, Route, hashHistory} = ReactRouter;

let dataTimer = 0;

// 接收app推送数据
het.repaint((data)=> {
    // var appData = Funs._extends({}, appData, data);
    Actions.repaint(data);
});

het.domReady(()=>{
    // 配置sdk
    het.config({
        debugMode: 'print', // 打印调试数据
        updateFlagMap: {
            'switchStatus':1,
            'sceneMode':2,
            'wakeMode':3,
            'colorTemp':4,
            'lightness':5
        },
        renderConfigData:true
    });
});
 
// 创建React组件
class App extends BaseComponent {
    constructor(props) {
        super(props);
        let isAndroid = !!(navigator.userAgent.indexOf('Android')+1);
        this.state = {
            headerTop: isAndroid?73:64,
            lightness: 0,
            colorTemp: 1,
            toastShow: false,
            switchStatus: ''
        };
        this.listenStore(Store); // 监听Store
    }
    componentDidMount() {
        // 灯泡图片缓存处理
        setTimeout(()=>{
            for (let i=0;i<14;i++) {
                (new Image()).src = `../static/img/lights/iv_led_${i}.png`;
            }
        }, 500);
    }

    changeSwitch(e) {
        e.preventDefault();
        let value = this.state.switchStatus==90 ? 165 : 90; // 开关状态（90-关，165-开）
        Actions.changeSwitch(value);
    }
    changeMode(val, e) {
        e.preventDefault();
        if (!this.isRunning()) return;
        Actions.changeMode(val);
    }
    changeLight(value) {
        if (!this.isRunning()) return;
        Actions.changeLight(value);
    }
    changeColor(value) {
        if (!this.isRunning()) return;
        Actions.changeColor(value);
    }
    closeTips() {
        this.setState({tipsShow: false});
    }
    getRGBA(colorTemp, lightness) {
        let rgbs = [
            [0,0,0],
            [255,0,0],
            [255,255,0],
            [0,255,0],
            [0,200,0],
            [0,180,0],
            [0,255,255],
            [0,180,255],
            [0,140,220],
            [0,60,230],
            [100,0,220],
            [255,0,255],
            [200,0,200],
            [100,160,255],
        ];
        let rgb = rgbs[colorTemp || 0];
        lightness = !colorTemp ? 0 : lightness; // 当色温为0时，亮度也为零
        return `rgba(${rgb}, ${((lightness||0)/10)})`;
    }
    isRunning() {
        return this.state.switchStatus==165; // 开关状态（90-关，165-开）
    }
    showToast() {
        let _this = this;
        clearTimeout(window.timer)
        if (this.state.sceneMode==1) {   
            this.setState({
                toastShow:true
            })
            window.timer = setTimeout(function(){
            _this.setState({
                toastShow:false
            })
        }, 3000)
        };
    }
    render() {
        let isRunning = this.isRunning();
        let cssColor = isRunning ? this.getRGBA(this.state.colorTemp, this.state.lightness) : 'rgba(255, 255, 255, 0)';
        let imgIndex = isRunning ? (this.state.lightness == '0' ? 0 : ((isRunning && this.state.sceneMode==1) ? 0 : this.state.colorTemp ) ) : 0;
        return <div>
            <header style={{paddingTop:this.state.headerTop+'px'}}>
                {/*<p className="tips" style={{visibility: this.state.tips && this.state.tipsShow ? 'visible' : 'hidden'}} onTouchStart={this.closeTips.bind(this)}>{this.state.tips}<i className="close"></i></p>*/}
                <p className="tips" style={{visibility: this.state.tips && this.state.tipsShow ? 'visible' : 'hidden'}} onTouchStart={this.closeTips.bind(this)}>{this.state.tips}</p>
                <figure>
                    {/*<img src="../static/img/light.png" style={{filter: `drop-shadow(0 -16px 16px ${cssColor})`}} />*/}
                    <img src={`../static/img/lights/iv_led_${imgIndex}.png`} />
                    <img className='light_img' style={{opacity:1-this.state.lightness/10}} src='../static/img/lights/iv_led_0.png' />
                </figure>
                <a href="#" onTouchStart={this.changeSwitch.bind(this)} className="switch"></a>
            </header>
            <section className="flex fn-wrap">
                <a href="#" data-val="1" onTouchStart={this.changeMode.bind(this,0)} className={'flex-cell fn-read ' + (isRunning && this.state.sceneMode==1 ? 'active' : '')}>阅读</a>
                <a href="#" data-val="2" onTouchStart={this.changeMode.bind(this,1)} className={'flex-cell fn-rest ' + (isRunning && this.state.sceneMode==2 ? 'active' : '')}>休息</a>
                <a href="#" data-val="3" onTouchStart={this.changeMode.bind(this,2)} className={'flex-cell fn-light ' + (isRunning && this.state.sceneMode==3 ? 'active' : '')}>夜灯</a>
            </section>
            <h2>亮度</h2>
            <section className="flex light-range-wrap">
                <i className="l-low"></i>
                <div className="flex-cell">
                    <Range disabled={!isRunning} value={this.state.lightness} max="10" min="0" fnFeedback={this.changeLight.bind(this)} />
                </div>
                <i className="l-high"></i>
            </section>
            <h2>颜色</h2>
            <section className={'color-range-wrap' + (this.state.sceneMode==1?' off':'')}  onTouchEnd = {this.showToast.bind(this)}>
                <Range disabled={!isRunning || this.state.sceneMode==1} value={this.state.colorTemp} max="13" min="1" fnFeedback={this.changeColor.bind(this)} />
            </section>
            <div className={isRunning ? '' : 'shutdownFace'}></div>
            <div style={{display:this.state.toastShow?'block':'none'}} className="toast-cover">
                <div className="toast">
                    阅读模式颜色不能调节哦
                </div>
            </div>
        </div>;
    }
}

// 开始渲染
het.domReady(()=>{
    het.setTitle('舒眠灯');
    // 无路由方式
    // ReactDOM.render(<App />, document.getElementById('ROOT'));

    // 路由方式
    ReactDOM.render((
        <Router history={hashHistory}>
            <Route path="/" component={App} />
        </Router>
    ), document.getElementById('ROOT'));
});