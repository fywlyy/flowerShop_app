import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory,Link,history,IndexRoute} from 'react-router';
import Util from './common-component/util//util.js';

import './asset/reset.scss';

import Login from './common-component/login/login.jsx';
import Bottom from './common-component/bottom/bottom.jsx';

/*按需加载require方式，和组件里面的module.exports对应*/
//主页
const HomePage = function(nextState, cb){require.ensure([], (require) => {cb(null, require('./pages/home-page/home-page.jsx'))},'HomePage')};

class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            hasLogin: true
        }
    }
    componentWillMount() {
        const _this = this;
        Util.notLogin(() => {
            new Cookie().deleteCookie("accessToken", document.domain);
            _this.setState({
                hasLogin: false
            })
        })
    }
    /*登陆回调*/
    handLogin(bool) {
        if(!bool){
            new Cookie().deleteCookie("accessToken", document.domain);
        }

        this.setState({
            hasLogin: bool
        })
    }
    render(){
        let { hasLogin } = this.state;
        return (
            <div>
                {
                    hasLogin ?
                    <div>
                        {
                            React.cloneElement(this.props.children, {
                                key: this.props.location.pathname
                            })
                        }
                        <Bottom pathName={this.props.location.pathname}></Bottom>
                    </div> :
                    <Login onLogin={(bool) => this.handLogin(bool)} />                  

                }
                
        </div>
        );
    }
    componentDidMount(){
        document.body.scrollTop = 0;
    }
    componentDidUpdate(){
        document.body.scrollTop = 0;
    }
}

/*内部组件路由，业务组件模块都在这里配置*/
const Routers = (<Router history={hashHistory}>
    <Route path="/" component={App}>
        <IndexRoute getComponent={HomePage} />
        <Route path="/home-page" getComponent={HomePage}/>
        <Route path="/login" getComponent={Login}/>
    </Route>
</Router>);


// MobileHandle.setAjaxHeader();
ReactDOM.render(Routers, document.getElementById('app-container'));