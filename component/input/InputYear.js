import React, { Component } from 'react';
import { InputNumber } from 'antd';

export default class InputYear extends Component {
  state = {};
  render() {
    return <InputNumber {...this.props} />;
  }
}
