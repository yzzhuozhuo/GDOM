import React, { Component } from 'react'
import { Table, Button } from 'antd';
import ajaxParam from '../../api/ajaxParam';
import ajax from '../../api/ajax';
import qs from 'qs';

class studnetCheck extends Component {
  state = {
    columns: [
      {
        title: '编号',
        dataIndex: 'number',
      },
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '学号',
        dataIndex: 'cno',
      },
      {
        title: '班级',
        dataIndex: 'class',
      },
      {
        title: '题目',
        dataIndex: 'items',
      },
      {
        title: '优先级',
        dataIndex: 'priority',
      },
    ],
    data: [

    ],
    uid: '',
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    counter: 1,
    subjectId: '',
    priority: ''
  };


  componentWillMount = () => {
    this.setState({uid: this.props.uid});
  }

  componentDidMount = () => {
    const { uid, dataKey } = this.state;
    const data = { "uid": uid };
    const reqResult = (data) => ajaxParam('http://47.94.103.140/gdom/lecture/getselecting', qs.stringify(data), 'post');
    reqResult(data).then(res => {
      console.log(res);
      const res_data = res.data;
      const table_data = [];
      res_data.forEach((item, index) => {
        if (item["student"]) {
          let data_item = {
            key: index + 1,
            number: index + 1,
            class: item["student"].clazz,
            item: item["selecting"].tittle,
            priority: item["selecting"].priority,
            name: item["userInfo"].username,
            cno: item["student"].sno,
            items: item["selecting"].tittle,
            subjectId: item["selecting"].subjectId,
          }
          table_data.push(data_item)
        }
      });
      // console.log(table_data);
      this.setState({
        data: table_data
      })
    }).catch(err => {
      console.log(err);
    })
  }


  start = () => {
    this.setState({ loading: true });
    this.setState({ counter: this.state.counter + 1 });
    // ajax request after empty completing

    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);

    const data = { "uid": 2, "subjectId": this.state.subjectId, "priority": this.state.priority };
    const reqResult = (data) => ajax('http://47.94.103.140/gdom/lecture/commitSelecting', JSON.stringify(data), 'post');
    reqResult(data).then(res => {
      if (res.status === 200) {
        alert('提交成功')
      }
    }).catch(err => {
      console.log(err);
    })
  };

  onSelectChange = selectedRowKeys => {
    // console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys});
  };

  // 点击拿到每一行的数据
  onClickSelect = (recordr) => {
    // console.log(recordr);
    this.setState({ subjectId: recordr.subjectId, priority: recordr.priority })
  }

  render() {
    const { loading, selectedRowKeys, columns, data, counter } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelect: this.onClickSelect,
      type: 'radio'
    };
    const hasSelected = selectedRowKeys.length > 0 && counter <= 4;
    return (
      <div>
        <div>
          <Button type="primary" onClick={this.start} disabled={!hasSelected} loading={loading}>
            提交
          </Button>
        </div>
        <Table rowSelection={rowSelection} columns={columns} dataSource={data} pagination={{ pageSize: 4 }} />
        {/* <Pagination defaultCurrent={1} total={50} /> */}
      </div>
    );
  }
}

export default studnetCheck
