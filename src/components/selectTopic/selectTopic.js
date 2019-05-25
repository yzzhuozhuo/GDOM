import React, { Component } from 'react'
import { Button , Table} from 'antd'
import './selectTopic.css'

export class selectTopic extends Component {
  state = {
    columns: [
      {
        title: '编号',
        dataIndex: 'number',
        width: '10%'
      },
      {
        title: '题目',
        dataIndex: 'tittle',
        align: 'center'
      },
      {
        title: '老师',
        dataIndex: 'lecture',
      },
      {
        title: '人数',
        dataIndex: 'count',
      },
    ],
    data: [
       {
        key: 1,
        number: '1',
        tittle: '单片机xxxxxx单片机xxxxxx',
        lecture: '杨老师',
        count: '20',
      }, {
        key: 2,
        number: '2',
        tittle: '单片机xxxxxx',
        lecture: '杨老师',
        count: '20',
      }, {
        key: 3,
        number: '3',
        tittle: '单片机xxxxxx',
        lecture: '杨老师',
        count: '20',
      },
      {
        key: 4,
        number: '4',
        tittle: '单片机xxxxxx',
        lecture: '杨老师',
        count: '20',
      }
    ],
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    isShowValue: false
  };

  start = () => {
    this.setState({ loading: true });
    // ajax request after empty completing
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);
  };

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  // 点击拿到每一行的数据
  onClickSelect = (recordr) => {
    console.log(recordr);
  }

  getSelectValeu = (e) => {
    // alert(e.target.value);
    const key = e.target.value;
    this.setState(prevState => ({isShowValue: !prevState.isShowValue}) )
  }
  render() {
    const { loading, selectedRowKeys, columns, data, isShowValue} = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelect: this.onClickSelect,
      type: 'radio'
    };
    const hasSelected = selectedRowKeys.length > 0
    return (
      <div id="select-topic">
        <div className="select-item">
         <Button type="primary" size={'large'} value='one' onClick={this.getSelectValeu}>选题一</Button>
         <Button type="primary" size={'large'} value='two' onClick={this.getSelectValeu}>选题二</Button>
         <Button type="primary" size={'large'} value='three' onClick={this.getSelectValeu}>选题三</Button>
         <Button type="primary" size={'large'} value='four' onClick={this.getSelectValeu}>选题四</Button>
         <Button type="primary" size={'large'} value='five' onClick={this.getSelectValeu}>选题四</Button>
         <Button type="primary" size={'large'} value='six' onClick={this.getSelectValeu}>选题五</Button>
        </div>
        { isShowValue ?
        <div className="showValue">
        <div>
          <Button type="primary" onClick={this.start} disabled={!hasSelected} loading={loading}>
            提交
          </Button>
        </div>
        <Table rowSelection={rowSelection} columns={columns} dataSource={data} pagination={{ pageSize: 4 }} />
        {/* <Pagination defaultCurrent={1} total={50} /> */}
      </div> : null
      }
        
    </div>
    )
  }
}

export default selectTopic;
