import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import { objectEquals } from 'react-uikit/utils/functionUtil';
import { getConfig } from 'react-uikit/utils/uikitConfig';

const { Option } = Select;

const SelectAjax = props => {
  const {
    keyValue,
    keyLabel,
    setValue,
    setLabel,
    getParamOnSearch,
    onChange,
    handleGetDataResponse,
    allowGetObjSelected,
    allowGetData,
    form,
    params,
    service,
    typeValue,
    value,
  } = props;

  const [dataSelectAjax, setDataSelectAjax] = useState([]);
  const [loadingSelect, setLoadingSelect] = useState(false);

  if (!service) return;

  const checkValueNumber = () => {
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

  const handleGetDataResponseDefault = res => {
    return res.data.items;
  };

  const actionGetData = async (paramSearch = {}) => {
    removeValue();
    const { handleGetDataResponse = handleGetDataResponseDefault } = props;
    if (!allowGetData) {
      setDataSelectAjax([]);
      return;
    }
    setLoadingSelect(true);
    const res = await service({ ...params, ...paramSearch });
    const data = handleGetDataResponse(res);
    setDataSelectAjax(data);
    setLoadingSelect(false);
    checkValueNumber(props);
    setObjSelected(value);
  };

  const removeValue = () => {
    // console.log('props', props);
    // const { name: fieldName } = props['data-__field'];
    // const { value } = props;
    // const { setFieldsValue } = props.form;
    // if (value && setFieldsValue) {
    //   setFieldsValue({ [fieldName]: undefined });
    // }
  };

  const setObjSelected = value => {
    if (!allowGetObjSelected) {
      return;
    }
    const { setFieldsValue } = form;
    setFieldsValue({
      [createFieldObjSelectedName()]:
        dataSelectAjax.filter(item => value === valueOpt(item))[0] || {},
    });
  };

  const createFieldObjSelectedName = () => {
    const { name: fieldName } = props['data-__field'];
    return `objSelected.${fieldName}`;
  };

  const createFieldObjSelected = () => {
    if (!allowGetObjSelected) {
      return;
    }
    const { getFieldDecorator } = form;
    getFieldDecorator(createFieldObjSelectedName(), { initialValue: {} });
  };

  const valueOpt = item => {
    const value = setValue ? setValue(item) : item[keyValue];
    return value;
  };

  const labelOpt = item => {
    return setLabel ? setLabel(item) : item[keyLabel];
  };

  const handleSelectChange = value => {
    onChange(value);
    setObjSelected(value);
  };

  const handleSearch = value => {
    if (!getParamOnSearch) {
      return;
    }
    const paramSearch = getParamOnSearch(value);
    actionGetData(props, paramSearch);
  };

  useEffect(() => {
    actionGetData();
  }, [params]);

  return (
    <Select
      showSearch
      style={{ width: '100%' }}
      loading={loadingSelect}
      filterOption={(input, option) =>
        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      {...props}
      onSearch={handleSearch}
      onChange={handleSelectChange}
    >
      {dataSelectAjax.map(item => (
        <Option key={valueOpt(item)} value={valueOpt(item)}>
          {labelOpt(item)}
        </Option>
      ))}
    </Select>
  );
};

SelectAjax.propTypes = {
  keyLabel: PropTypes.string,
  setValue: PropTypes.func,
  setLabel: PropTypes.func,
  getParamOnSearch: PropTypes.func,
  onChange: PropTypes.func,
  handleGetDataResponse: PropTypes.func,
  allowGetObjSelected: PropTypes.bool,
  allowGetData: PropTypes.bool,
  form: PropTypes.object,
  params: PropTypes.object,
  service: PropTypes.any,
  typeValue: PropTypes.any,
  value: PropTypes.any,
};

SelectAjax.defaultProps = {
  keyValue: 'id',
  keyLabel: 'label',
  allowClear: true,
  allowGetData: true,
  typeValue: 'string',
  allowGetObjSelected: false,
  params: {},
  service: null,
  value: null,
};

export default React.memo(SelectAjax);
