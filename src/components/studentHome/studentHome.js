import React, { Component } from 'react';
import './studentHome.css'
class studentHome extends Component {
  
  state = {
    uid: ''
  }

  // componentWillMount = () => {
  //   const pathId = this.props.location.query.uid;
  //   this.setState({uid: pathId})  
  // }

  toMySelect = () => {
    this.props.history.push({pathname: '/selectTopic'});
    // this.props.history.replace({ pathname: '/teacherHome', query: {"id": res.data.uid} });    
  }
  
  toMyProject = () => {
    this.props.history.push({
      pathname: '/graduationProject'
    });
  }
  
  toMyFindRepeat = () => {
    this.props.history.push({
      pathname: '/findRepeat'
    });
  }

  render() {
    return (
      <div id="my-main">
        <div className="box-my">
        <div className="select-my" onClick={this.toMySelect}>我要选题</div>
        <div className="project-my" onClick={this.toMyProject}>我的毕设</div>
        <div className="repeat-my" onClick={this.toMyFindRepeat}>论文查重</div>
        </div>
      </div>
    )
  }
}
export default studentHome;