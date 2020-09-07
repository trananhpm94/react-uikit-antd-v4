import React, { Component } from 'react';
import { Table, Form } from 'antd';
import EditableCell, { EditableContext } from './EditableCell';

class TableDataEditCell extends Component {
  static defaultProps = {
    allowGetData: true,
    rowKey: 'id',
    handleSaveCellData: false,
  };

  state = {
    data: [],
    loading: false,
    pagination: {
      pageSize: 10,
    },
  };
  componentWillMount = () => {};

  componentDidMount() {
    const { paramSearch } = this.props;
    if (!paramSearch) {
      this.actionGetData(this.props);
    }
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.reload !== this.props.reload) {
      this.actionGetData({ ...nextProps });
    }
    if (nextProps.paramSearch !== this.props.paramSearch) {
      this.actionGetData({ ...nextProps });
    }
  };

  getConfigCol = () => {
    const columns = [...this.props.columns];
    return columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          renderFormItemEdit: col.renderFormItemEdit,
          dataIndex: col.dataIndex,
          rowKey: this.props.rowKey,
          editable: col.editable,
          alwayShowEdit: col.alwayShowEdit,
        }),
      };
    });
  };

  actionGetData = async (props, { page } = {}) => {
    const { allowGetData, paramSearch, service } = props;

    if (this.state.loading || !allowGetData) {
      return;
    }

    this.setState({
      loading: true,
    });
    const res = await service({ page, ...paramSearch });
    const pagination = { ...this.state.pagination };
    pagination.total = res.data.totalResults;
    this.setState({
      data: res.data.items,
      loading: false,
      pagination,
    });
  };

  handleSave = (keyValue, toggleEdit) => () => {
    this.props.form.validateFields(async (error, tableDataEdit) => {
      if (error) {
        console.error('Form error');
      }
      const rowDataEdit = tableDataEdit[keyValue];
      const newData = [...this.state.data];
      const index = newData.findIndex(item => keyValue === item[this.props.rowKey]);
      if (index === -1) {
        console.error(`Không tìm thấy data key[${keyValue}]`);
        return;
      }
      const oldItem = newData[index];
      const newItem = { ...oldItem, ...rowDataEdit };
      // handle save  data
      let itemSaved = newItem;
      if (this.props.handleSaveCellData) {
        itemSaved = await this.props.handleSaveCellData(newItem, { error, oldItem });
      }
      if (!itemSaved) {
        return;
      }
      newData.splice(index, 1, itemSaved);
      toggleEdit();
      this.setState({ data: newData });
    });
  };

  handleTableChange = pagination => {
    this.actionGetData(this.props, { page: pagination.current });
  };

  isEditing = record => record[this.props.rowKey] === this.state.editingKey;

  render() {
    const columns = this.getConfigCol();
    const components = {
      body: {
        cell: EditableCell,
      },
    };
    return (
      <EditableContext.Provider value={{ form: this.props.form, onSaveCell: this.handleSave }}>
        <Table
          {...this.props}
          bordered
          scroll={{ x: true }}
          components={components}
          loading={this.state.loading}
          pagination={this.state.pagination}
          onChange={this.handleTableChange}
          dataSource={this.state.data}
          columns={columns}
        />
      </EditableContext.Provider>
    );
  }
}

export default Form.create()(TableDataEditCell);
