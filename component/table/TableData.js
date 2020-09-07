import React, { Component } from 'react';
import { Table } from 'antd';
import { getConfig } from 'react-uikit/utils/uikitConfig';
import { objectEquals } from '../../utils/functionUtil';
export default class TableData extends Component {
  static defaultProps = {
    allowGetData: true,
    ...getConfig('component/table/TableData'),
  };

  state = {
    data: [],
    loading: false,
    pagination: {
      pageSize: 10,
    },
    // page: 0,
  };

  componentDidMount() {
    this.actionGetData(this.props);
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.clear !== 0 && nextProps.clear !== this.props.clear) {
      this.setState({
        data: [],
        loading: false,
        pagination: {
          pageSize: 10,
        },
      });
      return;
    }
    if (nextProps.reload !== this.props.reload) {
      this.actionGetData({ ...nextProps });
      this.setState({ pagination: { ...this.state.pagination, ...{ current: 1 } } });
    }
    if (!objectEquals(nextProps.paramSearch, this.props.paramSearch)) {
      this.actionGetData({ ...nextProps });
    }
  };

  handleTableChange = (pagination) => {
    this.actionGetData(this.props, { page: pagination.current });
  };

  actionGetData = async (props, { page } = { pageSize: 10 }) => {
    const {
      allowGetData,
      paramSearch,
      service,
      handleGetDataResponse,
      getPageIndexForSevice,
    } = props;
    if (!service) {
      return;
    }
    if (this.state.loading || !allowGetData) {
      return;
    }

    this.setState({
      loading: true,
    });
    try {
      const res = await service({
        page: getPageIndexForSevice(page) || 0,
        size: this.state.pagination.pageSize,
        ...paramSearch,
      });
      const { content, total } = handleGetDataResponse(res);
      const pagination = { ...this.state.pagination };
      pagination.total = total;
      pagination.current = page;
      this.setState({
        data: content,
        pagination,
      });
    } finally {
      this.setState({
        loading: false,
      });
    }
  };

  render() {
    return (
      <Table
        bordered
        scroll={this.props.disableScroll ? undefined : { x: true }}
        loading={this.state.loading}
        pagination={this.state.pagination}
        onChange={this.handleTableChange}
        dataSource={this.state.data}
        columns={this.props.columns}
        {...this.props}
      />
    );
  }
}
