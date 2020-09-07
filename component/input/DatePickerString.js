import React, { Component } from 'react';
import { DatePicker } from 'antd';
import {
  dateToStringParamReq,
  stringParamReqToDate,
  DATE_SHOW_UI,
} from 'react-uikit/utils/formatUtil';

export default class DatePickerString extends Component {
  state = {
    value: null,
  };

  componentWillMount() {
    this.setState({ value: stringParamReqToDate(this.props.value) });
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.value !== this.props.value) {
      this.setState({ value: stringParamReqToDate(nextProps.value) });
    }
  };

  handleChange = value => {
    this.props.onChange(dateToStringParamReq(value));
  };
  render() {
    const { value } = this.state;
    return (
      <DatePicker
        format={DATE_SHOW_UI}
        {...this.props}
        value={value}
        onChange={this.handleChange}
      />
    );
  }
}
