import React, { Component } from 'react'
// import { Input } from 'antd';
import { Table, Input, Button, Popconfirm, Form } from 'antd';
import './addUser.css'
import ajax from '../../api/ajax'
import qs from 'qs'
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
    // "uid":uid,"username":'杨卓',"cno":16666,"role": 'student', 'university': '西科大',"college":'电控',"professional":'zzz',"clazz":'aaa',"entranceTime":'2016'}
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

class addUser extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '编号',
        dataIndex: 'index',
        editable: false,
        align: 'center'
      },
      {
        title: '姓名',
        dataIndex: 'name',
        editable: true,
        align: 'center'
      },
      {
        title: '工号(学号)',
        dataIndex: 'cno',
        editable: true,
        align: 'center'
      },
      {
        title: '性别',
        dataIndex: 'sex',
        editable: true,
        align: 'center'
      },
      {
        title: '专业',
        dataIndex: 'professional',
        editable: true,
        align: 'center'
      },
      {
        title: '班级(学生)',
        dataIndex: 'clazz',
        editable: true,
        align: 'center'
      },
    ];

    this.state = {
      dataSource: [
        {
          key: '0',
          index: '1',
          name: '填写姓名',
          cno: '填写学号',
          sex: '填写性别',
          professional: '填写专业',
          clazz: '填写班级'
        },
      ],
      count: 1,
      uid: '',
      university: '',
      college: '',
      entranceTime: '',
      role: '',
      name: '',
      cno: '',
      sex: '',
      professional: '',
      clazz: ''
    };
  }

  componentWillMount = () => {
    this.setState({uid: this.props.uid});
 }

 componentDidMount = () => {
  //  const {uid} = this.state;
  //  const data = {"uid":uid,"username":'杨卓',"cno":16666,"role": 'student', 'university': '西科大',"college":'电控',"professional":'zzz',"clazz":'aaa',"entranceTime":'2016'};
  //  const reqResult = (data) => ajax('http://47.94.103.140/gdom/lecture/mutilregister', qs.stringify(data), 'post');
  //  reqResult(data).then(res => {
  //   console.log(res);
  //   // const data = res.data;
  //  }).catch(err => {
  //    console.log(err);
  //  })
 }

  // 设置学校
  changeSchool = (e) => {
    this.setState({university: e.target.value});
  }

  // 设置学院
  changeCollege = (e) => {
    this.setState({college: e.target.value});
  }

  // 设置时间
  onChange = (date) => {
    var d = new Date(date._d);
    // console.log(d);
    var datetime = d.getFullYear() + '-' +  (d.getMonth() + 1) + '-' + d.getDate()
    // console.log(datetime);
    this.setState({entranceTime: datetime})
  }

  // 设置角色
  handleChange = (value) => {
    // console.log(`selected ${value}`)
    this.setState({role: value})
  }
  // name: '',
  // cno: '',
  // sex: '',
  // professional: '',
  // clazz: ''
  handleSubmit = () => {
  //  console.log(this.state.dataSource);
   const {dataSource, uid,university,college,entranceTime,role} = this.state;
   console.log(dataSource);
   const data = [{"uid": uid,"username":dataSource[0].name,"cno":dataSource[0].cno,"role": role, "university": university,"college":college,"professional":dataSource[0].professional,"clazz":dataSource[0].clazz,"sex":dataSource[0].sex}];
   const reqResult = (data) => ajax('http://47.94.103.140/gdom/lecture/multiregister', JSON.stringify(data), 'post');
   reqResult(data).then(res => {
    console.log(res);
    // const data = res.data;
    if (res.status === 200) {
      alert('添加成功')
    } else {
      alert('添加失败')
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
      name: '填写姓名',
      cno: '填写学号',
      sex: '填写性别',
      professional: '填写专业',
      clazz: '填写班级'
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
        <Input className="inp-school" placeholder="请输入学校" onChange={this.changeSchool} id="inp-school" size="large" />
        <label>学院: </label>
        <Input className="inp-collage" placeholder="请输入学院" onChange={this.changeCollege} id="inp" size="large" />
        <span>入学时间: </span>
        <DatePicker className="date" onChange={this.onChange} placeholder="请选择日期" size="large" />
        <span>角色选择: </span>
        <Select className="select" style={{ width: 150 }} onChange={this.handleChange} size="large">
          <Option value="学生">学生</Option>
          <Option value="老师">老师</Option>
          <Option value="超级老师" >超级老师</Option>
        </Select>
        <Button onClick={this.handleSubmit} type="primary" className="submit">
          提交
        </Button>
        {/* <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }} className="add">
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

export default addUser;
