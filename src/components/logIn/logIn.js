import React, { Component } from 'react';
import qs from 'qs';
import ajaxParam from '../../api/ajaxParam';
import homebackground  from '../../assets/image/bg1.jpg';
import homebackground_02  from '../../assets/image/bg2.jpg';
// import cookie from 'react-cookie';
import './logIn.css';
import { Form, Icon, Input, Button, Checkbox, Radio, Alert } from 'antd';
const RadioGroup = Radio.Group;

const homeImage = {
  width: '100%',
  height: '100%',
  position: 'absolute',
  backgroundSize: '100% 100%', //记得这里100%
  background: `url(${ homebackground })`,
}
const homeImage_02 = {
  width: '100%',
  height: '100%',
  position: 'absolute',
  backgroundSize: '100% 100%', //记得这里100%
  background: `url(${ homebackground_02 })`,
}

class NormalLoginForm extends Component {
  state = {
    isError: false,
    resValueCno: '',
    resValuePwd: '',
    checkUser: 'teacher',
    image: false
  }

  onChange = e => {
    console.log('radio checked', e.target.value);
    this.setState({
      checkUser: e.target.value,
    });
  };

  handleSubmit = e => {
    const checkUser = this.state.checkUser;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        const cno = values.username;
        const pwd = values.password;
        const data = { "cno": cno, "pwd": pwd ,"type": checkUser};
        const reqResult = (data) => ajaxParam('http://47.94.103.140/gdom/login/pwd', qs.stringify(data), 'post');
        reqResult(data).then(res => {
          if (res.data.islogin) {
            console.log(res);
            if (res.data.role === 'student') {
              // 跳转到学生主页
              window.location.href=`http://47.94.103.140:3000/?userid=${res.data.uid}`             
            } else {
              // 跳转到老师主页
             this.props.history.replace({ pathname: '/teacherHome', query: {"uid": res.data.uid, "role": res.data.role, "username":res.data.username} });
            }
          } else {
            this.setState({ isError: true })
            setTimeout(() => {
              this.setState({ isError: false })
            }, 2000)
          }
        }).catch(err => {
          console.log(err);
        })
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {isError,image} = this.state.isError;
    return (
      <div style={image ? homeImage : homeImage_02} className="bg">
        <p className="title">欢迎登陆粉笔头系统</p>
        {/* {isForgot ? <ForgotLogIn /> : ''}
        {isQuick ? <QuickLogIn /> : ''} */}
        <div className="main">
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: 'Please input your username!' }],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Username"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="Password"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(<Checkbox>Remember me</Checkbox>)}
              <a className="login-form-forgot" href="#/forgotLogIn">
                忘记密码
          </a>
              <Button type="primary" htmlType="submit" className="login-form-button">
                Log in
          </Button>
              Or <a href="#/quickLogIn">快速登陆</a>
              <RadioGroup onChange={this.onChange} value={this.state.checkUser} style={{paddingLeft: 60}}>
                <Radio value={'teacher'}>老师</Radio>
                <Radio value={'student'}>学生</Radio>
              </RadioGroup>
            </Form.Item>
            {isError ? <Alert
              message="Error"
              description="密码错误，请重新输入"
              type="error"
              showIcon
            /> : null}
          </Form>
        </div>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);

export default WrappedNormalLoginForm;