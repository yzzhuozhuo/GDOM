import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Route, Switch } from 'react-router-dom' // 引入路由
// import { Router , Redirect, Route , IndexRoute , browserHistory } from 'react-router';
// 引入redux
// import { Provider } from 'react-redux'
// import store from './redux/store'

import './index.css'
import LogIn from './components/logIn/logIn'
import TeacherHome from './components/teacherHome/teacherHome'
import QuickLogIn from './components/quickLogIn/quickLogIn'
import ForgotLogIn from './components/forgotLogIn/forgotLogIn'

ReactDOM.render(
  <div>
    <HashRouter>
      <Switch>
        <Route path="/teacherHome" component={TeacherHome} /> {/*登陆页面 */}
        <Route path="/forgotLogIn" component={ForgotLogIn} /> {/*忘记密码页面*/}
        <Route path="/quickLogIn" component={QuickLogIn} /> {/*快速登陆页面*/}
        <Route component={LogIn} /> {/* 默认组件：老师界面*/}
      </Switch>
    </HashRouter>
  </div>,
  document.getElementById('root'),
)
