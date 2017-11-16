// import {Funs} from '../../../common/src/fun.es6';
import {BaseComponent} from '../../../common/src/BaseComponent.class.es6';
import {Actions} from './Actions.es6';
import {Store} from './Store.es6';
import Range from './../../../common/src/lib/range.jsx';

var {Router, Route, hashHistory} = ReactRouter;

het.domReady(()=>{
    // 配置sdk
    het.config({
        debugMode: 'print', // 打印调试数据
        updateFlagMap: {
        }
    });
});

// 创建React组件
class App extends BaseComponent {
    constructor(props) {
        super(props);
        let isAndroid = !!(navigator.userAgent.indexOf('Android')+1);
        this.state = {
            headerTop: isAndroid?73:64
        };
        this.listenStore(Store); // 监听Store
    }
    componentDidMount() {
        Actions.getData();
    }
    changeSwitch(e) {
        e.preventDefault();
        let value = this.state.switchStatus==90 ? 165 : 90; // 开关状态（90-关，165-开）
        Actions.changeSwitch(value);
    }
    changeMode(e) {
        e.preventDefault();
        let value = parseInt(e.currentTarget.getAttribute('data-val'));
        Actions.changeMode(value);
    }
    changeLight(value) {
        Actions.changeLight(value);
    }
    changeColor(value) {
        Actions.changeColor(value);
    }
    render() {
        let isRunning = this.state.switchStatus==90 ? false : true; // 开关状态（90-关，165-开）
        let cssColor = isRunning ? 'rgba(255, 255, 0, 1)' : 'rgba(255, 255, 255, 0)';
        return <div>
            <header style={{paddingTop:this.state.headerTop}}>
                <figure>
                    <img src="../static/img/light.png" style={{filter: `drop-shadow(0 -16px 16px ${cssColor})`}} />
                </figure>
                <a href="#" onTouchStart={this.changeSwitch.bind(this)} className="switch"></a>
            </header>
            <section className="flex fn-wrap">
                <a href="#" data-val="1" onTouchStart={this.changeMode.bind(this)} className={'flex-cell fn-read ' + (isRunning && this.state.sceneMode==1 ? 'active' : '')}>阅读</a>
                <a href="#" data-val="2" onTouchStart={this.changeMode.bind(this)} className={'flex-cell fn-rest ' + (isRunning && this.state.sceneMode==2 ? 'active' : '')}>休息</a>
                <a href="#" data-val="3" onTouchStart={this.changeMode.bind(this)} className={'flex-cell fn-light ' + (isRunning && this.state.sceneMode==3 ? 'active' : '')}>夜灯</a>
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
            <section className="color-range-wrap">
                <Range disabled={!isRunning} value={this.state.colorTemp} max="13" min="0" fnFeedback={this.changeColor.bind(this)} />
            </section>
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