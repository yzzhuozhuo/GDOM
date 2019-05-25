import React, { Component } from 'react'
import { Table, Divider, Tag, Button } from 'antd';
import { Card } from 'antd';
import './myStudent.css';
import ajaxParam from '../../api/ajaxParam';
import qs from 'qs';

export class myStudent extends Component {
  state = {
    id: '',
    // 表格每一行的key 
    dataKey: '1',
    // 点击展示详情显示模块
    showDetails: false,
    columns: [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        align: 'center'
      },
      {
        title: '学号',
        dataIndex: 'number',
        key: 'number',
        align: 'center'
      },
      {
        title: '题目',
        dataIndex: 'item',
        key: 'item',
        align: 'center'
      },
      {
        title: '期中成绩',
        dataIndex: 'midterm',
        key: 'midterm',
        align: 'center'
      },
      {
        title: '期末成绩',
        dataIndex: 'final',
        key: 'final',
        align: 'center'
      },
      {
        title: '期末成绩',
        dataIndex: 'score',
        key: 'score',
        align: 'center'
      },
      // {
      //   title: '详情信息',
      //   key: 'action',
      //   align: 'center',
      //   render: (text, record) => (
      //     <span>
      //       <Button type="primary" onClick={this.showItem}>详情</Button>
      //       {/* {this.state.showDetails ? <div>
      //         <span>{record.name}</span>
      //         <span>{record.number}</span>
      //       </div> : null} */}
      //     </span>
      //   ),
      // },
    ],
    data: [],
    // 其他要展示的值
    otherValue: {},
    uid: ''
  }
  showItem = (e, text, record) => {
    e.preventDefault();
    // this.setState({ showDetails: true });
    this.setState(prevState => ({
      showDetails: !prevState.showDetails
    }));

    setTimeout(() => {
      this.setState({ showDetails: false })
    }, 3000)
  }

  componentWillMount = () => {
    this.setState({ uid: this.props.uid });
  }

  componentDidMount = () => {
    const { uid, dataKey } = this.state;
    const data = { "uid": uid };
    const reqResult = (data) => ajaxParam('http://47.94.103.140/gdom/lecture/mystudent', qs.stringify(data), 'post');
    reqResult(data).then(res => {
      console.log(res);
      const res_data = res.data;
      const table_data = [];
      res_data.forEach(item => {
        let data_item = {
          key: item["student"].sid,
          name: item["userInfo"].username,
          number: item["student"].sno,
          item: item["tittle"],
          midterm: item["student"].midScore ? item["student"].midScore : '—',
          final: item["student"].finalScore ? item["student"].finalScore : '—',
          score: item["student"].score ? item["student"].score : '—',
        }
        table_data.push(data_item)
      });
      // console.log(table_data);
      this.setState({
        data: table_data
      })
    }).catch(err => {
      console.log(err);
    })
  }

  click = (recordr, owkey) => {
    // console.log(recordr, owkey)
    this.setState({ otherValue: recordr });
  }
  render() {
    const columns = this.state.columns;
    const data = this.state.data;
    const showDetails = this.state.showDetails;
    const uid = this.state.uid;
    const otherValue = this.setState.otherValue;
    return (
      <div>
        <Table columns={columns} dataSource={data}
          onRow={(record, rowkey) => {
            return {
              //点击行 record 指的本行的数据内容，rowkey指的是本行的索引
              onClick: this.click.bind(this, record, rowkey)
            }
          }}
        />
      </div>
    )
  }
}

export default myStudent;
