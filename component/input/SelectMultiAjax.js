import React, { Component } from 'react';
import { Select } from 'antd';
import { objectEquals } from 'react-uikit/utils/functionUtil';
import { getConfig } from 'react-uikit/utils/uikitConfig';
const { Option } = Select;
export default class SelectMultiAjax extends Component {
  static defaultProps = {
    keyValue: 'id',
    keyLabel: 'name',
    handleGetDataResponse: res => res.data.content,
    allowClear: true,
    allowGetData: true,
    allowGetObjSelected: false,
    typeValue: 'string',
    disabled: false,
    ...getConfig('component/input/SelectMultiAjax'),
  };
  state = {
    data: [],
    loading: false,
    isFirstTime: true,
    placeholder: false,
  };

  componentDidMount = () => {
    this.actionGetData(this.props);
    this.checkShowCount(this.props);
  };

  componentWillReceiveProps = nextProps => {
    if (!objectEquals(nextProps.params, this.props.params)) {
      this.actionGetData(nextProps);
    }
    if (!nextProps.value) {
      this.setState({
        placeholder: false,
      });
    }
    this.checkValueNumber(nextProps);
    this.checkShowCount(nextProps);
  };

  setObjSelected = value => {
    const { allowGetObjSelected, form } = this.props;
    if (!allowGetObjSelected && !form) {
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

    if (Array.isArray(value) && value.length > 0 && typeValue === 'int') {
      if (typeof value[0] === 'number') {
        return;
      }
      const valueNumber = value.map(v => parseInt(v));
      onChange(valueNumber);
    }
  };

  createFieldObjSelectedName = () => {
    const { name: fieldName } = this.props['data-__field'];
    return `objSelected.${fieldName}`;
  };

  createFieldObjSelected = () => {
    const { allowGetObjSelected, form } = this.props;
    if (!allowGetObjSelected && !form) {
      return;
    }
    const { getFieldDecorator } = this.props.form;
    getFieldDecorator(this.createFieldObjSelectedName(), { initialValue: {} });
  };

  removeValue = () => {
    const { name: fieldName } = this.props['data-__field'];
    const { setFieldsValue, value } = this.props;
    if (value && setFieldsValue) {
      setFieldsValue({ [fieldName]: undefined });
    }
  };

  actionGetData = async (props = {}) => {
    if (!this.props.service) {
      return;
    }
    if (this.state.isFirstTime) {
      this.setState({
        isFirstTime: false,
      });
    } else {
      this.removeValue();
    }
    const { allowGetData, params, handleGetDataResponse } = props;
    if (!allowGetData) {
      this.setState({
        data: [],
      });
      return;
    }
    this.setState({
      loading: true,
    });

    const res = await this.props.service({ ...params, isPagingEnabled: false });
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

  checkShowCount = ({ showCount, value }) => {
    if (showCount && value && Array.isArray(value) && value.length > 0) {
      this.setState({ placeholder: `Đã chọn ${value.length} giá trị` });
    }
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
    const { showCount } = this.props;
    this.props.onChange(value);
    this.setObjSelected(value);
    if (showCount) {
      if (value.length !== 0) {
        this.setState({ placeholder: `Đã chọn ${value.length} giá trị` });
      } else {
        this.setState({ placeholder: false });
      }
    }
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
    const { data, loading, placeholder } = this.state;
    const { showCount } = this.props;
    return (
      <Select
        mode="multiple"
        showSearch
        style={{ width: '100%' }}
        loading={loading}
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        {...this.props}
        placeholder={placeholder || this.props.placeholder}
        className={`${this.props.className} ${
          showCount && placeholder ? 'show-count-selection' : ''
        }`}
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
