import React, { Component } from 'react'
import { Table, Input, InputNumber, Popconfirm, Form } from 'antd';
// import personalCenter from '../personalCenter/personalCenter';
import { Card } from 'antd'
import './projectManage.css';
import ajaxParam from '../../api/ajaxParam';
import ajax from '../../api/ajax';
import qs from 'qs';

const EditableContext = React.createContext();

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`,
                },
              ],
              initialValue: record[dataIndex],
            })(this.getInput())}
          </Form.Item>
        ) : (
            children
          )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

class EditableTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: '',
      editingKey: '',
      data: [
        // {
        //   key: '0',
        //   name: 'John',
        //   number: 16406050305,
        //   item: '基于ARM嵌入式技术实现的智能小车',
        //   midterm: 90,
        //   final: 90,
        //   score: 95,
        //   tags: '',
        // }
      ]
    };
    this.columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
      },
      {
        title: '学号',
        dataIndex: 'number',
        key: 'number',
        align: 'center',
        editable: true
      },
      {
        title: '题目',
        dataIndex: 'item',
        key: 'item',
        align: 'center',
      },
      {
        title: '期中成绩',
        dataIndex: 'midterm',
        key: 'midterm',
        align: 'center',
        editable: true,
      },
      {
        title: '期末成绩',
        dataIndex: 'final',
        key: 'final',
        align: 'center',
        editable: true,
      },
      {
        title: '最终成绩',
        dataIndex: 'score',
        key: 'score',
        align: 'center',
        editable: true,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: '15%',
        align: 'center',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a href="javascript:;" onClick={() => this.save(form, record.key)} style={{ marginRight: 8 }}>
                    确认
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                <a>取消</a>
              </Popconfirm>
            </span>
          ) : (
              <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>
                编辑
            </a>
            );
        },
      },
    ];
  }

  isEditing = record => record.key === this.state.editingKey;

  componentWillMount = () => {
    this.setState({uid: this.props.uid});
  }

  componentDidMount = () => {
    const { uid, dataKey } = this.state;
    const data = { "uid": uid };
    const reqResult = (data) => ajaxParam('http://47.94.103.140/gdom/lecture/getallinfo', qs.stringify(data), 'post');
    reqResult(data).then(res => {
      console.log(res);
      const res_data = res.data;
      const table_data = [];
      res_data.forEach((item,index) => {
          let data_item = {
            key: index + 1,
            name: item.username,
            number: item.sno,
            item: item.tittle,
            midterm: item.midScore ? item.midScore : '—',
            final: item.finalScore ? item.finalScore : '—',
            score: item.score ? item.score : '—',
          }
          table_data.push(data_item)  
      });
      console.log(table_data);
      this.setState({
        data: table_data
      })
    }).catch(err => {
      console.log(err);
    })
  }

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ data: newData, editingKey: '' });
        // console.log(this.state.data);
        // 学号 期中 期末 总成绩
        console.log(row);
        const data = { "uid": this.state.uid, "sno": row.number, "midScore": row.midterm, "finalScore": row.final, "score": row.score };
        const reqResult = (data) => ajax('http://47.94.103.140/gdom/lecture/updatescore', JSON.stringify(data), 'post');
        reqResult(data).then(res => {
          // console.log(res)
          if (res.status === 200) {
            alert('更新成功');
          } else {
            alert('更新失败');
          }
        }).catch(err => {
          console.log(err);
        })
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: '' });
        console.log(this.state.data);
      }
    });
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  render() {
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <EditableContext.Provider value={this.props.form}>
        <Table
          components={components}
          bordered
          dataSource={this.state.data}
          columns={columns}
          rowClassName="editable-row"
          pagination={{
            onChange: this.cancel,
            pageSize: 4
          }}
        />
      </EditableContext.Provider>
    );
  }
}
const projectManage = Form.create()(EditableTable);
export default projectManage;