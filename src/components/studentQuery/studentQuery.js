import React, { Component } from 'react'
import { Table, Input, Button, Icon } from 'antd';
import Highlighter from 'react-highlight-words';
import ajaxParam from '../../api/ajaxParam';
import qs from 'qs';

class studentQuery extends Component {
  state = {
    data: [],    
    searchText: '',
    uid: ''
  };

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ),
  });
  componentWillMount = () => {
    this.setState({uid: this.props.uid});
  }

  componentDidMount = () => {
    const { uid, dataKey} = this.state;
    const data = {"uid":uid};
    const reqResult = (data) => ajaxParam('http://47.94.103.140/gdom/lecture/querystudent', qs.stringify(data), 'post');
    reqResult(data).then(res => {
     console.log(res);
    //  console.log(res);
     const res_data = res.data;
     const table_data = [];
     res_data.forEach((item,index) => {
      //  console.log(item);
      //  console.log(item["student"].sno);
      if (item["student"]) {
        let data_item = {
          key: item["userInfo"].uid,
          index: index + 1,
          name: item["userInfo"].username,
          cno: item["student"].sno ? item["student"].sno : '—',
          sex: item["userInfo"].sex ? item["userInfo"].sex : '—' ,
          role: item["userInfo"].role,
          school: item["userInfo"].university,
          collage: item["userInfo"].college,
          professional: item["userInfo"].professional,
          clazz: item["student"].clazz ? item["student"].clazz : '—',
        }
        table_data.push(data_item)
      }
    });
    console.log(table_data);
    this.setState({
      data: table_data
    })
    }).catch(err => {
      console.log(err);
    })
  }

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  onSubmit = () => {
    console.log('提交')
  };

  render() {
    const data = this.state.data;
    const columns = [
      {
        title: '编号',
        dataIndex: 'index',
        key: 'index',
        width: '10%',
        // ...this.getColumnSearchProps('index'),
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: '10%',
        ...this.getColumnSearchProps('name'),
      },
      {
        title: '学号',
        dataIndex: 'cno',
        key: 'cno',
        width: '20%',
        align: 'center',
        ...this.getColumnSearchProps('cno'),
      },
      {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex',
        align: 'center'
        // ...this.getColumnSearchProps('sex'),
      },
      {
        title: '学校',
        dataIndex: 'school',
        key: 'school',
        align: 'center'
        // ...this.getColumnSearchProps('school'),
      },
      {
        title: '学院',
        dataIndex: 'collage',
        key: 'collage',
        align: 'center'
        // ...this.getColumnSearchProps('collage'),
      },
      {
        title: '专业',
        dataIndex: 'professional',
        key: 'professional',
        align: 'center'
        // ...this.getColumnSearchProps('professional'),
      },
      {
        title: '班级',
        dataIndex: 'clazz',
        key: 'clazz',
        align: 'center'
        // ...this.getColumnSearchProps('clazz'),
      },
    ];
    return (
      <div>
        <Table columns={columns} dataSource={data} pagination={{pageSize: 5}}/>
        {/* <Button type="primary" onClick={this.onSubmit} style={{position:"absolute", top: 60, right: 688}}>提交</Button> */}
      </div>
    )
  }
}

export default studentQuery
