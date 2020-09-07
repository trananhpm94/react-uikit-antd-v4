import React, { Component } from 'react';
import { Select } from 'antd';
import { objectEquals } from 'react-uikit/utils/functionUtil';
import { getConfig } from 'react-uikit/utils/uikitConfig';

const { Option } = Select;
export default class SelectAjax extends Component {
  static defaultProps = {
    keyValue: 'id',
    keyLabel: 'name',
    handleGetDataResponse: res => res.data.content,
    allowClear: true,
    allowGetData: true,
    allowGetObjSelected: false,
    typeValue: 'string',
    disabled: false,
    ...getConfig('component/input/SelectAjax'),
  };
  state = {
    data: [],
    loading: false,
  };

  componentDidMount = () => {
    this.actionGetData(this.props);
  };

  componentWillReceiveProps = nextProps => {
    if (!objectEquals(nextProps.params, this.props.params)) {
      this.actionGetData(nextProps);
    }
    this.checkValueNumber(nextProps);
  };

  setObjSelected = value => {
    const { allowGetObjSelected } = this.props;
    if (!allowGetObjSelected) {
      return;
    }
    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      [this.createFieldObjSelectedName()]:
        this.state.data.filter(item => value === this.valueOpt(item))[0] || {},
    });
  };

  checkValueNumber = props => {
    const { value, typeValue, onChange } = props;
    if (typeValue === 'string') {
      return;
    }
    if (!value || typeof value === 'number') {
      return;
    }
    if (typeValue === 'int') {
      const numberValue = parseInt(value);
      onChange(numberValue);
    }
  };

  createFieldObjSelectedName = () => {
    const { name: fieldName } = this.props['data-__field'];
    return `objSelected.${fieldName}`;
  };

  createFieldObjSelected = () => {
    const { allowGetObjSelected } = this.props;
    if (!allowGetObjSelected) {
      return;
    }
    const { getFieldDecorator } = this.props.form;
    getFieldDecorator(this.createFieldObjSelectedName(), { initialValue: {} });
  };

  removeValue = () => {
    const { name: fieldName } = this.props['data-__field'];
    const { value } = this.props;
    const { setFieldsValue } = this.props.form;
    if (value && setFieldsValue) {
      setFieldsValue({ [fieldName]: undefined });
    }
  };

  actionGetData = async (props = {}, paramSearch = {}) => {
    this.removeValue();
    const { allowGetData, params, service, handleGetDataResponse } = props;
    if (!allowGetData) {
      this.setState({
        data: [],
      });
      return;
    }
    this.setState({
      loading: true,
    });
    const res = await service({ ...params, ...paramSearch });
    const data = handleGetDataResponse(res);
    this.setState(
      {
        data,
        loading: false,
      },
      () => {
        this.checkValueNumber(props);
        this.setObjSelected(props.value);
      }
    );
  };

  valueOpt = item => {
    const { keyValue, setValue } = this.props;
    const value = setValue ? setValue(item) : item[keyValue];
    return value;
  };

  labelOpt = item => {
    const { keyLabel, setLabel } = this.props;
    return setLabel ? setLabel(item) : item[keyLabel];
  };

  handleSelectChange = value => {
    this.props.onChange(value);
    this.setObjSelected(value);
  };

  handleSearch = value => {
    const { getParamOnSearch } = this.props;
    if (!getParamOnSearch) {
      return;
    }
    const paramSearch = getParamOnSearch(value);
    this.actionGetData(this.props, paramSearch);
  };

  render() {
    const { data, loading } = this.state;
    this.createFieldObjSelected();
    return (
      <Select
        showSearch
        style={{ width: '100%' }}
        loading={loading}
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        {...this.props}
        onSearch={this.handleSearch}
        onChange={this.handleSelectChange}
      >
        {data.map(item => (
          <Option key={this.valueOpt(item)} value={this.valueOpt(item)}>
            {this.labelOpt(item)}
          </Option>
        ))}
      </Select>
    );
  }
}
