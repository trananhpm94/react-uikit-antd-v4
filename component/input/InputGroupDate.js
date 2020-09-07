import React, { Component } from 'react';
import { Input } from 'antd';
import './styles/index.scss';

const InputGroup = Input.Group;
const Separator = () => (
  <Input
    style={{
      width: 10,
      padding: 0,
      borderLeft: 0,
      pointerEvents: 'none',
      backgroundColor: '#fff',
    }}
    placeholder="/"
    disabled
  />
);

export default class InputGroupDate extends Component {
  state = {
    dd: '',
    mm: '',
    yyyy: '',
  };

  componentWillReceiveProps = nextProps => {
    if (this.props.value !== nextProps.value) {
      this.handleSetValueToState(nextProps.value);
    }
  };

  onChange = (e, field, { maxValue, maxLength }) => {
    const flow = ['dd', 'mm', 'yyyy'];
    const indexOfField = flow.indexOf(field);
    const nextInput = `input${(flow[indexOfField + 1] || '').toUpperCase()}`;
    const preInput = `input${(flow[indexOfField - 1] || '').toUpperCase()}`;
    const { value } = e.target;
    const reg = /^\d+$/;
    if (value === '') {
      this.triggerChange({ [field]: '' });
      if (this[preInput]) {
        this[preInput].focus();
      }
      return;
    }
    if (reg.test(value) && parseInt(value) <= maxValue) {
      this.triggerChange({ [field]: value });
      if (value.length === maxLength && this[nextInput]) {
        this[nextInput].focus();
      }
    }
  };

  onBlur = (e, field, { maxLength }) => {
    const { value } = e.target;
    if (value === '') {
      return;
    }
    if (value !== '' && parseInt(value) === 0) {
      this.triggerChange({ [field]: '' });
      return;
    }
    if (value.length < maxLength) {
      this.triggerChange({ [field]: value.padStart(maxLength, '0') });
    }
  };

  triggerChange = changedValue => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props;
    if (onChange) {
      const newState = { ...this.state, ...changedValue };
      const { dd } = newState;
      let { mm, yyyy } = newState;
      if (dd !== '') {
        mm = `${mm && mm !== '' ? mm : 'xx'}-`;
      }
      if (mm !== '') {
        yyyy = `${yyyy && yyyy !== '' ? yyyy : 'xxxx'}-`;
      }
      const value = `${yyyy}${mm}${dd}`;
      onChange(value);
      this.setState(changedValue);
    }
  };

  handleSetValueToState = (value = '') => {
    let [yyyy, mm, dd] = value.split('-');
    yyyy = yyyy && yyyy !== 'xxxx' ? yyyy : '';
    mm = mm && mm !== 'xx' ? mm : '';
    dd = dd && dd !== 'xx' ? dd : '';
    this.setState({ yyyy, mm, dd });
  };

  render() {
    const { dd, mm, yyyy } = this.state;
    return (
      <InputGroup style={{ width: 'fit-content' }} className="InputGroupDate" compact>
        <Input
          onChange={e => this.onChange(e, 'dd', { maxValue: 31, maxLength: 2 })}
          onBlur={e => this.onBlur(e, 'dd', { maxLength: 2 })}
          value={dd}
          maxLength={2}
          style={{ width: 40, padding: 6, textAlign: 'center' }}
          placeholder="DD"
          ref={input => {
            this.inputDD = input;
          }}
        />
        <Separator />
        <Input
          onChange={e => this.onChange(e, 'mm', { maxValue: 12, maxLength: 2 })}
          value={mm}
          onBlur={e => this.onBlur(e, 'mm', { maxLength: 2 })}
          maxLength={2}
          style={{ width: 40, padding: 6, textAlign: 'center', borderLeft: 0 }}
          placeholder="MM"
          ref={input => {
            this.inputMM = input;
          }}
        />
        <Separator />
        <Input
          onChange={e => this.onChange(e, 'yyyy', { maxValue: 9999 })}
          value={yyyy}
          onBlur={e => this.onBlur(e, 'yyyy', { maxLength: 4 })}
          maxLength={4}
          style={{ width: 70, padding: 6 }}
          placeholder="YYYY"
          ref={input => {
            this.inputYYYY = input;
          }}
        />
      </InputGroup>
    );
  }
}
