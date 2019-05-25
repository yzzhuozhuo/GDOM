import React, { Component } from 'react';
import { Tag, Button, Input, Alert } from 'antd';
import './accountManage.css';
import ajaxParam from '../../api/ajaxParam';
import ajax from '../../api/ajax';
import qs from 'qs';
// import { format } from 'url';

export class accountManage extends Component {
  state = {
    uid: '',
    name: '',
    cno: '',
    mobile: '',
    isError: false,
    code: '',
    oldPwd: '',
    newPwd: '',
    isShowChangeMobile: false,
    isShowChangePwd: false,
  }


  componentWillMount = () => {
    this.setState({ uid: this.props.uid });
  }

  // /user/selfinfo
  componentDidMount = () => {
    const { uid, dataKey } = this.state;
    const data = { "uid": uid };
    const reqResult = (data) => ajaxParam('http://47.94.103.140/gdom/user/selfinfo', qs.stringify(data), 'post');
    reqResult(data).then(res => {
      const data = res.data
      this.setState({ name: data.userInfo.username, mobile:data.userInfo.mobile})
    }).catch(err => {
      console.log(err);
    })
  }

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

  setOldPwd = (e) => {
    e.preventDefault();
    this.setState({ oldPwd: e.target.value });
  }

  setNewPwd = (e) => {
    e.preventDefault();
    this.setState({ newPwd: e.target.value });
  }

  // 点击修改或者绑定手机号时显示对应的模块
  showChangeMobile = () => {
    this.setState(prevState => ({ isShowChangeMobile: !prevState.isShowChangeMobile }))
  }

  // 点击密码重置时显示对应的模块
  showChangePwd = () => {
    this.setState(prevState => ({ isShowChangePwd: !prevState.isShowChangePwd }))
  }

  // 点击提交重置密码时的事件，请求ajax，传递参数
  changePwd = () => {
    const uid = this.state.uid;
    const oldPwd = this.state.oldPwd;
    const newPwd = this.state.newPwd;
    const data = { "uid": uid, "oldpwd": oldPwd, "newpwd": newPwd };
    const reqResult = (data) => ajaxParam('http://47.94.103.140/gdom/user/resetpwd', qs.stringify(data), 'post');
    reqResult(data).then(res => {
      if (res.status === 200) {
        alert('重置成功');
      } else {
        alert('重置失败');
      }
      // console.log(res)
    }).catch(err => {
      console.log(err);
    })
  }

  // 重置手机号
  changeMobile = () => {
    const uid = this.state.uid;
    const code = this.state.code;
    const mobile = this.state.mobile;
    const data = { "uid": uid, "mobile": mobile, "code": code };
    const reqResult = (data) => ajaxParam('http://47.94.103.140/gdom/user/bindmobile', qs.stringify(data), 'post');
    reqResult(data).then(res => {
      // console.log(res)
      alert(res.data);
    }).catch(err => {
      console.log(err);
    })
  };

  // 获取验证码 
  getCode = () => {
    const mobile = this.state.mobile;
    // 请求获取短信验证码的接口
    const data = { "mobile": mobile };
    const reqResult = (data) => ajax('http://47.94.103.140/gdom/login/message', qs.stringify(data), 'post');
    reqResult(data).then(res => {
      if (res.data === 'success') {
        // console.log(res)
      }
    }).catch(err => {
      console.log(err);
    })
    console.log("短信验证");
  };

  render() {
    const { name, cno, mobile, isShowChangeMobile, isError, isShowChangePwd } = this.state;
    return (
      <div className="content">
        <div className="name-con">
          <div className="name">姓名：{name}</div>
          {/* <div className="cno">学号：{cno}</div> */}
        </div>
        <div className="telephone">
          <span>手机号：{mobile ? mobile : '未绑定手机号'}</span>
          <Button onClick={this.showChangeMobile}>{mobile ? '修改' : '绑定'}</Button>
        </div>
        {isShowChangeMobile ? <div className="change-mobile">
          <Input placeholder="请输入手机号..." className="InpNumber" onChange={this.setMobile} />
          <div className="getCode">
            <Input placeholder="请输入验证码" className="Inp" size={'large'} onChange={this.setCode} />
            <Button type="primary" ref="but" className="btn-pwd" size={'large'} onClick={this.getCode}>获取短信验证码</Button>
          </div>
          <Button type="primary" onClick={this.changeMobile} style={{ width: "300px" }} size={'large'}>重置手机号</Button>
          {isError ? <Alert
            message="Error"
            description="验证失败，请重新验证"
            type="error"
            showIcon
          /> : null}
        </div> : null}

        <Button type="primary" size={'large'} onClick={this.showChangePwd}>密码重置</Button>
        {isShowChangePwd ? <div className="change-pwd">
          <Input.Password placeholder="请输入旧密码..." onChange={this.setOldPwd} />
          <Input.Password placeholder="请输入新密码..." className='inp-pwd' onChange={this.setNewPwd} />
          <Button type="primary" size={'large'} onClick={this.changePwd}>重置密码</Button>
        </div> : null}

      </div>
    )
  }
}

export default accountManage
