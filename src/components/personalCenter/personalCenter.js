import React, { Component } from 'react';
import './personalCenter.css';
import { Card } from 'antd';
import ajaxParam from '../../api/ajaxParam';
import ajax from '../../api/ajax';
import qs from 'qs';

export class personalCenter extends Component {
  state = {
    name: '',
    sex: '',
    number: '',
    school: '',
    college: '',
    professional: '',
    time: '',
    uid: ''
  }

  componentWillMount = () => {
    this.setState({uid: this.props.uid});
  }

  componentDidMount = () => {
    const { uid, dataKey } = this.state;
    const data = { "uid": uid };
    const reqResult = (data) => ajaxParam('http://47.94.103.140/gdom/user/selfinfo', qs.stringify(data), 'post');
    reqResult(data).then(res => {
      const data = res.data
      this.setState({ name: data.userInfo.username,sex:data.userInfo.sex,school:data.userInfo.university,college:data.userInfo.college,professional:data.userInfo.professional,time:data.userInfo.entranceDate})
    }).catch(err => {
      console.log(err);
    })
  }

  render() {
    return (
      <div style={{ background: '#ECECEC', padding: '30px' }}>
        <Card title="个人中心" bordered={false} className="card">
          <div>姓名: {this.state.name}</div>
          <div>性别: {this.state.sex}</div>
          {/* <div>学号: {this.state.number}</div> */}
          <div>学校: {this.state.school}</div>
          <div>学院: {this.state.college}</div>
          <div>专业: {this.state.professional}</div>
          <div>入学时间: {this.state.time ? this.state.time : '—'}</div>
        </Card>
      </div>
      // <div id="main">
      //   <div>姓名: {this.state.name}</div>
      //   <div>性别: {this.state.sex}</div>
      //   <div>学号: {this.state.number}</div>
      //   <div>学校: {this.state.school}</div>
      //   <div>专业: {this.state.specialty}</div>
      //   <div>入学时间: {this.state.time}</div>
      // </div>
    )
  }
}

export default personalCenter;
