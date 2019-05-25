
import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import MyStudent from '../myStudent/myStudent';
import StudentCheck from '../studentCheck/studnetCheck';
import SubjectIssue from '../subjectIssue/subjectIssue';
import ProjectManage from '../projectManage/projectManage';
import AddUser from '../addUser/addUser';
import TeacherQuery from '../teacherQuery/teacherQuery';
import StudentQuery from '../studentQuery/studentQuery';
import PersonalCenter from '../personalCenter/personalCenter';
import AccountManage from '../accountManage/accountManage';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

class SiderDemo extends Component {
  state = {
    collapsed: false,
    key: '',
    uid: '',
    role: ''
  };

  componentWillMount = () => {
    const pathId = this.props.location.query.uid;
    const role = this.props.location.query.role;
    this.setState({uid: pathId, role: role})  
  }
  // componentDidMount = () => {
  //   const pathId = this.props.location.query.id;
  //   this.setState({id: pathId})
  //   // console.log(pathId);
  // }

  // 点击跳转相应的组件页面
  linkTo = (e) => {
    // this.context.router.push(item.key);
    this.setState({ key: e.key })
  }

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    const { key, uid} = this.state;
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" onClick={this.linkTo}>
            <Menu.Item key="myStudent">
              <Icon type="team" />
              <span>我的学生</span>
            </Menu.Item>
            <Menu.Item key="studentCheck">
              <Icon type="solution" />
              <span>学生审核</span>
            </Menu.Item>
            <Menu.Item key="subjectIssue">
              <Icon type="file-text" />
              <span>选题发布</span>
            </Menu.Item>
            <Menu.Item key="projectManage">
              <Icon type="project" />
              <span>毕设管理</span>
            </Menu.Item>
            <SubMenu
              key="sub1"
              title={
                <span>
                  <Icon type="user" />
                  <span>用户管理</span>
                </span>
              }
            >
              <Menu.Item key="addUser">用户添加</Menu.Item>
              <Menu.Item key="teacherQuery">老师查询</Menu.Item>
              <Menu.Item key="studentQuery">学生查询</Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub2"
              title={
                <span>
                  <Icon type="team" />
                  <span>我的信息</span>
                </span>
              }
            >
              <Menu.Item key="personalCenter">个人中心</Menu.Item>
              <Menu.Item key="accountManage">账号管理</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout>
          {/* <Header style={{ background: '#fff', padding: 0 }} /> */}
          <div style={{ fontSize: 20, color: 'lightskyblue', paddingTop: 10, paddingLeft: 18 }}>
            <Icon type="smile" /> {''}
            <span>欢迎来到粉笔头管理系统</span>
            {/* <span>{this.state.uid}</span> */}
            {/* <AvatarUpload /> */}
          </div>
          <Content style={{ margin: '0 16px', height: 500 }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Student</Breadcrumb.Item>
              <Breadcrumb.Item>Teacher</Breadcrumb.Item>
            </Breadcrumb>
            {key === '' ? <div style={{ textAlign: "center", paddingTop: 230, color: 'blue', minHeight: 460, fontSize: 20 }}>I'm Teacher.</div>
              : null}
            {key === 'myStudent' ? <MyStudent uid={uid} /> : null}
            {key === 'studentCheck' ? <StudentCheck uid={uid}/> : null}
            {key === 'subjectIssue' ? <SubjectIssue uid={uid}/> : null}
            {key === 'projectManage' ? <ProjectManage uid={uid}/> : null}
            {key === 'addUser' ? <AddUser uid={uid}/> : null}
            {key === 'teacherQuery' ? <TeacherQuery uid={uid}/> : null}
            {key === 'studentQuery' ? <StudentQuery uid={uid}/> : null}
            {key === 'personalCenter' ? <PersonalCenter uid={uid}/> : null}
            {key === 'accountManage' ? <AccountManage uid={uid}/> : null}
          </Content>
          <Footer style={{ textAlign: 'center' }}>粉笔头管理系统 @2019</Footer>
        </Layout>
      </Layout>
    );
  }
}

export default SiderDemo;