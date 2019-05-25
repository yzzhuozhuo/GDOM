import { runInContext } from "vm";

import React, { Component } from 'react';
import { Input, Alert } from 'antd';
import { Button } from 'antd';
import './forgotLogIn.css';
import ajaxParam from '../../api/ajaxParam';
import qs from 'qs';
import homebackground  from '../../assets/image/bg4.jpg';
const homeImage = {
  width: '100%',
  height: '100%',
  position: 'absolute',
  backgroundSize: '100% 100%', //记得这里100%
  background: `url(${ homebackground })`,
}


class forgotLogIn extends Component {
  state = {
    isNote: true,
    isError: false,
    mobile: '',
    code: '',
    pwd: '',
  }

  // 获取用户输入的密码
  setPwd = (e) => {
    e.preventDefault();
    this.setState({ pwd: e.target.value });
  };

  // 获取用户输入的手机号
  setMobile = (e) => {
    e.preventDefault();
    this.setState({ mobile: e.target.value });
  };

  // 获取用户收入的验证码
  setCode = (e) => {
    e.preventDefault();
    this.setState({ code: e.target.value });
  }

  // 登陆
  logIn = () => {
    const { code, mobile, pwd} = this.state;
    const data = { "mobile": mobile, "code": code, "pwd": pwd };
    const reqResult = (data) => ajaxParam('http://47.94.103.140/gdom/user/forgetpwd', qs.stringify(data), 'post');
    reqResult(data).then(res => {
      alert(res.data);
    }).catch(err => {
      console.log(err);
    })
  };

  // 获取验证码 
  getCode = () => {
    const buttonValue = this.refs.but.props.children;
    const mobile = this.state.mobile;
    if (buttonValue === '获取短信验证码') {
      // 请求获取短信验证码的接口
      const data = { "mobile": mobile };
      const reqResult = (data) => ajaxParam('http://47.94.103.140/gdom/verifymessage', qs.stringify(data), 'post');
      reqResult(data).then(res => {
        if (res.data === 'success') {
          // console.log(res)
        }
      }).catch(err => {
        console.log(err);
      })
      console.log("短信验证");
    } else {
      // 请求获取语音验证码的接口
      const data = { "mobile": mobile };
      const reqResult = (data) => ajaxParam('http://47.94.103.140/gdom/verify/speech', qs.stringify(data), 'post');
      reqResult(data).then(res => {
        if (res.data === 'success') {
          // console.log(res)
        }
      }).catch(err => {
        console.log(err);
      })
      console.log("语音验证");
    }
  };

  // 改变button的内容
  changStyle = () => {
    this.setState(prevState => ({
      isNote: !prevState.isNote
    }))
  };

  render() {
    const { isNote, isError } = this.state;
    return (
      <div style={homeImage}>
        <p className="title">欢迎登陆粉笔头系统</p>
        <div className="main">
          <Input.Password placeholder="请输入新密码..." className="InpPwd" onChange={this.setPwd} />
          <Input placeholder="请输入手机号..." className="InpNumber" onChange={this.setMobile} />
          <div className="getCode">
            <Input placeholder="请输入验证码" className="Inp" size={'large'} onChange={this.setCode} />
            <Button type="primary" ref="but" className="btn" size={'large'} onClick={this.getCode}>{isNote ? '获取短信验证码' : '获取语音验证码'}</Button>
          </div>
          <p className="change" onClick={this.changStyle}>{isNote ? '语音验证' : '短信验证'}</p>
          <Button type="primary" onClick={this.logIn} style={{ width: "300px" }} size={'large'}>重置密码</Button>
          {isError ? <Alert
            message="Error"
            description="验证失败，请重新验证"
            type="error"
            showIcon
          /> : null}
        </div>
      </div>
    )
  }
}

export default forgotLogIn;