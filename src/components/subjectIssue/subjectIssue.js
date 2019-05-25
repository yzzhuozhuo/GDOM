import React, { Component } from 'react'
// import { Input } from 'antd';
import { Table, Input, Button, Popconfirm, Form } from 'antd';
import './subjectIssue.css';
import ajax from '../../api/ajax';
import qs from 'qs';
import { Select } from 'antd';
import { DatePicker } from 'antd';
const Option = Select.Option;

// const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`,
            },
          ],
          initialValue: record[dataIndex],
        })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
      </Form.Item>
    ) : (
        <div
          className="editable-cell-value-wrap"
          style={{ paddingRight: 24 }}
          onClick={this.toggleEdit}
        >
          {children}
        </div>
      );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
            children
          )}
      </td>
    );
  }
}

class subjectIssue extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '编号',
        dataIndex: 'index',
        editable: false,
        align: 'center',
      },
      {
        title: '题目',
        dataIndex: 'item',
        editable: true,
        align: 'center',
      },
      {
        title: '导师',
        dataIndex: 'teacher',
        editable: true,
        align: 'center'
      },
      {
        title: '工号',
        dataIndex: 'cno',
        editable: true,
        align: 'center'
      },
    ];

    this.state = {
      dataSource: [
        {
          key: '0',
          index: '1',
          item: '填写题目',
          teacher: '填写导师',
          cno: '填写工号',
        },
      ],
      count: 1,
      lno: '',
      titile: '',
      university: '',
      college: '',
      startTime: '',
      endTime: '',
      uid: ''
    };
  }
  componentWillMount = () => {
    this.setState({uid: this.props.uid});
  }

  setSchool = (e) => {
    this.setState({university: e.target.value})
  }

  setCollege = (e) => {
    this.setState({college: e.target.value})
  }

  onChangeBengin = (date) => {
    var d = new Date(date._d);
    // console.log(d);
    var datetime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
    // console.log(datetime);
    this.setState({startTime: datetime})
  }

  onChangeLast = (date) => {
    var d = new Date(date._d);
    // console.log(d);
    var datetime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
    // console.log(datetime);
    this.setState({endTime: datetime})
  }

  handleChange = (value) => {
    console.log(`selected ${value}`)
  }

  handleSubmit = () => {
    console.log(this.state.dataSource);
    const { dataSource, uid, university, college, startTime, endTime } = this.state;
    const data = [{ "lno": dataSource[0].cno, "titile": dataSource[0].item, "university": university, "college": college, "startTime": startTime, "endTime": endTime }];
    const reqResult = (data) => ajax('http://47.94.103.140/gdom/lecture/publish', JSON.stringify(data), 'post');
    reqResult(data).then(res => {
      if (res.status === 200) {
        alert('发布成功')
      }
    }).catch(err => {
      console.log(err);
    })

  }

  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };

  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      index: count,
      item: '填写题目',
      teacher: '填写导师',
      cno: '填写工号',
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
  };

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
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
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
        <label>学校: </label>
        <Input className="inp-school" placeholder="填写学校" onChange={this.setSchool} id="inp-school" size="large" />
        <label>学院: </label>
        <Input className="inp-collage" placeholder="填写学院" onChange={this.setCollege} id="inp" size="large" />
        <span>开始时间: </span>
        <DatePicker className="date" onChange={this.onChangeBengin} placeholder="请选择日期" size="large" />
        <span>结束时间: </span>
        <DatePicker className="date" onChange={this.onChangeLast} placeholder="请选择日期" size="large" />
        <Button onClick={this.handleSubmit} type="primary" className="Submit">
          提交
        </Button>
        {/* <Button onClick={this.handleAdd} type="primary" className="add" >
          增加一行
        </Button> */}
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
          size={'middle'}
          pagination={{ pageSize: 3 }}
        />
      </div>
    );
  }
}


export default subjectIssue;
